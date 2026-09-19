"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { YikiBetBoard } from "@/app/components/lottery/yiki/YikiBetBoard";
import { YIKI_BET_TYPES, YIKI_GROUPS, YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";
import { getLotteryMarketBySlug } from "@/app/data/lotteryMarketsMockData";
import { getLotteryPlayRoundById } from "@/app/data/lotteryRoundsMockData";

/**
 * Step 3 — แทงหวยตลาดรายวัน (/lottery/[marketId]/[roundId])
 */
export default function LotteryMarketPlayPage() {
  const urlParams = useParams();
  const marketId = (urlParams?.marketId as string) || "";
  const roundId = (urlParams?.roundId as string) || "";
  const market = useMemo(() => getLotteryMarketBySlug(marketId), [marketId]);
  const playRound = useMemo(() => getLotteryPlayRoundById(marketId, roundId), [marketId, roundId]);

  const round = playRound
    ? {
        id: playRound.id,
        label: playRound.drawLabel,
        closeAt: playRound.closeAt,
      }
    : null;

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: market?.title ?? "แทงหวย", backHref: `/lottery/${marketId}` }}
      hideBottomNav
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {market && round ? (
        <YikiBetBoard
          round={round}
          groups={YIKI_GROUPS}
          betTypes={YIKI_BET_TYPES}
          settlementTypes={YIKI_SETTLEMENT_TYPES}
          backHref={`/lottery/${marketId}`}
          flagLabel={market.flagLabel}
          flagTone={market.flagTone}
        />
      ) : (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>
      )}
    </LobbyDesktopPageShell>
  );
}
