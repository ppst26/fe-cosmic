"use client";

import React from "react";
import type { VipPlayerState } from "@/app/types/vip";
import { getVipRankTier } from "@/app/data/vipMockData";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipMyLevelBenefitsCard } from "./VipMyLevelBenefitsCard";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipRankLevelUpCard } from "./VipRankLevelUpCard";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * แท็บระดับของฉัน — ฮีโร่ · สิทธิประโยชน์ · เลื่อนระดับ · รักษาระดับ
 */
export function VipMyLevelPanel({ player }: { player: VipPlayerState }) {
  const t = useT("vip");
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{t("tabs.myLevel")}</p>
        <div className="my-2">
          <VipRankEmblem rankId={player.currentRankId} size="lg" />
        </div>
        <p
          className="text-2xl font-medium tracking-[0.2em]"
          style={{ color: currentTier.accent }}
        >
          {currentTier.label}
        </p>
        {nextTier ? (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {t("level.next")}{" "}
            <span className="font-medium text-[var(--text-primary)]">{nextTier.label}</span>
          </p>
        ) : null}
      </div>

      <div className="vip-rank-stack w-full">
        <VipMyLevelBenefitsCard player={player} rankSurface />

        <VipRankLevelUpCard
          player={player}
          focusRankId={player.currentRankId}
          mode="current"
          rankSurface
        />

        <VipMaintainRankPanel activeRankId={player.currentRankId} rankSurface />
      </div>
    </div>
  );
}
