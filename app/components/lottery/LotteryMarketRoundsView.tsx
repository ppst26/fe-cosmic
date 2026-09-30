"use client";

import React, { useMemo } from "react";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { fetchLotteryPlayRounds, fetchThaiLottoBoard } from "@/lib/api/lotteryContent";
import { LotteryMarketShell } from "./LotteryMarketShell";
import { LotteryPlayRoundList } from "./LotteryPlayRoundList";
import { ThaiLottoResultPanel } from "./thai/ThaiLottoResultPanel";

interface LotteryMarketRoundsViewProps {
  marketSlug: string;
}

/**
 * หน้ารายการรอบ (step 2) — ใช้ใน /lottery/[slug] ทุกประเภท
 */
export function LotteryMarketRoundsView({ marketSlug }: LotteryMarketRoundsViewProps) {
  const entry = getLotteryCatalogEntry(marketSlug);
  const rounds = useMemo(() => fetchLotteryPlayRounds(marketSlug), [marketSlug]);
  const thaiLastResult = fetchThaiLottoBoard().lastResult;

  if (!entry) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบประเภทหวยนี้</p>
    );
  }

  const openCount = rounds.filter((round) => round.status === "open").length;

  const showThaiLastResult = marketSlug === "thai-government";

  return (
    <LotteryMarketShell activeEntry={entry} roundCount={openCount}>
      <LotteryPlayRoundList rounds={rounds} marketSlug={marketSlug} basePath={entry.roundsHref} />
      {showThaiLastResult ? (
        <div className="lottery-market-rounds__result hidden mt-4 min-w-0 lg:block">
          <ThaiLottoResultPanel result={thaiLastResult} />
        </div>
      ) : null}
    </LotteryMarketShell>
  );
}
