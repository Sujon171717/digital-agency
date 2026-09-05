"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { createReview, deleteReview, listReviews, updateReview } from "@/lib/firestore";
import type { Review } from "@/lib/types";
import { getDriveImageFallbackUrl, getDriveImageUrl, getDriveFileId } from "@/lib/video";

const empty = { imageUrl: "" };

export default function ReviewsAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setItems(await listReviews());
  }

  useEffect(() => {
    let cancelled = false;
    listReviews()
      .then((nextItems) => {
        if (!cancelled) setItems(nextItems);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!getDriveFileId(form.imageUrl)) {
      setError("Enter a valid Google Drive image link.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (editing) await updateReview(editing, { imageUrl: form.imageUrl });
      else await createReview({ imageUrl: form.imageUrl });
      setForm(empty);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Reviews</h1>
      <p className="mt-2 text-sm text-slate-500">Add review screenshot images using shareable Google Drive links.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5">
        <Field label="Google Drive image link">
          <input className={inputClass} type="url" required placeholder="https://drive.google.com/file/d/.../view" value={form.imageUrl} onChange={(event) => setForm({ imageUrl: event.target.value })} />
        </Field>
        {error ? <p className="text-red-500">{error}</p> : null}
        <div className="flex gap-2">
          <button disabled={busy} className="rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-[#1e8a80] disabled:opacity-40">
            {busy ? "Saving..." : editing ? "Update review" : "Add review"}
          </button>
          {editing ? <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button> : null}
        </div>
      </form>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <img
              src={getDriveImageUrl(item.imageUrl) ?? item.imageUrl}
              alt="Review"
              onError={(event) => {
                const fallback = getDriveImageFallbackUrl(item.imageUrl);
                if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
              }}
              className="aspect-[16/9] max-h-56 w-full object-cover"
            />
            <div className="flex gap-3 p-4 text-sm">
              <button className="text-accent hover:underline" onClick={() => { setEditing(item.id); setForm({ imageUrl: item.imageUrl }); }}>Edit</button>
              <button className="text-red-400" onClick={() => { if (confirm("Delete this review?")) deleteReview(item.id).then(refresh); }}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
