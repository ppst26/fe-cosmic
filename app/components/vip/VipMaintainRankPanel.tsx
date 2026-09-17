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
    <section className="w-full rounded-[10px] border border-[var(--border-active)]/45 bg-[var(--surface-hover)]/25 p-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)]">รักษาระดับ VIP</h3>
        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
          {maintain.daysRemaining} วันคงเหลือ
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted)]">
        ทำครบทั้งสองเงื่อนไขเพื่อรักษาระดับ {tier.label.charAt(0) + tier.label.slice(1).toLowerCase()}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MaintainMetricCard
          label="ฝาก"
          iconKind="deposit"
          progress={maintain.depositProgress}
          target={maintain.depositTarget}
        />
        <MaintainMetricCard
          label="เทิร์น"
          iconKind="turnover"
          progress={maintain.turnoverProgress}
          target={maintain.turnoverTarget}
        />
      </div>

      <p className="mt-2.5 text-center text-[10px] text-[var(--text-muted)]">ตัวเลขตัวอย่าง</p>
    </section>
  );
}

function MaintainMetricCard({
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
    <div className="cosmic-inset-card bg-[var(--surface-mid)]/80 p-2.5">
      <div className="mb-1.5 flex items-center gap-1.5">
        {iconKind === "deposit" ? (
          <WalletMiniIcon className="h-4 w-4 text-[var(--icon-default)]" />
        ) : (
          <TurnoverMiniIcon className="h-4 w-4 text-[var(--icon-default)]" />
        )}
        <span className="text-[11px] font-bold text-[var(--text-secondary)]">{label}</span>
      </div>
      <p className="text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
        {formatVipAmount(progress)} / {formatVipAmount(target)}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            complete ? "bg-[var(--success)]" : "bg-[#c4b5fd]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        className={`mt-1.5 text-[10px] font-medium ${
          complete ? "text-[var(--success)]" : "text-[var(--text-muted)]"
        }`}
      >
        {complete ? "✓ ครบแล้ว" : `ขาดอีก ${formatVipAmount(remaining)}`}
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
