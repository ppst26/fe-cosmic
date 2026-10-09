"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryMarketRoundsView } from "@/app/components/lottery/LotteryMarketRoundsView";
import { useT } from "@/lib/i18n/I18nProvider";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";

/**
 * Step 2 — รายการรอบหวยตลาดทั่วไป (/lottery/[marketId])
 */
export default function LotteryMarketRoundsPage() {
  const t = useT("lottery");
  const urlParams = useParams();
  const marketId = (urlParams?.marketId as string) || "";
  const entry = getLotteryCatalogEntry(marketId);

  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: t("hub.title"), backHref: "/lottery" }}
      mainClassName="w-full max-w-none mx-0 lg:max-w-none"
    >
      {entry ? (
        <LotteryMarketRoundsView marketSlug={marketId} />
      ) : (
        <p className="py-10 text-center text-sm text-[var(--text-secondary)]">{t("market.marketNotFound")}</p>
      )}
    </LobbyDesktopPageShell>
  );
}
