"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { YikiBetBoard } from "@/app/components/lottery/yiki/YikiBetBoard";
import { YIKI_BET_TYPES, YIKI_GROUPS, YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";
import { getLotteryMarketBySlug, type LotteryMarketConfig } from "@/app/data/lotteryMarketsMockData";

function LotteryMarketBoard({ market }: { market: LotteryMarketConfig }) {
  const [round] = useState(() => {
    const closeAt = new Date(Date.now() + market.closesInMinutes * 60 * 1000);
    return { id: market.slug, label: market.title, closeAt: closeAt.toISOString() };
  });

  return (
    <YikiBetBoard
      round={round}
      groups={YIKI_GROUPS}
      betTypes={YIKI_BET_TYPES}
      settlementTypes={YIKI_SETTLEMENT_TYPES}
      backHref="/lottery"
      flagLabel={market.flagLabel}
      flagTone={market.flagTone}
    />
  );
}

/**
 * หน้าแทงหวยหุ้น/ต่างประเทศ (/lottery/[marketId])
 */
export default function LotteryMarketPage() {
  const urlParams = useParams();
  const marketId = (urlParams?.marketId as string) || "";
  const market = useMemo(() => getLotteryMarketBySlug(marketId), [marketId]);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: market?.title ?? "แทงหวย", backHref: "/lottery" }}
      hideBottomNav
      mainClassName="yiki-page-main mx-auto max-w-[var(--content-max)] pb-0 pt-4 lg:mx-0 lg:max-w-none lg:pb-4 lg:pt-0"
    >
      {market ? (
        <LotteryMarketBoard key={market.slug} market={market} />
      ) : (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบตลาดหวยนี้</p>
      )}
    </LobbyDesktopPageShell>
  );
}
