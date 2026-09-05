"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoEntry } from "@/lib/types";
import { getVideoSource } from "@/lib/video";
import { useLang } from "./LanguageProvider";

function VideoFrame({ video, eager = false }: { video: VideoEntry; eager?: boolean }) {
  const { t } = useLang();
  const source = getVideoSource(video.videoUrl);
  if (!source) return <div className="grid h-full place-items-center bg-slate-100 text-sm text-slate-400">Video unavailable</div>;

  return (
    <iframe
      title={t.videoPreview}
      src={source.embedUrl}
      className="h-full w-full border-0"
      loading={eager ? "eager" : "lazy"}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

export function VideoGallery({ videos }: { videos: VideoEntry[] }) {
  const { t } = useLang();
  const [selected, setSelected] = useState<VideoEntry | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shouldScroll = useRef(false);

  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    cardRefs.current[activeIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, [activeIndex]);

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
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{String(activeIndex + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { shouldScroll.current = true; setActiveIndex((current) => (current - 1 + videos.length) % videos.length); }} aria-label={t.previous} className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-lg text-foreground transition hover:border-accent hover:bg-accent hover:text-white">←</button>
          <button type="button" onClick={() => { shouldScroll.current = true; setActiveIndex((current) => (current + 1) % videos.length); }} aria-label={t.next} className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-lg text-foreground transition hover:border-accent hover:bg-accent hover:text-white">→</button>
        </div>
      </div>
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {videos.map((video, index) => (
          <button
            key={video.id}
            ref={(element) => { cardRefs.current[index] = element; }}
            type="button"
            aria-label={t.openVideo}
            onClick={() => setSelected(video)}
            className="group relative aspect-video w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[300px]"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t.videoPlayer} onMouseDown={() => setSelected(null)}>
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <VideoFrame video={selected} eager />
            <button type="button" onClick={() => setSelected(null)} aria-label={t.closeVideo} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white transition hover:bg-black">
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}