"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { createDesignAsset, deleteDesignAsset, listDesignAssets, updateDesignAsset } from "@/lib/firestore";
import type { DesignAsset, DesignAssetKind } from "@/lib/types";
import { getDriveFileId, getDriveImageFallbackUrl, getDriveImageUrl } from "@/lib/video";

const empty = { imageUrl: "", kind: "poster" as DesignAssetKind };

export default function DesignsAdmin() {
  const [items, setItems] = useState<DesignAsset[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setItems(await listDesignAssets());
  }

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
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
      if (editing) await updateDesignAsset(editing, form);
      else await createDesignAsset(form);
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
      <h1 className="text-3xl font-semibold">Poster and Banner Design</h1>
      <p className="mt-2 text-sm text-slate-500">Add poster and banner images with shareable Google Drive links. They appear publicly in the design gallery.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5 md:grid-cols-2">
        <Field label="Google Drive image link">
          <input className={inputClass} type="url" required placeholder="https://drive.google.com/file/d/.../view" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
        </Field>
        <Field label="Design type">
          <select className={inputClass} value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as DesignAssetKind })}>
            <option value="poster">Poster</option>
            <option value="banner">Banner</option>
          </select>
        </Field>
        {error ? <p className="text-red-500 md:col-span-2">{error}</p> : null}
        <div className="flex gap-2 md:col-span-2">
          <button disabled={busy} className="rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-[#1e8a80] disabled:opacity-40">
            {busy ? "Saving..." : editing ? "Update design" : "Add design"}
          </button>
          {editing ? <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button> : null}
        </div>
      </form>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <img
              src={getDriveImageUrl(item.imageUrl) ?? item.imageUrl}
              alt={`${item.kind} design`}
              onError={(event) => {
                const fallback = getDriveImageFallbackUrl(item.imageUrl);
                if (fallback && event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
              }}
              className="aspect-[16/9] max-h-56 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-3 p-4 text-sm">
              <span className="font-semibold capitalize text-slate-500">{item.kind}</span>
              <div className="flex gap-3">
                <button className="text-accent hover:underline" onClick={() => { setEditing(item.id); setForm({ imageUrl: item.imageUrl, kind: item.kind }); }}>Edit</button>
                <button className="text-red-400" onClick={() => { if (confirm("Delete this design?")) deleteDesignAsset(item.id).then(refresh); }}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
