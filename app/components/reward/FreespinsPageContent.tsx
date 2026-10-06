"use client";

import React from "react";
import { REWARD_FREESPINS_COMING_SOON_LABEL } from "@/app/data/rewardFeaturesMockData";
import { useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardPointsBar } from "./RewardPointsBar";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

/**
 * แลกฟรีสปิน / ชิป — ปิดชั่วคราว (Coming soon)
 */
export function FreespinsPageContent() {
  const hub = useRewardHub();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel="กำลังโหลดพอยท์…" errorTitle="โหลดข้อมูลรางวัลไม่สำเร็จ">
        {(data) => (
          <>
            <RewardPointsBar pointsBalance={data.pointsBalance} />
            <RewardHubShortcutRow shortcuts={data.shortcuts} />
          </>
        )}
      </ResourceGate>

      <div
        className={cn(
          "mx-3 flex flex-col items-center gap-2 rounded-2xl px-4 py-10 text-center sm:mx-4",
          COSMIC_PANEL_GLASS,
        )}
        role="status"
      >
        <p className="text-sm font-medium text-[var(--text-primary)]">ฟรีสปิน / ชิป</p>
        <p className="text-xs uppercase tracking-wide text-[var(--accent-muted)]">
          {REWARD_FREESPINS_COMING_SOON_LABEL}
        </p>
        <p className="mt-1 max-w-[16rem] text-[11px] leading-relaxed text-[var(--text-secondary)]">
          ฟีเจอร์นี้กำลังพัฒนา — จะเปิดให้แลกด้วยพอยท์เร็วๆ นี้
        </p>
      </div>
    </div>
  );
}
