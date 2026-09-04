"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/content";
import { useSectionProgress } from "@/lib/useSectionProgress";

export function HeroPrism() {
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
    <div ref={ref} className="scene-3d grid h-[320px] place-items-center md:h-[420px]">
      <div
        className="prism"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 80ms linear",
        }}
      >
        <div className="prism-face front">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent">Website</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">1,000 SAR</p>
          </div>
        </div>
        <div className="prism-face right">
          <p className="text-sm leading-6 text-slate-600">Paid media, SEO, and brand systems.</p>
        </div>
        <div className="prism-face back">
          <p className="text-3xl font-bold text-accent">BST</p>
        </div>
        <div className="prism-face left">
          <p className="text-sm leading-6 text-slate-600">{brand.tagline}</p>
        </div>
        <div className="prism-face top">
          <p className="text-xs tracking-[0.35em] uppercase text-accent">Support</p>
        </div>
        <div className="prism-face bottom">
          <p className="text-xs tracking-[0.35em] uppercase text-accent">Technology</p>
        </div>
      </div>
    </div>
  );
}
