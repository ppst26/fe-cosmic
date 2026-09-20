import React from "react";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { LotteryCountdown, LotteryFlagOrb } from "./LotteryFlagOrb";
import { formatCountdown } from "./lotteryUtils";

interface LotteryDrawCardProps {
  title: string;
  drawLabel: string;
  remainingMs: number | null;
  flagLabel?: string;
  flagTone?: LotteryFlagTone;
}

/**
 * การ์ดหัวงวด — ใช้ทุกประเภทหวย (รัฐบาลไทย · ยี่กี · หวยหุ้น)
 */
export function LotteryDrawCard({
  title,
  drawLabel,
  remainingMs,
  flagLabel = "TH",
  flagTone = "th",
}: LotteryDrawCardProps) {
  return (
    <section className="thai-lotto-draw" aria-label="ข้อมูลงวด">
      <LotteryFlagOrb label={flagLabel} tone={flagTone} size="lg" />
      <div className="min-w-0 flex-1">
        <h1 className="thai-lotto-draw__title">{title}</h1>
        <p className="thai-lotto-draw__meta">{drawLabel}</p>
      </div>
      <div className="thai-lotto-draw__close">
        <span className="thai-lotto-draw__close-label">ปิดรับใน</span>
        <LotteryCountdown
          label={remainingMs === null ? "--:--:--" : formatCountdown(remainingMs)}
        />
      </div>
    </section>
  );
}
