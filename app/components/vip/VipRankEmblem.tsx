"use client";

import React, { useEffect, useRef, useState } from "react";
import type { VipRankId } from "@/app/types/vip";
import { getVipRankTier, getVipRankVideoSrc } from "@/app/data/vipMockData";
import { LockIcon } from "../ui/Icons";

/**
 * ตราแรงค์ VIP — วิดีโอ webm จาก public/rank (fallback เป็น hex SVG)
 * ใช้ใน modal แท็บระดับของฉัน / แร็งค์ / ตารางสิทธิประโยชน์
 */
export function VipRankEmblem({
  rankId,
  size = "lg",
  inactive = false,
  /** false = หยุดที่เฟรมแรก (carousel ข้างๆ / ตารางสิทธิ) */
  playing = true,
}: {
  rankId: VipRankId;
  size?: "sm" | "lg";
  inactive?: boolean;
  playing?: boolean;
}) {
  const tier = getVipRankTier(rankId);
  const videoSrc = getVipRankVideoSrc(rankId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preferStatic, setPreferStatic] = useState(false);

  const dim = size === "lg" ? "h-[88px] w-[88px]" : "h-12 w-12";
  const gem = size === "lg" ? "h-7 w-7" : "h-4 w-4";
  const gradId = React.useId().replace(/:/g, "");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPreferStatic(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || preferStatic || !videoSrc) return;
    const shouldPlay = playing && !inactive;
    if (shouldPlay) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [playing, inactive, preferStatic, videoSrc]);

  if (videoSrc && !preferStatic) {
    return (
      <div
        className={`relative flex ${dim} items-center justify-center ${
          inactive ? "opacity-45 grayscale-[0.85]" : ""
        } ${playing && !inactive ? "drop-shadow-[0_4px_16px_rgba(245,197,66,0.25)]" : ""}`}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
        {inactive && size === "lg" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LockIcon className="h-5 w-5 text-[var(--text-muted)]/90" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex ${dim} items-center justify-center ${
        inactive ? "opacity-45 grayscale-[0.85]" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full ${
          inactive ? "" : "drop-shadow-[0_4px_16px_rgba(245,197,66,0.35)]"
        }`}
      >
        <polygon
          points="50,4 92,28 92,72 50,96 8,72 8,28"
          fill={`url(#${gradId})`}
          stroke={tier.accent}
          strokeWidth="2"
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d2f14" />
            <stop offset="50%" stopColor="#6b4e12" />
            <stop offset="100%" stopColor="#2a2210" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`${gem} rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-600 ${
          inactive ? "shadow-none" : "shadow-[0_0_12px_rgba(251,191,36,0.6)]"
        }`}
      />
      {inactive && size === "lg" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LockIcon className="h-5 w-5 text-[var(--text-muted)]/90" />
        </span>
      )}
    </div>
  );
}
