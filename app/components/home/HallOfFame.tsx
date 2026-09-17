"use client";

import React, { useId, useState } from "react";
import Image from "next/image";
import type { HallOfFameRow, HallOfFameTabId } from "../../types/lobby";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionIcon } from "../ui/SectionIcon";

const TAB_LABELS: { id: HallOfFameTabId; label: string }[] = [
  { id: "latest-winner", label: "Latest Winner" },
  { id: "top-win-multiple", label: "Top Win Multiple" },
];

interface HallOfFameProps {
  datasets: Record<HallOfFameTabId, HallOfFameRow[]>;
}

const payoutFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * ไอคอนหัวข้อ Top Performance — โทนทองตามธีม ไม่ใช้กรอบการ์ด
 */
function TopPerformanceBadge({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[var(--surface-hover)] ring-1 ring-[var(--border-subtle)] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
        <path
          d="M16 4l2.2 6.8H25l-5.6 4.1 2.2 6.8L16 17.6l-5.6 4.1 2.2-6.8L7 10.8h6.8L16 4Z"
          fill="url(#top-perf-star)"
        />
        <text
          x="16"
          y="21"
          textAnchor="middle"
          fill="#090810"
          fontSize="7"
          fontWeight="800"
        >
          TOP
        </text>
        <defs>
          <linearGradient id="top-perf-star" x1="8" y1="4" x2="24" y2="22">
            <stop offset="0%" stopColor="#ffe66d" />
            <stop offset="100%" stopColor="#d99a08" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

/**
 * จัดรูปแบบยอดชนะ THB (+80,060.00฿)
 */
function formatPayoutThb(amount: number): string {
  return `+${payoutFormatter.format(amount)}฿`;
}

/**
 * รูปเกม — coverSrc หรือ placeholder tone + icon
 */
function HallOfFameGameThumb({ row }: { row: HallOfFameRow }) {
  const toneClass = row.coverTone ? `cover-tone-${row.coverTone}` : "cover-tone-indigo";

  if (row.coverSrc) {
    return (
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-[var(--surface-mid)]">
        <Image
          src={row.coverSrc}
          alt=""
          fill
          sizes="40px"
          className="object-cover object-center"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] ${toneClass} text-[var(--icon-default)]`}
    >
      <SectionIcon id={row.gameIcon} className="h-5 w-5" />
    </span>
  );
}

/**
 * HallOfFame (Top Performance) — 2 แท็บ + ตารางเต็มความกว้าง ไม่มีกรอบการ์ด
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function HallOfFame({ datasets }: HallOfFameProps) {
  const [activeTab, setActiveTab] = useState<HallOfFameTabId>("latest-winner");
  const panelId = useId();
  const rows = datasets[activeTab] ?? [];
  const isLatestWinner = activeTab === "latest-winner";
  const valueColumnLabel = isLatestWinner ? "Payout" : "Multiple";

  return (
    <section
      className="hall-of-fame mt-10 w-full min-w-0 sm:mt-12"
      aria-labelledby="top-performance-title"
    >
      <SectionHeader
        icon={<TopPerformanceBadge />}
        title="Top Performance"
      />

      <div
        className="inline-flex max-w-full gap-1 rounded-[var(--radius-control)] bg-[var(--surface-mid)] p-1 ring-1 ring-[var(--border-subtle)]"
        role="tablist"
        aria-label="เลือกตาราง Top Performance"
      >
        {TAB_LABELS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${panelId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${panelId}-panel`}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[36px] whitespace-nowrap rounded-[var(--radius-control)] px-3.5 text-[11px] font-bold transition-colors sm:min-h-[40px] sm:px-4 sm:text-xs ${
                selected
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-secondary)]"
              }`}
              style={selected ? { background: "var(--category-active-gradient)" } : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* แถบตารางเต็มความกว้าง — ทะลุ gutter ของ page-shell */}
      <div
        id={`${panelId}-panel`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${activeTab}`}
        className="hall-of-fame__table-band relative mt-4 -mx-[var(--page-gutter)] w-[calc(100%+2*var(--page-gutter))] max-w-none bg-[color-mix(in_srgb,var(--surface-mid)_88%,transparent)]"
      >
        <table className="hall-of-fame-table w-full min-w-0 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] sm:text-[11px]">
              <th scope="col" className="py-3 pl-[var(--page-gutter)] pr-2 font-bold">
                Game
              </th>
              <th scope="col" className="px-2 py-3 font-bold">
                Player
              </th>
              <th scope="col" className="py-3 pl-2 pr-[var(--page-gutter)] text-right font-bold">
                {valueColumnLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-[var(--page-gutter)] py-8 text-center text-sm text-[var(--text-muted)]"
                >
                  ยังไม่มีรายการ
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index % 2 === 0
                      ? "bg-[color-mix(in_srgb,var(--surface-hover)_42%,transparent)]"
                      : "bg-transparent"
                  }
                >
                  <td className="py-3 pl-[var(--page-gutter)] pr-2 align-middle">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <HallOfFameGameThumb row={row} />
                      <span className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--text-primary)] sm:text-sm">
                        {row.gameName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 align-middle">
                    <span className="block truncate text-xs tabular-nums text-[var(--text-secondary)] sm:text-sm">
                      {row.playerMasked}
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-[var(--page-gutter)] text-right align-middle">
                    {isLatestWinner && row.payout != null ? (
                      <span className="text-xs font-bold tabular-nums text-[#ffe66d] sm:text-sm">
                        {formatPayoutThb(row.payout)}
                      </span>
                    ) : null}
                    {!isLatestWinner && row.winMultiple != null ? (
                      <span className="text-xs font-extrabold tabular-nums text-[#ffe66d] sm:text-sm">
                        {row.winMultiple}x
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
