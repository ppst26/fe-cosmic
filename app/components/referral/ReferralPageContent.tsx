"use client";

import React, { useState } from "react";
import {
  REFERRAL_COMMISSION_TIERS,
  REFERRAL_FEATURE_CHECKS,
  REFERRAL_MOCK_REF_CODE,
  REFERRAL_STATS_MOCK,
  REFERRAL_STEPS,
  buildReferralLink,
  formatReferralCount,
  formatReferralCurrency,
} from "@/app/data/referralMockData";
import { CopyIcon, UsersGroupIcon, WalletCryptoIcon } from "../ui/Icons";
import { ReferralUsersPanel } from "./ReferralUsersPanel";
import { ReferralEarningPanel } from "./ReferralEarningPanel";

type ReferralTabId = "overview" | "users" | "earning";

const TABS: { id: ReferralTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Referral users" },
  { id: "earning", label: "Earning" },
];

function TabIcon({ tab }: { tab: ReferralTabId }) {
  const className = "h-4 w-4 shrink-0";
  if (tab === "users") {
    return <UsersGroupIcon className={className} />;
  }
  if (tab === "earning") {
    return <WalletCryptoIcon className={`${className} h-4 w-4`} />;
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a8 8 0 0 1 6.32 12.9L12 12V4Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path d="M12 4v8l6.32 4.9A8 8 0 0 1 12 4Z" fill="currentColor" />
    </svg>
  );
}

/**
 * เนื้อหาหน้าแนะนำเพื่อน — ใช้ใน /referral
 */
export function ReferralPageContent({ refCode = REFERRAL_MOCK_REF_CODE }: { refCode?: string }) {
  const [tab, setTab] = useState<ReferralTabId>("overview");
  const [copied, setCopied] = useState(false);
  const referralLink = buildReferralLink(refCode);
  const stats = REFERRAL_STATS_MOCK;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)] sm:text-2xl">
          แนะนำเพื่อน
        </h1>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Referral Program</p>
      </div>

      <div
        role="tablist"
        aria-label="เมนูแนะนำเพื่อน"
        className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`cosmic-segment-btn flex shrink-0 items-center gap-2 px-3.5 py-2 text-xs sm:px-4 sm:text-sm ${
                active
                  ? "is-active"
                  : "bg-[var(--surface-hover)]/40 text-[var(--text-secondary)] hover:bg-[var(--surface-selected)]/25 hover:text-[var(--text-primary)]"
              }`}
            >
              <TabIcon tab={item.id} />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-5">
          <section
            className="relative overflow-hidden cosmic-inset-card px-4 py-5 sm:px-5 sm:py-6"
            aria-label="โปรโมชันแนะนำเพื่อน"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-95"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 70% 40%, rgba(124,108,255,0.35) 0%, rgba(13,12,34,0.95) 55%, rgba(9,11,24,1) 100%)",
              }}
            />
            <div className="relative z-[1] flex gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold leading-snug text-[var(--text-primary)] sm:text-xl">
                  ชวนเพื่อน รับรายได้ 2 ต่อ
                </h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                  แชร์ลิงก์ให้เพื่อน แล้วรับส่วนแบ่งจากยอดเล่น
                </p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--border-active)]">
                  Play together · Earn together
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffe66d]">
                  More play · More rewards
                </p>
              </div>
              <div className="relative hidden w-24 shrink-0 sm:block sm:w-28" aria-hidden="true">
                <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl" />
                <svg viewBox="0 0 120 120" className="relative h-full w-full drop-shadow-[0_8px_24px_rgba(124,108,255,0.45)]">
                  <path
                    d="M35 85 45 35h30l10 50H35Z"
                    fill="url(#refMegaphone)"
                    stroke="#c4b5fd"
                    strokeWidth="2"
                  />
                  <path d="M75 45 95 35v50L75 75Z" fill="#7c6cff" opacity="0.9" />
                  <circle cx="92" cy="28" r="8" fill="#4ade80" opacity="0.9" />
                  <circle cx="100" cy="52" r="6" fill="#facc15" opacity="0.85" />
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

          <section>
            <p className="mb-2 text-sm font-bold text-[var(--text-primary)]">ลิงก์แนะนำของคุณ</p>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 truncate rounded-[var(--radius-control)] bg-[var(--surface-hover)]/50 px-3 py-2.5 text-xs text-[var(--text-secondary)] sm:text-sm">
                {referralLink}
              </div>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="cosmic-action-btn flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm"
              >
                <CopyIcon className="h-4 w-4" />
                {copied ? "คัดลอกแล้ว" : "Copy"}
              </button>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-extrabold text-[var(--text-primary)]">สถิติของคุณ</h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
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

          <section className="cosmic-inset-card bg-[var(--surface-hover)]/30 px-4 py-4">
            <h2 className="text-sm font-extrabold text-[var(--text-primary)]">รับรายได้ 2 ต่อ</h2>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
              แชร์ลิงก์แล้วรับส่วนแบ่งจากยอดเทิร์นของเครือข่าย
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {REFERRAL_COMMISSION_TIERS.map((tier) => (
                <div key={tier.id} className="cosmic-inset-card flex gap-3 bg-[var(--surface-hover)]/20 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)]">
                    <UsersGroupIcon className="h-5 w-5 text-[var(--icon-default)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{tier.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{tier.subtitle}</p>
                    <p className="mt-1 text-2xl font-extrabold text-[#c4b5fd]">{tier.rateLabel}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{tier.rateHint}</p>
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {REFERRAL_FEATURE_CHECKS.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]"
                >
                  <span className="text-[var(--success)]" aria-hidden="true">
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-extrabold text-[var(--text-primary)]">
              เริ่มต้นง่าย ๆ ใน 3 ขั้นตอน
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {REFERRAL_STEPS.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-hover)]/50 text-xs font-extrabold text-[#c4b5fd]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-[var(--text-primary)]">{step.label}</p>
                  {index < REFERRAL_STEPS.length - 1 && (
                    <span className="mt-1 hidden text-[var(--text-muted)] sm:inline" aria-hidden="true">
                      ›
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "users" && <ReferralUsersPanel />}

      {tab === "earning" && <ReferralEarningPanel />}
    </div>
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
    <div className="flex items-center gap-3 cosmic-inset-card bg-[var(--surface-hover)]/35 px-3 py-3">
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
