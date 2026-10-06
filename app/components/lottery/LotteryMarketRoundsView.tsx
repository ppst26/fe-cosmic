"use client";

import React from "react";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { useLotteryPlayRounds, useThaiLottoBoard } from "@/app/hooks/api/lottery";
import { LotteryMarketShell } from "./LotteryMarketShell";
import { LotteryPlayRoundList } from "./LotteryPlayRoundList";
import { ThaiLottoResultPanel } from "./thai/ThaiLottoResultPanel";
import { EmptyState } from "../ui/StatusState";
import { ResourceGate } from "../ui/ResourceGate";

interface LotteryMarketRoundsViewProps {
  marketSlug: string;
}

/**
 * หน้ารายการรอบ (step 2) — ใช้ใน /lottery/[slug] ทุกประเภท
 */
export function LotteryMarketRoundsView({ marketSlug }: LotteryMarketRoundsViewProps) {
  const entry = getLotteryCatalogEntry(marketSlug);
  /** รอบอิงเวลาจริง — ดึงฝั่ง client (SWR) ไม่มี SSR snapshot คนละเวลา */
  const roundsResource = useLotteryPlayRounds(marketSlug);
  const rounds = roundsResource.data ?? [];
  const thaiLastResult = useThaiLottoBoard().data?.lastResult ?? null;

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
      <ResourceGate resource={roundsResource} loadingLabel="กำลังโหลดรอบ…" errorTitle="โหลดรอบไม่สำเร็จ">
        {(list) => (
          <LotteryPlayRoundList rounds={list} marketSlug={marketSlug} basePath={entry.roundsHref} />
        )}
      </ResourceGate>
      {showThaiLastResult && thaiLastResult ? (
        <div className="lottery-market-rounds__result hidden mt-4 min-w-0 lg:block">
          <ThaiLottoResultPanel result={thaiLastResult} />
        </div>
      ) : null}
    </LotteryMarketShell>
  );
}
