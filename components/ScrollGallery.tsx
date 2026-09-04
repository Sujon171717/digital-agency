"use client";

import { services } from "@/lib/content";
import { useSectionProgress } from "@/lib/useSectionProgress";

const slides = services.slice(0, 8);

export function ScrollGallery() {
  const { ref, progress } = useSectionProgress<HTMLElement>();

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 max-w-6xl px-4">
          <p className="text-xs tracking-[0.28em] uppercase text-accent">Scroll to explore</p>
          <h2 className="mt-3 text-4xl font-bold md:text-6xl">Capabilities in motion</h2>
        </div>
        <div className="scene-3d relative h-[340px]">
          <div className="preserve-3d absolute inset-0 flex items-center justify-center">
            {slides.map((slide, index) => {
              const local = progress * (slides.length - 1) - index;
              const x = local * 270;
              const z = -Math.abs(local) * 220;
              const rotateY = local * -42;
              const opacity = Math.max(0.12, 1 - Math.abs(local) * 0.55);
              const scale = Math.max(0.78, 1 - Math.abs(local) * 0.12);
              return (
                <article
                  key={slide.label}
                  className="scroll-card preserve-3d absolute w-[240px] rounded-2xl p-6 md:w-[280px]"
                  style={{
                    opacity,
                    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  }}
                >
                  <p className="text-xs tracking-[0.3em] text-accent">{slide.icon}</p>
                  <h3 className="mt-6 text-lg font-medium leading-7">{slide.label}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
