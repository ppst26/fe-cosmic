"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { ThaiLottoBetBoard } from "@/app/components/lottery/thai/ThaiLottoBetBoard";
import { THAI_LOTTO_BET_TYPES, THAI_LOTTO_GROUPS } from "@/app/data/thaiLottoMockData";
import { getThaiLottoDrawByRoundId } from "@/app/data/lotteryRoundsMockData";

/**
 * Step 3 — แทงหวยรัฐบาลไทยตามรอบที่เลือก
 */
export default function ThaiGovernmentLotteryPlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";
  const draw = useMemo(() => getThaiLottoDrawByRoundId(roundId), [roundId]);

  return (
    <LotteryPlayPageShell
      title="หวยรัฐบาลไทย"
      backHref="/lottery/thai-government"
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      {({ onStepChange }) =>
        draw ? (
          <ThaiLottoBetBoard
            draw={draw}
            groups={THAI_LOTTO_GROUPS}
            betTypes={THAI_LOTTO_BET_TYPES}
            backHref="/lottery/thai-government"
            onStepChange={onStepChange}
          />
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>
        )
      }
    </LotteryPlayPageShell>
  );
}
