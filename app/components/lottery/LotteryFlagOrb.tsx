import React from "react";
import type { LotteryFlagTone } from "@/app/types/lottery";

/**
 * ไอคอนธง/เหรียญ mock ของตลาดหวย
 * ใช้ใน LotteryHubContent (feature / grid / ผลหวย) และหน้าแทงหวยรัฐบาลไทย
 */
export function LotteryFlagOrb({
  label,
  tone,
  size = "md",
}: {
  label: string;
  tone: LotteryFlagTone;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`lottery-flag lottery-flag--${size} lottery-flag--${tone}`}
      aria-hidden="true"
    >
      <span className="lottery-flag__sphere">{label.slice(0, 2)}</span>
      <span className="lottery-flag__coin" />
    </span>
  );
}

/** ไอคอนนาฬิกาเล็กสำหรับ countdown */
function ClockMiniIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

/** ป้าย countdown สีเขียว — ใช้ใน LotteryHubContent และ ThaiLottoDrawCard */
export function LotteryCountdown({ label }: { label: string }) {
  return (
    <span className="lottery-countdown">
      <ClockMiniIcon />
      <span className="tabular-nums">{label}</span>
    </span>
  );
}
