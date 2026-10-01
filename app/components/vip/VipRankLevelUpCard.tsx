"use client";

import React from "react";
import type { VipPlayerState, VipRankId } from "@/app/types/vip";
import { cn } from "@/lib/utils";
import {
  formatVipCompactAmount,
  getVipLevelUpOverallPercent,
  getVipRankLevelUpAmounts,
  getVipRankTier,
  getVipRankViewStatus,
  getVipRequirementRankForFocus,
} from "@/app/data/vipMockData";

interface VipRankLevelUpCardProps {
  player: VipPlayerState;
  focusRankId: VipRankId;
  /** current = แท็บระดับของฉัน (ไป nextRank เท่านั้น) · carousel = แท็บแร็งค์ */
  mode?: "current" | "carousel";
  /** desktop-fill = ขยายสูงเต็มคอลัมน์ใน VIP modal */
  layout?: "default" | "desktop-fill";
}

/**
 * การ์ดความคืบหน้าเลื่อนแรงค์ — ฝาก + เทิร์น (AND ทั้งสองเงื่อนไข)
 */
export function VipRankLevelUpCard({
  player,
  focusRankId,
  mode = "carousel",
  layout = "default",
}: VipRankLevelUpCardProps) {
  const status = getVipRankViewStatus(focusRankId, player.currentRankId);

  if (mode === "current") {
    if (!player.nextRankId) return null;
  } else if (status === "active" && !player.nextRankId && focusRankId === player.currentRankId) {
    return null;
  }

  const requirementRankId =
    mode === "current" && player.nextRankId
      ? player.nextRankId
      : getVipRequirementRankForFocus(focusRankId, player);
  const targetTier = getVipRankTier(requirementRankId);
  const { depositTarget, turnoverTarget } = getVipRankLevelUpAmounts(requirementRankId);

  const locked = mode === "carousel" && status === "locked";
  const cleared = mode === "carousel" && status === "cleared";

  const depositProgress = locked ? 0 : cleared ? depositTarget : player.depositProgress;
  const turnoverProgress = locked ? 0 : cleared ? turnoverTarget : player.turnoverProgress;

  const depositPct =
    depositTarget > 0 ? Math.min(100, (depositProgress / depositTarget) * 100) : 0;
  const turnoverPct =
    turnoverTarget > 0 ? Math.min(100, (turnoverProgress / turnoverTarget) * 100) : 0;
  const overallPct = getVipLevelUpOverallPercent(
    depositProgress,
    turnoverProgress,
    depositTarget,
    turnoverTarget,
  );

  const depositComplete = depositProgress >= depositTarget;
  const turnoverComplete = turnoverProgress >= turnoverTarget;

  return (
    <section
      className={cn(
        "vip-panel-card vip-panel-card--level-up vip-level-up-card",
        layout === "desktop-fill" && "vip-panel-card--desktop-fill",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-left">
          <h3 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
            {cleared ? targetTier.label : `เลื่อนขึ้นสู่ ${targetTier.label}`}
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
            ต้องครบทั้งสองเงื่อนไข
          </p>
        </div>
        <span
          className="vip-level-up-card__percent shrink-0 text-2xl font-semibold tabular-nums sm:text-[1.75rem]"
          aria-label={`ความคืบหน้ารวม ${Math.round(overallPct)} เปอร์เซ็นต์`}
        >
          {Math.round(overallPct)}%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <LevelUpMetric
          label="ฝาก"
          iconKind="deposit"
          progress={depositProgress}
          target={depositTarget}
          percent={depositPct}
          complete={depositComplete}
          locked={locked}
        />
        <LevelUpMetric
          label="เทิร์น"
          iconKind="turnover"
          progress={turnoverProgress}
          target={turnoverTarget}
          percent={turnoverPct}
          complete={turnoverComplete}
          locked={locked}
        />
      </div>
    </section>
  );
}

function LevelUpMetric({
  label,
  iconKind,
  progress,
  target,
  percent,
  complete,
  locked,
}: {
  label: string;
  iconKind: "deposit" | "turnover";
  progress: number;
  target: number;
  percent: number;
  complete: boolean;
  locked: boolean;
}) {
  const remaining = Math.max(0, target - progress);

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-1.5">
        {iconKind === "deposit" ? (
          <WalletMiniIcon className="vip-level-up-card__icon h-4 w-4 shrink-0" />
        ) : (
          <TurnoverMiniIcon className="vip-level-up-card__icon h-4 w-4 shrink-0" />
        )}
        <span className="vip-level-up-card__label text-sm font-medium">{label}</span>
      </div>
      <p className="text-xs font-medium tabular-nums text-[var(--text-primary)] sm:text-sm">
        {formatVipCompactAmount(progress)} / {formatVipCompactAmount(target)}
      </p>
      <div className={`vip-progress-track mt-2 ${locked ? "vip-progress-track--locked" : ""}`}>
        <div
          className={`vip-progress-fill vip-progress-fill--level-up ${complete ? "is-complete" : ""}`}
          style={{ width: locked ? "0%" : `${percent}%` }}
        />
      </div>
      <p
        className={`mt-2 text-xs leading-snug ${
          complete ? "text-[var(--success)]" : "text-[var(--text-secondary)]"
        }`}
      >
        {locked
          ? `เป้า ${formatVipCompactAmount(target)}`
          : complete
            ? "ครบแล้ว"
            : `ขาดอีก ${formatVipCompactAmount(remaining)}`}
      </p>
    </div>
  );
}

function WalletMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 8.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5H6a2 2 0 0 1-2-2v-1.5Z" strokeLinejoin="round" />
      <path d="M19 13.5h1.5a1.5 1.5 0 1 0 0-3H19" strokeLinecap="round" />
    </svg>
  );
}

function TurnoverMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 18V6M4 18h16M4 18l4-4M20 6v12M20 6H4M20 6l-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
