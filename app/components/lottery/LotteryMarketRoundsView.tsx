"use client";

import React, { useMemo } from "react";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { THAI_LOTTO_LAST_RESULT } from "@/app/data/thaiLottoMockData";
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
  const rounds = useMemo(() => getLotteryPlayRounds(marketSlug), [marketSlug]);

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
        <div className="lottery-market-rounds__result">
          <ThaiLottoResultPanel result={THAI_LOTTO_LAST_RESULT} />
        </div>
      ) : null}
    </LotteryMarketShell>
  );
}
