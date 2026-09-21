import React from "react";
import type { LotteryFlagTone } from "@/app/types/lottery";
import type { YikiRound } from "@/app/types/yiki";
import { LotteryCountdown, LotteryFlagOrb } from "../LotteryFlagOrb";
import { formatCountdown } from "../lotteryUtils";

interface YikiRoundStripProps {
  round: YikiRound;
  remainingMs: number | null;
  /** ตราตลาด — ค่าเริ่มต้นเป็นยี่กี (YK/gold) หน้าตลาดหวยหุ้นอื่นส่งธงของตัวเองมาแทน */
  flagLabel?: string;
  flagTone?: LotteryFlagTone;
}

/**
 * แถบงวดแบบกระชับ — งวดปัจจุบัน + นับถอยหลังปิดรับ
 * ใช้ใน YikiBetBoard (board เป็นเจ้าของ timer; null = ยังไม่ mount) — ใช้ร่วมกันทั้งยี่กีและหวยหุ้นตลาดอื่น
 */
export function YikiRoundStrip({ round, remainingMs, flagLabel = "YK", flagTone = "gold" }: YikiRoundStripProps) {
  return (
    <section
      className="yiki-round-strip flex flex-wrap items-center gap-3 px-4 py-3"
      aria-label="ข้อมูลงวด"
    >
      <LotteryFlagOrb label={flagLabel} tone={flagTone} size="sm" />
      <span className="yiki-round-strip__label flex-1 min-w-0">{round.label}</span>
      <span className="yiki-round-strip__close flex flex-col items-end gap-[0.2rem]">
        <span className="yiki-round-strip__close-label">ปิดรับใน</span>
        <LotteryCountdown label={remainingMs === null ? "--:--" : formatCountdown(remainingMs)} />
      </span>
    </section>
  );
}
