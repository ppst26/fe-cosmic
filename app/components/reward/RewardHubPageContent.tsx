"use client";

import React from "react";
import { useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { RewardHubSummaryCard } from "./RewardHubSummaryCard";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardPromoBannerCard } from "./RewardPromoBannerCard";

/**
 * หน้าหลักสุ่มของรางวัล — /reward
 */
export function RewardHubPageContent() {
  const hub = useRewardHub();

  return (
    <div className="reward-hub-page flex flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel="กำลังโหลดศูนย์รางวัล…" errorTitle="โหลดศูนย์รางวัลไม่สำเร็จ">
        {(data) => (
          <>
            <RewardHubSummaryCard pointsBalance={data.pointsBalance} />
            <RewardHubShortcutRow shortcuts={data.shortcuts} />
            <section className="flex flex-col gap-4 px-3 sm:px-4" aria-label="โปรโมชันรางวัล">
              {data.banners.map((banner) => (
                <RewardPromoBannerCard key={banner.id} banner={banner} termsText={data.terms} />
              ))}
            </section>
            <p className="px-4 text-center text-[11px] text-[var(--text-secondary)]">{data.terms}</p>
          </>
        )}
      </ResourceGate>
    </div>
  );
}
