"use client";

import React from "react";
import Image from "next/image";
import { formatRewardPoints, REWARD_POINTS_LABEL } from "@/app/data/rewardFeaturesMockData";
import { fetchGemsStore } from "@/lib/api/gemsStore";
import { COSMIC_PANEL_GLASS } from "@/app/components/ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

/**
 * แถบยอดพอยท์คงเหลือ — ใช้ซ้ำในหน้าย่อย /reward/*
 */
export function RewardPointsBar({
  pointsBalance,
  className,
}: {
  pointsBalance: number;
  className?: string;
}) {
  const gems = fetchGemsStore();

  return (
    <div
      className={cn(
        "mx-3 flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 sm:mx-4",
        COSMIC_PANEL_GLASS,
        className,
      )}
      aria-label={`${REWARD_POINTS_LABEL}คงเหลือ`}
    >
      <p className="text-sm text-[var(--text-secondary)]">{REWARD_POINTS_LABEL}คงเหลือ</p>
      <p className="flex items-center gap-2 text-lg font-medium tabular-nums text-[var(--accent-highlight)]">
        <Image src={gems.gemAsset} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
        {formatRewardPoints(pointsBalance)}
      </p>
    </div>
  );
}
