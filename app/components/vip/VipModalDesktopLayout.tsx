"use client";

import React from "react";
import type { VipModalTabId, VipPlayerState, VipRankId } from "@/app/types/vip";
import { getVipRankTier, VIP_RANK_TIERS } from "@/app/data/vipMockData";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipRankRequirementsPanel } from "./VipRankRequirementsPanel";

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
  const focusRankId = VIP_RANK_TIERS[rankFocusIndex]?.id ?? player.currentRankId;

  if (tab === "benefits") {
    return (
      <div className="vip-modal-desktop">
        <VipBenefitsComparisonTable currentRankId={player.currentRankId} variant="desktop-full" />
      </div>
    );
  }

  if (tab === "rank") {
    return (
      <div className="vip-modal-desktop">
        <div className="vip-modal-desktop__split">
          <section className="vip-modal-desktop__panel hub-desktop-card glass-card--soft flex flex-col items-center justify-center gap-3 p-5">
            <VipRankCarousel
              focusIndex={rankFocusIndex}
              onFocusChange={onRankFocusChange}
              playerRankId={player.currentRankId}
            />
          </section>
          <section className="vip-modal-desktop__panel hub-desktop-card glass-card--soft p-5">
            <VipRankRequirementsPanel player={player} focusRankId={focusRankId} />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="vip-modal-desktop">
      <div className="vip-modal-desktop__split">
        <section
          className="vip-modal-desktop__panel vip-modal-desktop__level hub-desktop-card glass-card--soft flex flex-col items-center p-5 text-center"
          aria-label="ระดับ VIP ปัจจุบัน"
        >
          <p className="text-xs font-semibold text-[var(--text-muted)]">ระดับ</p>
          <div className="my-2">
            <VipRankEmblem rankId={player.currentRankId} size="lg" />
          </div>
          <p
            className="text-2xl font-extrabold tracking-[0.18em]"
            style={{ color: currentTier.accent }}
          >
            {currentTier.label}
          </p>
          {nextTier ? (
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              ระดับถัดไป{" "}
              <span className="font-bold text-[var(--text-primary)]">{nextTier.label}</span>
            </p>
          ) : null}

          <div className="mt-5 w-full text-left">
            <VipRankRequirementsPanel
              player={player}
              focusRankId={player.currentRankId}
              sections="turnover"
            />
          </div>
        </section>

        <section
          className="vip-modal-desktop__panel vip-modal-desktop__missions hub-desktop-card glass-card--soft flex flex-col gap-4 p-5"
          aria-label="ความคืบหน้าภารกิจ"
        >
          <VipRankRequirementsPanel
            player={player}
            focusRankId={player.currentRankId}
            sections="missions"
            sectionTitle="ภารกิจเพื่อเลื่อนระดับ"
            sectionSubtitle="ทำภารกิจให้ครบตามเป้าหมาย"
          />
          <VipMaintainRankPanel activeRankId={player.currentRankId} />
        </section>
      </div>
    </div>
  );
}
