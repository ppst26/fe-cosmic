"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryMarketRoundsView } from "@/app/components/lottery/LotteryMarketRoundsView";

/**
 * Step 2 — รายการรอบหวยรัฐบาลไทย (/lottery/thai-government)
 */
export default function ThaiGovernmentLotteryRoundsPage() {
  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "แทงหวย", backHref: "/lottery" }}
      mainClassName="w-full max-w-none mx-0 lg:max-w-none"
    >
      <LotteryMarketRoundsView marketSlug="thai-government" />
    </LobbyDesktopPageShell>
  );
}
