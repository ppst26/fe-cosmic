"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryMarketRoundsView } from "@/app/components/lottery/LotteryMarketRoundsView";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";

/**
 * Step 2 — รายการรอบหวยตลาดทั่วไป (/lottery/[marketId])
 */
export default function LotteryMarketRoundsPage() {
  const urlParams = useParams();
  const marketId = (urlParams?.marketId as string) || "";
  const entry = getLotteryCatalogEntry(marketId);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "แทงหวย", backHref: "/lottery" }}
      mainClassName="w-full max-w-none mx-0 lg:max-w-none"
    >
      {entry ? (
        <LotteryMarketRoundsView marketSlug={marketId} />
      ) : (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบตลาดหวยนี้</p>
      )}
    </LobbyDesktopPageShell>
  );
}
