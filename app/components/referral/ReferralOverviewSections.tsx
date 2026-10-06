"use client";

import React from "react";
import { CopyIcon, UsersGroupIcon, WalletCryptoIcon } from "../ui/Icons";
import {
  COSMIC_BTN_CONFIRM_INLINE,
  COSMIC_BTN_CONFIRM_TEXT,
  COSMIC_PANEL_GLASS_ICON,
  COSMIC_PANEL_SOLID,
  COSMIC_SHEET_FIELD_ROW,
} from "../ui/cosmicButtonClasses";
import { buildReferralLink } from "@/lib/domain/referral";
import { formatReferralCount, formatReferralCurrency } from "@/lib/format";
import type { ReferralStatsMock } from "@/app/types/referral";

/**
 * แบนเนอร์โปรโมชันแนะนำเพื่อน — ใช้ใน overview / desktop hub
 */
export function ReferralPromoBanner({
  compact = false,
  flat = false,
}: {
  compact?: boolean;
  /** desktop hub sheet — ไม่ใช้การ์ดทึบ */
  flat?: boolean;
}) {
  return (
    <section
      className={`referral-promo-banner relative overflow-hidden py-5 sm:py-6 ${
        flat
          ? "referral-promo-banner--flat px-0"
          : "glass-card--soft rounded-[var(--radius-panel)] px-4 sm:px-5"
      }`}
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
            className={`font-medium leading-snug text-[var(--text-primary)] ${
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
              <p className="mt-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--border-active)]">
                Play together · Earn together
              </p>
              <p className="text-[11.5px] font-medium uppercase tracking-wider text-[#ffe66d]">
                More play · More rewards
              </p>
            </>
          ) : null}
        </div>
        <div
          className={`referral-promo-banner__art relative shrink-0 ${compact ? "w-16 sm:w-20" : "hidden w-24 sm:block sm:w-28"}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 120 120"
            className="relative h-full w-full text-[var(--accent-highlight)]"
          >
            <path
              d="M35 85 45 35h30l10 50H35Z"
              fill="url(#refMegaphone)"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M75 45 95 35v50L75 75Z" fill="#7c6cff" opacity="0.9" />
            <circle cx="92" cy="28" r="8" fill="#4ade80" opacity="0.9" />
            <defs>
              <linearGradient id="refMegaphone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-muted)" />
                <stop offset="100%" stopColor="var(--accent-primary)" />
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
  variant = "default",
}: {
  refCode: string;
  copied: boolean;
  onCopy: (link: string) => void;
  /** desktop hub modal — ตัวอักษรใหญ่ขึ้น */
  variant?: "default" | "hub";
}) {
  const referralLink = buildReferralLink(refCode);
  const isHub = variant === "hub";

  return (
    <section>
      <p
        className={`mb-2.5 font-medium text-[var(--text-primary)] ${isHub ? "text-base" : "text-sm"}`}
      >
        ลิงก์แนะนำของคุณ
      </p>
      <div className="flex gap-2.5">
        <div
          className={`${COSMIC_SHEET_FIELD_ROW} min-w-0 flex-1 truncate text-[var(--text-secondary)] ${
            isHub ? "py-3 text-sm sm:text-base" : "text-xs sm:text-sm"
          }`}
        >
          {referralLink}
        </div>
        <button
          type="button"
          onClick={() => onCopy(referralLink)}
          className={`${COSMIC_BTN_CONFIRM_INLINE} shrink-0 items-center gap-1.5 px-3.5 py-2.5 ${
            isHub ? "text-sm" : "text-xs sm:text-sm"
          }`}
        >
          <CopyIcon className="h-4 w-4 shrink-0" aria-hidden />
          <span className={COSMIC_BTN_CONFIRM_TEXT}>
            {copied ? "คัดลอกแล้ว" : "Copy"}
          </span>
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
  flat = false,
  variant = "default",
}: {
  stats: ReferralStatsMock;
  layout?: "grid" | "stack";
  flat?: boolean;
  variant?: "default" | "hub";
}) {
  const gridClass =
    layout === "stack"
      ? "grid grid-cols-1 gap-2"
      : "grid grid-cols-1 gap-2.5 sm:grid-cols-3";

  return (
    <section>
      <h2
        className={`mb-3 font-medium text-[var(--text-primary)] ${
          variant === "hub" ? "text-base" : "text-sm"
        }`}
      >
        สถิติของคุณ
      </h2>
      <div className={gridClass}>
        <StatCard
          flat={flat}
          emphasized={variant === "hub"}
          icon={<UsersGroupIcon className="h-5 w-5 text-[var(--border-active)]" />}
          label="เพื่อนที่สมัคร"
          value={formatReferralCount(stats.friendsCount)}
        />
        <StatCard
          flat={flat}
          emphasized={variant === "hub"}
          icon={<WalletCryptoIcon className="h-5 w-5 text-[var(--border-active)]" />}
          label="ยอดเล่นรวม"
          value={formatReferralCurrency(stats.totalTurnoverThb)}
          valueClassName="text-[var(--success)]"
        />
        <StatCard
          flat={flat}
          emphasized={variant === "hub"}
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
          valueClassName="text-[var(--text-primary)]"
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
  flat = false,
  emphasized = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  flat?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${emphasized ? "py-3.5" : "py-3"} ${
        flat ? "referral-stat-row border-b border-[var(--border-subtle)]/45 px-0 last:border-b-0" : `${COSMIC_PANEL_SOLID} px-3`
      }`}
    >
      <div className={emphasized ? `${COSMIC_PANEL_GLASS_ICON} !h-11 !w-11` : COSMIC_PANEL_GLASS_ICON}>
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className={`text-[var(--text-secondary)] ${emphasized ? "text-sm" : "text-xs"}`}
        >
          {label}
        </p>
        <p
          className={`font-medium tabular-nums ${emphasized ? "text-lg" : "text-sm"} ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
