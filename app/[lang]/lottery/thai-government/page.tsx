"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryMarketRoundsView } from "@/app/components/lottery/LotteryMarketRoundsView";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * Step 2 — รายการรอบหวยรัฐบาลไทย (/lottery/thai-government)
 */
export default function ThaiGovernmentLotteryRoundsPage() {
  const t = useT("lottery");
  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: t("hub.title"), backHref: "/lottery" }}
      mainClassName="w-full max-w-none mx-0 lg:max-w-none"
    >
      <LotteryMarketRoundsView marketSlug="thai-government" />
    </LobbyDesktopPageShell>
  );
}
