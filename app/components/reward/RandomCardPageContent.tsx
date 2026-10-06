"use client";

import React from "react";
import { useRandomCard, useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RandomCardRedeemPanel } from "./RandomCardRedeemPanel";

/**
 * แลกการ์ดสุ่ม — /reward/random-card (UI preview · Coming soon)
 */
export function RandomCardPageContent() {
  const hub = useRewardHub();
  const randomCard = useRandomCard();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel="กำลังโหลดพอยท์…" errorTitle="โหลดข้อมูลรางวัลไม่สำเร็จ">
        {(hubData) => (
          <ResourceGate resource={randomCard} loadingLabel="กำลังโหลดการ์ดสุ่ม…" errorTitle="โหลดการ์ดสุ่มไม่สำเร็จ">
            {({ displayCards, drawCost, comingSoonLabel, terms }) => (
              <>
                <RewardHubShortcutRow shortcuts={hubData.shortcuts} />

                <RandomCardRedeemPanel
                  className="mx-3 sm:mx-4"
                  pointsBalance={hubData.pointsBalance}
                  cards={displayCards}
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
