"use client";

import React from "react";
import { fetchLuckyBox, fetchRewardHub } from "@/lib/api/rewardFeatures";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { LuckyBoxRedeemPanel } from "./LuckyBoxRedeemPanel";

/**
 * แลกกล่องสุ่ม — /reward/lucky-box (UI preview · Coming soon)
 */
export function LuckyBoxPageContent() {
  const hub = fetchRewardHub();
  const { heroImageSrc, drawCost, comingSoonLabel, terms } = fetchLuckyBox();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <RewardHubShortcutRow shortcuts={hub.shortcuts} />

      <LuckyBoxRedeemPanel
        className="mx-3 sm:mx-4"
        pointsBalance={hub.pointsBalance}
        heroImageSrc={heroImageSrc}
        drawCost={drawCost}
        comingSoonLabel={comingSoonLabel}
      />

      <p className="px-4 text-center text-[11px] text-[var(--text-secondary)]">{terms}</p>
    </div>
  );
}
