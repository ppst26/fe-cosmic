"use client";

import React from "react";
import type { VipRankId } from "@/app/types/vip";
import { formatVipAmount, getVipMaintainState, getVipRankTier } from "@/app/data/vipMockData";

interface VipMaintainRankPanelProps {
  /** ต้องเป็นแรงค์ปัจจุบันของผู้เล่นเท่านั้น */
  activeRankId: VipRankId;
}

/**
 * กล่องรักษาระดับ VIP — แสดงใน VipModal แท็บระดับของฉัน (แรงค์ปัจจุบัน)
 */
export function VipMaintainRankPanel({ activeRankId }: VipMaintainRankPanelProps) {
  const maintain = getVipMaintainState(activeRankId);
  if (!maintain) return null;

  const tier = getVipRankTier(activeRankId);

  return (
    <section className="vip-panel-card vip-maintain-rank-panel vip-maintain-rank-panel--flat vip-maintain-rank-panel--desktop-stretch">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">รักษาระดับ VIP</h3>
        <span className="vip-maintain-rank-panel__days shrink-0 text-xs font-medium tabular-nums">
          {maintain.daysRemaining} วันคงเหลือ
        </span>
      </div>
      <p className="mt-1 text-xs leading-snug text-[var(--text-secondary)]">
        ทำครบทั้งสองเงื่อนไขเพื่อรักษาระดับ {tier.label.charAt(0) + tier.label.slice(1).toLowerCase()}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <MaintainMetric
          label="ฝาก"
          iconKind="deposit"
          progress={maintain.depositProgress}
          target={maintain.depositTarget}
        />
        <MaintainMetric
          label="เทิร์น"
          iconKind="turnover"
          progress={maintain.turnoverProgress}
          target={maintain.turnoverTarget}
        />
      </div>

      <p className="mt-2.5 text-center text-xs text-[var(--text-secondary)]">ตัวเลขตัวอย่าง</p>
    </section>
  );
}

function MaintainMetric({
  label,
  iconKind,
  progress,
  target,
}: {
  label: string;
  iconKind: "deposit" | "turnover";
  progress: number;
  target: number;
}) {
  const pct = target > 0 ? Math.min(100, (progress / target) * 100) : 0;
  const complete = progress >= target;
  const remaining = Math.max(0, target - progress);

  return (
    <div className="vip-maintain-metric min-w-0">
      <div className="mb-2 flex items-center gap-1.5">
        {iconKind === "deposit" ? (
          <WalletMiniIcon className="h-4 w-4 shrink-0 text-[var(--icon-default)]" />
        ) : (
          <TurnoverMiniIcon className="h-4 w-4 shrink-0 text-[var(--icon-default)]" />
        )}
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      </div>
      <p className="text-xs font-medium tabular-nums text-[var(--text-primary)] sm:text-sm">
        {formatVipAmount(progress)} / {formatVipAmount(target)}
      </p>
      <div className="vip-progress-track mt-2">
        <div
          className={`vip-progress-fill vip-progress-fill--maintain ${complete ? "is-complete" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        className={`mt-2 text-xs leading-snug ${
          complete ? "text-[var(--success)]" : "text-[var(--text-secondary)]"
        }`}
      >
        {complete ? "ครบแล้ว" : `ขาดอีก ${formatVipAmount(remaining)}`}
      </p>
    </div>
  );
}

function WalletMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 8.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5H6a2 2 0 0 1-2-2v-1.5Z" strokeLinejoin="round" />
      <path d="M19 13.5h1.5a1.5 1.5 0 1 0 0-3H19" strokeLinecap="round" />
    </svg>
  );
}

function TurnoverMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 18V6M4 18h16M4 18l4-4M20 6v12M20 6H4M20 6l-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
