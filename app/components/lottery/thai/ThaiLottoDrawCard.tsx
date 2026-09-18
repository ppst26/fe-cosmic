import React from "react";
import type { ThaiLottoDraw } from "@/app/types/lottery";
import { LotteryCountdown, LotteryFlagOrb } from "../LotteryFlagOrb";
import { formatCountdown } from "../lotteryUtils";

/**
 * การ์ดหัวงวด — ชื่อหวย · งวด · นับถอยหลังปิดรับ
 * ใช้ใน ThaiLottoBetBoard (board เป็นเจ้าของ timer; null = ยังไม่ mount)
 */
export function ThaiLottoDrawCard({
  draw,
  remainingMs,
}: {
  draw: ThaiLottoDraw;
  remainingMs: number | null;
}) {
  return (
    <section className="thai-lotto-draw" aria-label="ข้อมูลงวด">
      <LotteryFlagOrb label="TH" tone="th" size="lg" />
      <div className="min-w-0 flex-1">
        <h1 className="thai-lotto-draw__title">หวยรัฐบาลไทย</h1>
        <p className="thai-lotto-draw__meta">{draw.drawLabel}</p>
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
