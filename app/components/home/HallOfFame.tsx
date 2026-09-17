"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import type { HallOfFameRow, HallOfFameTabId } from "../../types/lobby";
import { SectionIcon } from "../ui/SectionIcon";
import { ChevronDownIcon } from "../ui/Icons";

const TAB_LABELS: { id: HallOfFameTabId; label: string }[] = [
  { id: "latest-winner", label: "Latest Winner" },
  { id: "top-win-multiple", label: "Top Win Multiple" },
];

const ROW_LIMIT_OPTIONS = [10, 30, 50] as const;
type HallOfFameRowLimit = (typeof ROW_LIMIT_OPTIONS)[number];

interface HallOfFameProps {
  datasets: Record<HallOfFameTabId, HallOfFameRow[]>;
}

const payoutFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * ไอคอนหัวข้อ Top Performance — โทนทองตามธีม
 */
function TopPerformanceBadge({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
      fill="none"
      aria-hidden="true"
    >
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
  );
}

/** จัดรูปแบบยอดชนะ THB (+80,060.00฿) */
function formatPayoutThb(amount: number): string {
  return `+${payoutFormatter.format(amount)}฿`;
}

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
 * เลือกจำนวนแถวที่แสดงในตาราง — 10 / 30 / 50
 */
function HallOfFameRowLimitSelect({
  value,
  onChange,
}: {
  value: HallOfFameRowLimit;
  onChange: (limit: HallOfFameRowLimit) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="hall-of-fame__row-limit relative shrink-0">
      <button
        type="button"
        className="hall-of-fame__row-limit-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="tabular-nums">{value}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="จำนวนแถวที่แสดง"
          className="hall-of-fame__row-limit-menu"
        >
          {ROW_LIMIT_OPTIONS.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`hall-of-fame__row-limit-option${selected ? " is-selected" : ""}`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * HallOfFame (Top Performance) — 2 แท็บ · ตารางเต็มความกว้าง · ธีม Cosmicbet
 * ถูกเรียกใช้ใน app/page.tsx (โฮม lobby มือถือ + desktop)
 */
export function HallOfFame({ datasets }: HallOfFameProps) {
  const [activeTab, setActiveTab] = useState<HallOfFameTabId>("latest-winner");
  const [rowLimit, setRowLimit] = useState<HallOfFameRowLimit>(10);
  const panelId = useId();
  const isLatestWinner = activeTab === "latest-winner";
  const valueColumnLabel = isLatestWinner ? "Payout" : "Multiple";
  const rows = (datasets[activeTab] ?? []).slice(0, rowLimit);

  return (
    <section
      className="hall-of-fame mt-10 w-full min-w-0 sm:mt-12"
      aria-labelledby="top-performance-title"
    >
      <div className="hall-of-fame__head mb-3 flex items-center gap-2">
        <TopPerformanceBadge className="hall-of-fame__title-icon h-7 w-7 sm:h-8 sm:w-8" />
        <h2
          id="top-performance-title"
          className="text-[18px] font-bold tracking-tight text-[var(--text-primary)] leading-[1.4] sm:text-[20px]"
        >
          Top Performance
        </h2>
      </div>

      <div className="hall-of-fame__toolbar mt-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className="hall-of-fame__tabs inline-flex max-w-full flex-wrap gap-2"
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
                className={`hall-of-fame__tab-btn ${selected ? "is-active" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <HallOfFameRowLimitSelect value={rowLimit} onChange={setRowLimit} />
      </div>

      <div
        id={`${panelId}-panel`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${activeTab}`}
        className="hall-of-fame__table-band hall-of-fame__table-band--borderless hall-of-fame__table-band--with-time relative mt-4 -mx-[var(--page-gutter)] w-[calc(100%+2*var(--page-gutter))] max-w-none lg:mx-0 lg:w-full"
      >
        <div className="hall-of-fame-table-wrap px-[var(--page-gutter)] lg:px-0">
          <table className="hall-of-fame-table w-full min-w-0 border-collapse text-left text-sm">
            <thead>
              <tr className="hall-of-fame-table__head-row text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] sm:text-[11px]">
                <th scope="col" className="hall-of-fame-table__th hall-of-fame-table__th--game">
                  Game
                </th>
                <th scope="col" className="hall-of-fame-table__th hall-of-fame-table__th--player">
                  Player
                </th>
                <th scope="col" className="hall-of-fame-table__th hall-of-fame-table__th--time">
                  Time
                </th>
                <th scope="col" className="hall-of-fame-table__th hall-of-fame-table__th--value">
                  {valueColumnLabel}
                </th>
              </tr>
            </thead>
            <tbody className="hall-of-fame-table__body">
              {rows.length === 0 ? (
                <tr className="hall-of-fame-table__row hall-of-fame-table__row--empty">
                  <td
                    className="hall-of-fame-table__empty py-8 text-center text-sm text-[var(--text-muted)]"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    ยังไม่มีรายการ
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hall-of-fame-table__row ${
                      index % 2 === 0 ? "hall-of-fame-table__row--framed" : ""
                    }`}
                  >
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--game">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <HallOfFameGameThumb row={row} />
                        <span className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--text-primary)] sm:text-sm">
                          {row.gameName}
                        </span>
                      </div>
                    </td>
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--player">
                      <span className="block truncate text-xs tabular-nums text-[var(--text-secondary)] sm:text-sm">
                        {row.playerMasked}
                      </span>
                    </td>
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--time">
                      <span className="block truncate text-[10px] tabular-nums text-[var(--text-secondary)] sm:text-xs">
                        {row.wonAtLabel ?? "—"}
                      </span>
                    </td>
                    <td className="hall-of-fame-table__td hall-of-fame-table__td--value">
                      {isLatestWinner && row.payout != null ? (
                        <span className="hall-of-fame-table__payout text-xs font-bold tabular-nums sm:text-sm">
                          {formatPayoutThb(row.payout)}
                        </span>
                      ) : null}
                      {!isLatestWinner && row.winMultiple != null ? (
                        <span className="hall-of-fame-table__payout text-xs font-extrabold tabular-nums sm:text-sm">
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
      </div>
    </section>
  );
}
