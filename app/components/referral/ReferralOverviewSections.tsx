"use client";

import React from "react";
import {
  buildReferralLink,
  formatReferralCount,
  formatReferralCurrency,
  type ReferralStatsMock,
} from "@/app/data/referralMockData";
import { CopyIcon, UsersGroupIcon, WalletCryptoIcon } from "../ui/Icons";

/**
 * แบนเนอร์โปรโมชันแนะนำเพื่อน — ใช้ใน overview / desktop hub
 */
export function ReferralPromoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className="referral-promo-banner hub-desktop-card relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 px-4 py-5 sm:px-5 sm:py-6"
      aria-label="โปรโมชันแนะนำเพื่อน"
    >
      <div
        className="referral-promo-banner__glow pointer-events-none absolute inset-0 opacity-95"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 70% 40%, rgba(124,108,255,0.35) 0%, rgba(13,12,34,0.95) 55%, rgba(9,11,24,1) 100%)",
        }}
      />
      <div className="relative z-[1] flex gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className={`font-extrabold leading-snug text-[var(--text-primary)] ${
              compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
            }`}
          >
            ชวนเพื่อน รับรายได้ 2 ต่อ
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
            แชร์ลิงก์ให้เพื่อน แล้วรับส่วนแบ่งจากยอดเล่น
          </p>
          {!compact ? (
            <>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--border-active)]">
                Play together · Earn together
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffe66d]">
                More play · More rewards
              </p>
            </>
          ) : null}
        </div>
        <div
          className={`referral-promo-banner__art relative shrink-0 ${compact ? "w-16 sm:w-20" : "hidden w-24 sm:block sm:w-28"}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 120 120" className="relative h-full w-full">
            <path
              d="M35 85 45 35h30l10 50H35Z"
              fill="url(#refMegaphone)"
              stroke="#c4b5fd"
              strokeWidth="2"
            />
            <path d="M75 45 95 35v50L75 75Z" fill="#7c6cff" opacity="0.9" />
            <circle cx="92" cy="28" r="8" fill="#4ade80" opacity="0.9" />
            <defs>
              <linearGradient id="refMegaphone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#5b21b6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}

/**
 * ลิงก์แนะนำ + ปุ่มคัดลอก
 */
export function ReferralLinkSection({
  refCode,
  copied,
  onCopy,
}: {
  refCode: string;
  copied: boolean;
  onCopy: (link: string) => void;
}) {
  const referralLink = buildReferralLink(refCode);

  return (
    <section>
      <p className="mb-2 text-sm font-bold text-[var(--text-primary)]">ลิงก์แนะนำของคุณ</p>
      <div className="flex gap-2">
        <div className="hub-desktop-field min-w-0 flex-1 truncate px-3 py-2.5 text-xs text-[var(--text-secondary)] sm:text-sm">
          {referralLink}
        </div>
        <button
          type="button"
          onClick={() => onCopy(referralLink)}
          className="cosmic-action-btn flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm"
        >
          <CopyIcon className="h-4 w-4" />
          {copied ? "คัดลอกแล้ว" : "Copy"}
        </button>
      </div>
    </section>
  );
}

/**
 * สถิติสรุป 3 ช่อง
 */
export function ReferralStatsSection({
  stats,
  layout = "grid",
}: {
  stats: ReferralStatsMock;
  layout?: "grid" | "stack";
}) {
  const gridClass =
    layout === "stack"
      ? "grid grid-cols-1 gap-2"
      : "grid grid-cols-1 gap-2.5 sm:grid-cols-3";

  return (
    <section>
      <h2 className="mb-3 text-sm font-extrabold text-[var(--text-primary)]">สถิติของคุณ</h2>
      <div className={gridClass}>
        <StatCard
          icon={<UsersGroupIcon className="h-5 w-5 text-[var(--border-active)]" />}
          label="เพื่อนที่สมัคร"
          value={formatReferralCount(stats.friendsCount)}
        />
        <StatCard
          icon={<WalletCryptoIcon className="h-5 w-5 text-[var(--border-active)]" />}
          label="ยอดเล่นรวม"
          value={formatReferralCurrency(stats.totalTurnoverThb)}
          valueClassName="text-[var(--success)]"
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--border-active)]" aria-hidden="true">
              <path
                d="M4 18V6h16v12H4Zm2-2h12V8H6v8Zm2-6h2v4H8v-4Zm4 0h4v4h-4v-4Z"
                fill="currentColor"
              />
            </svg>
          }
          label="รายได้สะสม"
          value={formatReferralCurrency(stats.totalEarningsThb)}
          valueClassName="text-[#c4b5fd]"
        />
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueClassName = "text-[var(--text-primary)]",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="hub-desktop-card flex items-center gap-3 rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-hover)]/35 px-3 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
        <p className={`text-sm font-extrabold tabular-nums ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
