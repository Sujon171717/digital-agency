"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell, Field, inputClass } from "@/components/AdminShell";
import { createVideo, deleteVideo, listVideos, updateVideo } from "@/lib/firestore";
import type { VideoEntry } from "@/lib/types";
import { getVideoSource } from "@/lib/video";

const empty = { videoUrl: "" };

export default function VideosAdmin() {
  const [items, setItems] = useState<VideoEntry[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setItems(await listVideos());
  }

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!getVideoSource(form.videoUrl)) {
      setError("Enter a valid YouTube or Google Drive video link.");
      return;
    }
    setBusy(true);
    try {
      if (editing) await updateVideo(editing, form);
      else await createVideo(form);
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
      <h1 className="text-3xl font-semibold">Video Editing</h1>
      <p className="mt-2 text-sm text-slate-500">Add YouTube or Google Drive links to your previous work.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-white p-5">
        <Field label="Video link">
          <input className={inputClass} type="url" required placeholder="https://youtube.com/... or https://drive.google.com/..." value={form.videoUrl} onChange={(event) => setForm({ videoUrl: event.target.value })} />
        </Field>
        {error ? <p className="text-red-500">{error}</p> : null}
        <div className="flex gap-2">
          <button disabled={busy} className="rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-[#1e8a80] disabled:opacity-40">
            {busy ? "Saving..." : editing ? "Update video" : "Add video"}
          </button>
          {editing ? <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button> : null}
        </div>
      </form>
      <div className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 sm:w-48">
              {getVideoSource(item.videoUrl) ? <iframe title="Video preview" src={getVideoSource(item.videoUrl)?.embedUrl} className="pointer-events-none h-full w-full border-0" loading="lazy" /> : null}
            </div>
            <p className="min-w-0 flex-1 truncate text-sm text-slate-500">{item.videoUrl}</p>
            <div className="flex gap-3 text-sm">
              <button className="text-accent hover:underline" onClick={() => { setEditing(item.id); setForm({ videoUrl: item.videoUrl }); }}>Edit</button>
              <button className="text-red-400" onClick={() => { if (confirm("Delete this video?")) deleteVideo(item.id).then(refresh); }}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}