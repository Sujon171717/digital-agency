"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LanguageProvider";
import { useSectionProgress } from "@/lib/useSectionProgress";

export function HeroPrism() {
  const { t } = useLang();
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth - 0.5) * 24,
        y: (event.clientY / window.innerHeight - 0.5) * -18,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const rotateY = pointer.x + progress * 220;
  const rotateX = pointer.y - 16 + progress * 28;

  return (
    <div ref={ref} className="scene-3d relative grid h-[320px] place-items-center md:h-[470px]">
      <div className="absolute h-64 w-64 rounded-full border border-accent/20 bg-accent/5 shadow-[0_0_100px_rgba(12,155,135,0.18)] md:h-80 md:w-80" />
      <div
        className="prism z-10"
        style={{
          transform: `scale(var(--prism-scale)) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 80ms linear",
        }}
      >
        <div className="prism-face front">
          <div>
            <p className="eyebrow">{t.offerTitle}</p>
            <p className="mt-2 font-display text-5xl text-slate-900">1,000 SAR</p>
            <p className="mt-2 text-xs text-slate-500">{t.offerBody}</p>
          </div>
        </div>
        <div className="prism-face right">
          <p className="text-sm leading-6 text-slate-600">{t.servicesIntro}</p>
        </div>
        <div className="prism-face back">
          <p className="text-3xl font-bold text-accent">BST</p>
        </div>
        <div className="prism-face left">
          <p className="text-sm leading-6 text-slate-600">{t.tagline}</p>
        </div>
        <div className="prism-face top">
          <p className="text-xs tracking-[0.35em] uppercase text-accent">{t.legalTitle}</p>
        </div>
        <div className="prism-face bottom">
          <p className="text-xs tracking-[0.35em] uppercase text-accent">{t.navServices}</p>
        </div>
      </div>
    </div>
  );
}
