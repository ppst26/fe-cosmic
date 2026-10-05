"use client";

import { useEffect, useRef } from "react";

/**
 * วิดีโอโปร่งใสสำหรับ Safari/iOS ที่ไม่รองรับ alpha ใน WebM
 * ไฟล์ MP4 วางภาพสี (premultiplied บนดำ) ไว้ครึ่งบน และ mask alpha (ขาวดำ) ไว้ครึ่งล่าง
 * ประกอบเป็น RGBA ใน canvas — สร้างไฟล์ด้วย ffmpeg (ดู design.md § VIP rank video)
 */
export function StackedAlphaVideo({
  src,
  playing,
  className,
}: {
  src: string;
  playing: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const scratch = document.createElement("canvas");
    const sctx = scratch.getContext("2d", { willReadFrequently: true });
    const ctx = canvas.getContext("2d");
    if (!sctx || !ctx) return;

    let raf = 0;
    const draw = () => {
      const w = video.videoWidth;
      const h = video.videoHeight / 2;
      if (!w || !h) return;
      if (scratch.width !== w || scratch.height !== h * 2) {
        scratch.width = w;
        scratch.height = h * 2;
        canvas.width = w;
        canvas.height = h;
      }
      sctx.drawImage(video, 0, 0);
      const color = sctx.getImageData(0, 0, w, h);
      const mask = sctx.getImageData(0, h, w, h).data;
      const px = color.data;
      for (let i = 0; i < px.length; i += 4) {
        const a = mask[i] ?? 0;
        if (a === 0) {
          px[i + 3] = 0;
          continue;
        }
        // ภาพสี premultiplied บนดำ → คืนเป็น straight alpha
        const k = 255 / a;
        px[i] = Math.min(255, (px[i] ?? 0) * k);
        px[i + 1] = Math.min(255, (px[i + 1] ?? 0) * k);
        px[i + 2] = Math.min(255, (px[i + 2] ?? 0) * k);
        px[i + 3] = a;
      }
      ctx.putImageData(color, 0, 0);
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);

    video.addEventListener("loadeddata", draw);
    video.addEventListener("seeked", draw);
    video.addEventListener("play", start);
    video.addEventListener("pause", stop);
    return () => {
      stop();
      video.removeEventListener("loadeddata", draw);
      video.removeEventListener("seeked", draw);
      video.removeEventListener("play", start);
      video.removeEventListener("pause", stop);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => undefined);
    else video.pause();
  }, [playing, src]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute h-px w-px opacity-0"
      />
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
    </>
  );
}

/** Safari (macOS/iOS) และเบราว์เซอร์ iOS ทุกตัว (WebKit) — ไม่อ่าน alpha ของ WebM */
export function needsStackedAlpha(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(ua);
  return isIOS || isSafari;
}
