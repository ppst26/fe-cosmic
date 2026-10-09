"use client";

import React from "react";
import { useRandomCard, useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RandomCardRedeemPanel } from "./RandomCardRedeemPanel";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * แลกการ์ดสุ่ม — /reward/random-card (UI preview · Coming soon)
 */
export function RandomCardPageContent() {
  const t = useT("rewards");
  const hub = useRewardHub();
  const randomCard = useRandomCard();

  return (
    <div className="flex flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel={t("hub.pointsLoading")} errorTitle={t("hub.pointsLoadError")}>
        {(hubData) => (
          <ResourceGate resource={randomCard} loadingLabel={t("randomCard.loading")} errorTitle={t("randomCard.loadError")}>
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
