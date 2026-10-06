"use client";

import React, { useMemo } from "react";
import { useIsClient } from "@/app/hooks/useIsClient";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { fetchLotteryPlayRounds, fetchThaiLottoBoard } from "@/lib/api/lotteryContent";
import { LotteryMarketShell } from "./LotteryMarketShell";
import { LotteryPlayRoundList } from "./LotteryPlayRoundList";
import { ThaiLottoResultPanel } from "./thai/ThaiLottoResultPanel";
import { EmptyState, LoadingState } from "../ui/StatusState";

interface LotteryMarketRoundsViewProps {
  marketSlug: string;
}

/**
 * หน้ารายการรอบ (step 2) — ใช้ใน /lottery/[slug] ทุกประเภท
 */
export function LotteryMarketRoundsView({ marketSlug }: LotteryMarketRoundsViewProps) {
  const entry = getLotteryCatalogEntry(marketSlug);
  /** รอบอิงเวลาจริง — สร้างหลัง mount เพื่อไม่ให้ SSR/client คนละ snapshot */
  const roundsReady = useIsClient();
  const rounds = useMemo(
    () => (roundsReady ? fetchLotteryPlayRounds(marketSlug) : []),
    [marketSlug, roundsReady],
  );
  const thaiLastResult = fetchThaiLottoBoard().lastResult;

  if (!entry) {
    return (
      <EmptyState
        className="mt-4"
        variant="card"
        title="ไม่พบประเภทหวยนี้"
        description="หวยนี้อาจปิดให้บริการแล้ว เลือกหวยอื่นจากหน้ารวม"
        primaryAction={{ label: "ดูหวยทั้งหมด", href: "/lottery" }}
      />
    );
  }

  const openCount = rounds.filter((round) => round.status === "open").length;

  const showThaiLastResult = marketSlug === "thai-government";

  return (
    <LotteryMarketShell activeEntry={entry} roundCount={openCount}>
      {!roundsReady ? (
        <LoadingState label="กำลังโหลดรอบ…" />
      ) : (
        <LotteryPlayRoundList rounds={rounds} marketSlug={marketSlug} basePath={entry.roundsHref} />
      )}
      {showThaiLastResult ? (
        <div className="lottery-market-rounds__result hidden mt-4 min-w-0 lg:block">
          <ThaiLottoResultPanel result={thaiLastResult} />
        </div>
      ) : null}
    </LotteryMarketShell>
  );
}
