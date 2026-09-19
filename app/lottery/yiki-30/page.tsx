"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryMarketRoundsView } from "@/app/components/lottery/LotteryMarketRoundsView";

/**
 * Step 2 — รายการรอบหวยยี่กี 30 นาที (/lottery/yiki-30)
 */
export default function Yiki30RoundListPage() {
  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "แทงหวย", backHref: "/lottery" }}
      mainClassName="mx-auto max-w-[var(--content-max)] lg:mx-0 lg:max-w-none"
    >
      <LotteryMarketRoundsView marketSlug="yiki-30" />
    </LobbyDesktopPageShell>
  );
}
