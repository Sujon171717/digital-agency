"use client";

import { useEffect, useState } from "react";
import type { VideoEntry } from "@/lib/types";
import { getVideoSource } from "@/lib/video";

function VideoFrame({ video, eager = false }: { video: VideoEntry; eager?: boolean }) {
  const source = getVideoSource(video.videoUrl);
  if (!source) return <div className="grid h-full place-items-center bg-slate-100 text-sm text-slate-400">Video unavailable</div>;

  return (
    <iframe
      title="Video preview"
      src={source.embedUrl}
      className="h-full w-full border-0"
      loading={eager ? "eager" : "lazy"}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

export function VideoGallery({ videos }: { videos: VideoEntry[] }) {
  const [selected, setSelected] = useState<VideoEntry | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  if (videos.length === 0) return null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            aria-label="Open video"
            onClick={() => setSelected(video)}
            className="group relative aspect-video overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="pointer-events-none h-full w-full">
              <VideoFrame video={video} />
            </div>
            <span className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-900/0 transition group-hover:bg-slate-900/20">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-accent opacity-0 shadow-lg transition group-hover:opacity-100" aria-hidden="true">
                ▶
              </span>
            </span>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Video player" onMouseDown={() => setSelected(null)}>
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <VideoFrame video={selected} eager />
            <button type="button" onClick={() => setSelected(null)} aria-label="Close video" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white transition hover:bg-black">
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}