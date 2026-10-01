"use client";

import React from "react";
import type { VipModalTabId, VipPlayerState, VipRankId } from "@/app/types/vip";
import { fetchVipRanks } from "@/lib/api/vip";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { getVipRankTier } from "@/app/data/vipMockData";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipMyLevelBenefitsCard } from "./VipMyLevelBenefitsCard";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipRankLevelUpCard } from "./VipRankLevelUpCard";

interface VipModalDesktopLayoutProps {
  tab: VipModalTabId;
  player: VipPlayerState;
  rankFocusIndex: number;
  onRankFocusChange: (index: number) => void;
}

/**
 * เลย์เอาต์ VIP modal บน desktop — ซ้ายระดับ/เทิร์น · ขวาภารกิจ + รักษาระดับ
 */
export function VipModalDesktopLayout({
  tab,
  player,
  rankFocusIndex,
  onRankFocusChange,
}: VipModalDesktopLayoutProps) {
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;
  const vipRankTiers = fetchVipRanks().tiers;
  const focusRankId = vipRankTiers[rankFocusIndex]?.id ?? player.currentRankId;

  if (tab === "benefits") {
    return (
      <div className="vip-modal-desktop vip-modal-desktop--benefits w-full min-w-0 flex-1">
        <VipBenefitsComparisonTable currentRankId={player.currentRankId} variant="desktop-full" />
      </div>
    );
  }

  if (tab === "rank") {
    return (
      <div className="vip-modal-desktop vip-modal-desktop--flat w-full min-w-0 min-h-0 flex-1">
        <div className="vip-modal-desktop__split grid min-h-0 grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:gap-0">
          <section className="vip-modal-desktop__panel vip-modal-desktop__rank-carousel min-w-0 flex flex-col items-center justify-center gap-3 overflow-visible py-4 lg:min-h-0 lg:py-0 lg:pr-5">
            <VipRankCarousel
              focusIndex={rankFocusIndex}
              onFocusChange={onRankFocusChange}
              playerRankId={player.currentRankId}
            />
          </section>
          <section className="vip-modal-desktop__panel vip-modal-desktop__panel--fill min-w-0 flex min-h-0 flex-col py-4 lg:py-0 lg:pl-5">
            <VipRankLevelUpCard
              player={player}
              focusRankId={focusRankId}
              layout="desktop-fill"
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="vip-modal-desktop vip-modal-desktop--flat w-full min-w-0 min-h-0 flex-1">
      <div className="vip-modal-desktop__split grid min-h-0 grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:gap-0">
        <section
          className="vip-modal-desktop__panel vip-modal-desktop__level min-w-0 flex flex-col items-stretch justify-start py-4 text-center lg:min-h-0 lg:flex-1 lg:py-0 lg:pr-5"
          aria-label="ระดับ VIP ปัจจุบัน"
        >
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">ระดับ</p>
            <div className="my-3 sm:my-4">
              <VipRankEmblem rankId={player.currentRankId} size="xl" />
            </div>
            <p
              className="text-2xl font-medium tracking-[0.18em] sm:text-3xl"
              style={{ color: currentTier.accent }}
            >
              {currentTier.label}
            </p>
            {nextTier ? (
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                ระดับถัดไป{" "}
                <span className="font-medium text-[var(--text-primary)]">{nextTier.label}</span>
              </p>
            ) : null}
          </div>

          <div className="vip-modal-desktop__level-progress mt-auto w-full pt-6 text-left lg:pt-8">
            <VipRankLevelUpCard
              player={player}
              focusRankId={player.currentRankId}
              mode="current"
              layout="desktop-fill"
            />
          </div>
        </section>

        <section
          className="vip-modal-desktop__panel vip-modal-desktop__missions min-w-0 flex min-h-0 flex-col gap-3 py-4 lg:min-h-0 lg:flex-1 lg:py-0 lg:pl-5"
          aria-label="สิทธิประโยชน์และรักษาระดับ"
        >
          <VipMyLevelBenefitsCard player={player} />
          <VipMaintainRankPanel activeRankId={player.currentRankId} />
        </section>
      </div>
    </div>
  );
}
