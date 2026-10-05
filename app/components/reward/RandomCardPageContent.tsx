"use client";

import React from "react";
import { fetchRandomCard, fetchRewardHub } from "@/lib/api/rewardFeatures";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RandomCardRedeemPanel } from "./RandomCardRedeemPanel";

/**
 * แลกการ์ดสุ่ม — /reward/random-card (UI preview · Coming soon)
 */
export function RandomCardPageContent() {
  const hub = fetchRewardHub();
  const { displayCards, drawCost, comingSoonLabel, terms } = fetchRandomCard();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <RewardHubShortcutRow shortcuts={hub.shortcuts} />

      <RandomCardRedeemPanel
        className="mx-3 sm:mx-4"
        pointsBalance={hub.pointsBalance}
        cards={displayCards}
        drawCost={drawCost}
        comingSoonLabel={comingSoonLabel}
      />

      <p className="px-4 text-center text-[11px] text-[var(--text-secondary)]">{terms}</p>
    </div>
  );
}
