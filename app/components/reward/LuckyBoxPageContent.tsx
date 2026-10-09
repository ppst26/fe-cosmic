"use client";

import React from "react";
import { useLuckyBox, useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { LuckyBoxRedeemPanel } from "./LuckyBoxRedeemPanel";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * แลกกล่องสุ่ม — /reward/lucky-box (UI preview · Coming soon)
 */
export function LuckyBoxPageContent() {
  const t = useT("rewards");
  const hub = useRewardHub();
  const luckyBox = useLuckyBox();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel={t("hub.pointsLoading")} errorTitle={t("hub.pointsLoadError")}>
        {(hubData) => (
          <ResourceGate resource={luckyBox} loadingLabel={t("luckyBox.loading")} errorTitle={t("luckyBox.loadError")}>
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
