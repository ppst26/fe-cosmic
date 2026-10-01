"use client";

import React from "react";
import type { VipPlayerState } from "@/app/types/vip";
import { getVipRankTier } from "@/app/data/vipMockData";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipMyLevelBenefitsCard } from "./VipMyLevelBenefitsCard";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipRankLevelUpCard } from "./VipRankLevelUpCard";

/**
 * แท็บระดับของฉัน — ฮีโร่ · สิทธิประโยชน์ · เลื่อนระดับ · รักษาระดับ
 */
export function VipMyLevelPanel({ player }: { player: VipPlayerState }) {
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;

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
      {nextTier ? (
        <p className="text-sm text-[var(--text-secondary)]">
          ระดับถัดไป{" "}
          <span className="font-medium text-[var(--text-primary)]">{nextTier.label}</span>
        </p>
      ) : null}

      <div className="w-full pt-2">
        <VipMyLevelBenefitsCard player={player} />
      </div>

      <VipRankLevelUpCard
        player={player}
        focusRankId={player.currentRankId}
        mode="current"
      />

      <VipMaintainRankPanel activeRankId={player.currentRankId} />
    </div>
  );
}
