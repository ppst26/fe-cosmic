"use client";

import React, { useState } from "react";
import { fetchRewardHub } from "@/lib/api/rewardFeatures";
import { RewardHubSummaryCard } from "./RewardHubSummaryCard";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardPromoBannerCard } from "./RewardPromoBannerCard";

/**
 * หน้าหลักสุ่มของรางวัล — /reward
 */
export function RewardHubPageContent() {
  const hub = fetchRewardHub();
  const [points] = useState(hub.pointsBalance);

  return (
    <div className="reward-hub-page flex flex-col gap-4 pb-6">
      <RewardHubSummaryCard pointsBalance={points} />
      <RewardHubShortcutRow shortcuts={hub.shortcuts} />
      <section className="flex flex-col gap-4 px-3 sm:px-4" aria-label="โปรโมชันรางวัล">
        {hub.banners.map((banner) => (
          <RewardPromoBannerCard key={banner.id} banner={banner} termsText={hub.terms} />
        ))}
      </section>
      <p className="px-4 text-center text-[11px] text-[var(--text-secondary)]">{hub.terms}</p>
    </div>
  );
}
