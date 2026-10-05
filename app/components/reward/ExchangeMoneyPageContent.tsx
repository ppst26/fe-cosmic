"use client";

import React, { useState } from "react";
import { formatRewardPoints } from "@/app/data/rewardFeaturesMockData";
import { fetchExchangeMoney, fetchRewardHub } from "@/lib/api/rewardFeatures";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardPointsBar } from "./RewardPointsBar";
import { CosmicStackedActionButton } from "../ui/CosmicStackedActionButton";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

/**
 * แลกพอยท์เป็นเงิน (เครดิต) — /reward/exchange-money
 */
export function ExchangeMoneyPageContent() {
  const hub = fetchRewardHub();
  const { packages, rateLabel, terms } = fetchExchangeMoney();
  const [points, setPoints] = useState(hub.pointsBalance);
  const [lastRedeem, setLastRedeem] = useState<string | null>(null);

  const redeem = (pkgId: string, cost: number, credits: number) => {
    if (points < cost) return;
    setPoints((p) => p - cost);
    setLastRedeem(`+${credits} เครดิต`);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <RewardPointsBar pointsBalance={points} />
      <RewardHubShortcutRow shortcuts={hub.shortcuts} />
      <p className="px-4 text-center text-xs text-[var(--text-secondary)]">{rateLabel}</p>
      <div className="mx-3 grid grid-cols-2 gap-2.5 sm:mx-4 sm:gap-3">
        {packages.map((pkg) => {
          const affordable = points >= pkg.pointsCost;
          return (
            <div
              key={pkg.id}
              className={cn("flex flex-col gap-2 rounded-2xl px-3 py-3", COSMIC_PANEL_GLASS)}
            >
              <p className="text-lg font-medium tabular-nums text-[var(--accent-highlight)]">
                {pkg.credits} ฿
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {formatRewardPoints(pkg.pointsCost)} พอยท์
              </p>
              <CosmicStackedActionButton
                type="button"
                className="w-full !min-h-9 !py-2 text-xs"
                disabled={!affordable}
                onClick={() => redeem(pkg.id, pkg.pointsCost, pkg.credits)}
                title={affordable ? "แลกเลย" : "ไม่พอ"}
              />
            </div>
          );
        })}
      </div>
      {lastRedeem ? (
        <p className="mx-4 text-center text-sm text-[var(--text-primary)]">
          แลกสำเร็จ <span className="font-medium text-[var(--accent-highlight)]">{lastRedeem}</span>
        </p>
      ) : null}
      <p className="px-4 text-center text-[11px] text-[var(--text-secondary)]">{terms}</p>
    </div>
  );
}
