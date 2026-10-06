"use client";

import React from "react";
import { useLuckyBox, useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { LuckyBoxRedeemPanel } from "./LuckyBoxRedeemPanel";

/**
 * แลกกล่องสุ่ม — /reward/lucky-box (UI preview · Coming soon)
 */
export function LuckyBoxPageContent() {
  const hub = useRewardHub();
  const luckyBox = useLuckyBox();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel="กำลังโหลดพอยท์…" errorTitle="โหลดข้อมูลรางวัลไม่สำเร็จ">
        {(hubData) => (
          <ResourceGate resource={luckyBox} loadingLabel="กำลังโหลด Lucky Box…" errorTitle="โหลด Lucky Box ไม่สำเร็จ">
            {({ heroImageSrc, drawCost, comingSoonLabel, terms }) => (
              <>
                <RewardHubShortcutRow shortcuts={hubData.shortcuts} />

                <LuckyBoxRedeemPanel
                  className="mx-3 sm:mx-4"
                  pointsBalance={hubData.pointsBalance}
                  heroImageSrc={heroImageSrc}
                  drawCost={drawCost}
                  comingSoonLabel={comingSoonLabel}
                />

                <p className="px-4 text-center text-[11px] text-[var(--text-secondary)]">{terms}</p>
              </>
            )}
          </ResourceGate>
        )}
      </ResourceGate>
    </div>
  );
}
