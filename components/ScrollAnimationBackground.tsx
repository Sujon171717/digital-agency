"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const frameCount = 209;
const frameWidth = 1920;
const frameHeight = 1080;

export function ScrollAnimationBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const frames: HTMLImageElement[] = [];
    let targetProgress = 0;
    let displayedProgress = 0;
    let activeFrame = -1;
    let loadedFrames = 0;
    let animationFrame = 0;

    function drawFrame(index: number) {
      const frame = frames[index];
      if (!frame?.complete || !frame.naturalWidth) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scale = Math.max(viewportWidth / frameWidth, viewportHeight / frameHeight);
      const width = frameWidth * scale;
      const height = frameHeight * scale;
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      context.drawImage(frame, (viewportWidth - width) / 2, (viewportHeight - height) / 2, width, height);
    }

    function resizeCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(activeFrame < 0 ? 0 : activeFrame);
    }

    function updateTarget() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }

    function render() {
      displayedProgress += (targetProgress - displayedProgress) * 0.1;
      const nextFrame = Math.min(frameCount - 1, Math.round(displayedProgress * (frameCount - 1)));
      if (nextFrame !== activeFrame) {
        activeFrame = nextFrame;
        drawFrame(activeFrame);
      }
      animationFrame = requestAnimationFrame(render);
    }

    for (let index = 1; index <= frameCount; index += 1) {
      const frame = new Image();
      frame.src = `/scroll-frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;
      frame.onload = () => {
        loadedFrames += 1;
        if (loadedFrames === 1) drawFrame(0);
      };
      frames.push(frame);
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("scroll", updateTarget, { passive: true });
    resizeCanvas();
    updateTarget();
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", updateTarget);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="site-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}