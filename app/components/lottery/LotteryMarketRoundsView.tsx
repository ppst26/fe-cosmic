"use client";

import React, { useMemo } from "react";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { LotteryMarketShell } from "./LotteryMarketShell";
import { LotteryPlayRoundList } from "./LotteryPlayRoundList";

interface LotteryMarketRoundsViewProps {
  marketSlug: string;
}

/**
 * หน้ารายการรอบ (step 2) — ใช้ใน /lottery/[slug] ทุกประเภท
 */
export function LotteryMarketRoundsView({ marketSlug }: LotteryMarketRoundsViewProps) {
  const entry = getLotteryCatalogEntry(marketSlug);
  const rounds = useMemo(() => getLotteryPlayRounds(marketSlug), [marketSlug]);

  if (!entry) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบประเภทหวยนี้</p>
    );
  }

  const openCount = rounds.filter((round) => round.status === "open").length;

  return (
    <LotteryMarketShell activeEntry={entry} roundCount={openCount}>
      <LotteryPlayRoundList rounds={rounds} marketSlug={marketSlug} basePath={entry.roundsHref} />
    </LotteryMarketShell>
  );
}
