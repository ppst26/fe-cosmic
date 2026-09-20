"use client";

import React from "react";
import { LobbyDesktopPageShell } from "@/app/components/layout/LobbyDesktopPageShell";
import { LotteryMarketRoundsView } from "@/app/components/lottery/LotteryMarketRoundsView";

/** Step 2 — รายการรอบหวยยี่กี 5 นาที */
export default function Yiki5RoundListPage() {
  return (
    <LobbyDesktopPageShell
      activeCategoryId="lottery"
      subHeader={{ title: "แทงหวย", backHref: "/lottery" }}
      mainClassName="w-full max-w-none mx-0 lg:max-w-none"
    >
      <LotteryMarketRoundsView marketSlug="yiki-5" />
    </LobbyDesktopPageShell>
  );
}
