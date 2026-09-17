"use client";

import React, { useMemo, useState } from "react";
import {
  CASHBACK_LOSS_PANEL_MOCK,
  CASHBACK_PLAY_PANEL_MOCK,
  CASHBACK_TABS,
  formatCashbackCurrency,
  formatCashbackPercent,
  type CashbackPanelMock,
  type CashbackTabId,
} from "@/app/data/cashbackMockData";
import { RefundIcon } from "../ui/Icons";

interface CashbackPageContentProps {
  initialTab?: CashbackTabId;
}

/**
 * เนื้อหาหน้าคืนยอด — แท็บเล่น / เสีย ตาม mock UI
 * ใช้ใน app/cashback/page.tsx
 */
export function CashbackPageContent({ initialTab = "play" }: CashbackPageContentProps) {
  const [tab, setTab] = useState<CashbackTabId>(initialTab);
  const [playPanel, setPlayPanel] = useState(CASHBACK_PLAY_PANEL_MOCK);
  const [lossPanel, setLossPanel] = useState(CASHBACK_LOSS_PANEL_MOCK);

  const panel = tab === "play" ? playPanel : lossPanel;

  const detailRows = useMemo(
    () => [
      { icon: "percent" as const, label: "อัตราคืน", value: formatCashbackPercent(panel.ratePercent) },
      { icon: "wallet" as const, label: "ขั้นต่ำ", value: formatCashbackCurrency(panel.minThb) },
      {
        icon: "wallet" as const,
        label: "สูงสุดต่อครั้ง",
        value: formatCashbackCurrency(panel.maxPerClaimThb),
      },
      { icon: "cycle" as const, label: "รอบคำนวณ", value: panel.cycleLabel },
    ],
    [panel],
  );

  const handleClaim = () => {
    if (!panel.canClaim || panel.claimableThb <= 0) return;
    const reset = (prev: CashbackPanelMock) => ({
      ...prev,
      claimableThb: 0,
      canClaim: false,
      statusHint: "รับแล้ว",
      claimButtonLabel: "รับแล้ว",
    });
    if (tab === "play") setPlayPanel(reset);
    else setLossPanel(reset);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <header>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)] sm:text-2xl">คืนยอด</h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
          ตรวจสอบยอดคืนและกดรับเข้ากระเป๋า
        </p>
      </header>

      <div
        role="tablist"
        aria-label="ประเภทคืนยอด"
        className="grid grid-cols-2 gap-2 rounded-[var(--radius-panel)] border border-[var(--border-active)]/35 bg-[var(--surface-mid)]/60 p-1.5"
      >
        {CASHBACK_TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`rounded-[calc(var(--radius-panel)-6px)] py-2.5 text-sm font-bold transition-all ${
                active
                  ? "bg-[#c4b5fd] text-[#121127] shadow-[0_2px_12px_rgba(196,181,253,0.35)]"
                  : "border border-transparent text-[#c4b5fd] hover:bg-[var(--surface-hover)]/40"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <section className="flex flex-col items-center px-2 pt-2 text-center" aria-live="polite">
        <div className="relative flex h-[88px] w-[88px] items-center justify-center">
          <span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c4b5fd]/45"
            aria-hidden="true"
          />
          <RefundIcon className="h-11 w-11 text-[#c4b5fd]" />
          <span className="absolute text-xl font-extrabold text-[#c4b5fd]" aria-hidden="true">
            ฿
          </span>
        </div>
        <p className="mt-3 text-xs font-semibold text-[var(--text-secondary)]">ยอดคืนที่รับได้</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#c4b5fd] sm:text-4xl">
          {formatCashbackCurrency(panel.claimableThb)}
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{panel.statusHint}</p>
      </section>

      <section
        className="cosmic-inset-card border border-[var(--border-active)]/40 bg-[var(--surface-hover)]/20 px-4 py-4 sm:px-5"
        aria-labelledby="cashback-detail-heading"
      >
        <h2 id="cashback-detail-heading" className="text-base font-extrabold text-[var(--text-primary)]">
          {panel.title}
        </h2>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{panel.subtitle}</p>

        <ul className="mt-4 flex flex-col gap-3">
          {detailRows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)]/35 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <DetailRowIcon kind={row.icon} />
                <span className="text-sm text-[var(--text-secondary)]">{row.label}</span>
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--text-primary)]">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        disabled={!panel.canClaim || panel.claimableThb <= 0}
        onClick={handleClaim}
        className={`flex h-12 w-full items-center justify-center text-sm sm:text-base ${
          panel.canClaim && panel.claimableThb > 0
            ? "cosmic-action-btn"
            : "rounded-[var(--radius-panel)] bg-[color-mix(in_srgb,#c4b5fd_28%,var(--surface-mid))] font-extrabold text-[color-mix(in_srgb,#c4b5fd_75%,var(--text-muted))] disabled:cursor-not-allowed"
        } disabled:opacity-45`}
      >
        {panel.claimButtonLabel}
      </button>
    </div>
  );
}

function DetailRowIcon({ kind }: { kind: "percent" | "wallet" | "cycle" }) {
  const className = "h-5 w-5 shrink-0 text-[#c4b5fd]";
  if (kind === "percent") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
        <path d="M19 5 5 19" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "wallet") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5V7.5Z" />
        <path d="M17 12h4v4h-4a2 2 0 0 1 0-4Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
