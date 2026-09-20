"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { LotteryPlayPageShell } from "@/app/components/lottery/LotteryPlayPageShell";
import { YikiBetBoard } from "@/app/components/lottery/yiki/YikiBetBoard";
import {
  YIKI_BET_TYPES,
  YIKI_GROUPS,
  YIKI_SETTLEMENT_TYPES,
  getYikiRoundById,
} from "@/app/data/yikiMockData";

/** Step 3 — แทงหวยยี่กี 5 นาที */
export default function Yiki5PlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";
  const round = useMemo(() => getYikiRoundById(roundId), [roundId]);

  return (
    <LotteryPlayPageShell
      title="หวยยี่กี 5 นาที"
      backHref="/lottery/yiki-5"
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {({ onStepChange }) =>
        round ? (
          <YikiBetBoard
            round={round}
            groups={YIKI_GROUPS}
            betTypes={YIKI_BET_TYPES}
            settlementTypes={YIKI_SETTLEMENT_TYPES}
            backHref="/lottery/yiki-5"
            onStepChange={onStepChange}
          />
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>
        )
      }
    </LotteryPlayPageShell>
  );
}
