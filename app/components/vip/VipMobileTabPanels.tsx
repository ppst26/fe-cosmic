"use client";

import React from "react";
import type { VipModalTabId, VipPlayerState } from "@/app/types/vip";
import {
  getVipRankTier,
  VIP_RANK_TIERS,
} from "@/app/data/vipMockData";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipRankRequirementsPanel } from "./VipRankRequirementsPanel";

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
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;

  if (tab === "my-level") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-medium text-[var(--text-secondary)]">ระดับปัจจุบัน</p>
        <VipRankEmblem rankId={player.currentRankId} size="lg" />
        <p
          className="text-2xl font-medium tracking-[0.2em]"
          style={{ color: currentTier.accent }}
        >
          {currentTier.label}
        </p>
        {nextTier && (
          <p className="text-sm text-[var(--text-secondary)]">
            ระดับถัดไป{" "}
            <span className="font-medium text-[var(--text-primary)]">{nextTier.label}</span>
          </p>
        )}

        <div className="w-full pt-2">
          <VipRankRequirementsPanel
            player={player}
            focusRankId={player.currentRankId}
            sectionTitle="ภารกิจเลื่อนระดับ"
            sectionSubtitle="ทำภารกิจให้ครบตามเป้าหมาย"
          />
        </div>

        <VipMaintainRankPanel activeRankId={player.currentRankId} />
      </div>
    );
  }

  if (tab === "rank") {
    return (
      <div className="flex flex-col items-center gap-4">
        <VipRankCarousel
          focusIndex={rankFocusIndex}
          onFocusChange={onRankFocusChange}
          playerRankId={player.currentRankId}
        />

        <div className="w-full border-t border-[var(--border-subtle)]/50 pt-4">
          <VipRankRequirementsPanel
            player={player}
            focusRankId={VIP_RANK_TIERS[rankFocusIndex]?.id ?? player.currentRankId}
          />
        </div>
      </div>
    );
  }

  return <VipBenefitsComparisonTable currentRankId={player.currentRankId} />;
}
