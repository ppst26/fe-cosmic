"use client";

import React from "react";
import type { VipModalTabId, VipPlayerState } from "@/app/types/vip";
import { fetchVipRanks } from "@/lib/api/vip";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { VipMyLevelPanel } from "./VipMyLevelPanel";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankLevelUpCard } from "./VipRankLevelUpCard";

interface VipMobileTabPanelsProps {
  tab: VipModalTabId;
  player: VipPlayerState;
  rankFocusIndex: number;
  onRankFocusChange: (index: number) => void;
}

/**
 * เนื้อหาแท็บ VIP บนมือถือ — แยกจาก modal เดิมให้หน้า /vip ใช้ซ้ำ
 */
export function VipMobileTabPanels({
  tab,
  player,
  rankFocusIndex,
  onRankFocusChange,
}: VipMobileTabPanelsProps) {
  if (tab === "my-level") {
    return <VipMyLevelPanel player={player} />;
  }

  if (tab === "rank") {
    return (
      <div className="flex flex-col items-center gap-4">
        <VipRankCarousel
          focusIndex={rankFocusIndex}
          onFocusChange={onRankFocusChange}
          playerRankId={player.currentRankId}
        />

        <VipRankLevelUpCard
          player={player}
          focusRankId={fetchVipRanks().tiers[rankFocusIndex]?.id ?? player.currentRankId}
        />
      </div>
    );
  }

  return <VipBenefitsComparisonTable currentRankId={player.currentRankId} />;
}
