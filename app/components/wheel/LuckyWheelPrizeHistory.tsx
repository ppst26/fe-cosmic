"use client";

import React, { useMemo, useState } from "react";
import {
  LUCKY_WHEEL_HISTORY_PAGE_SIZE,
  LUCKY_WHEEL_HISTORY_TOTAL_PAGES,
  LUCKY_WHEEL_PRIZE_HISTORY,
  type WheelPrizeHistoryRow,
  type WheelSpinMethod,
} from "@/app/data/luckyWheelMockData";

interface LuckyWheelPrizeHistoryProps {
  extraRows?: WheelPrizeHistoryRow[];
}

/**
 * ตารางประวัติรางวัลของผู้เล่น — ใช้ใน LuckyWheelPageContent
 */
export function LuckyWheelPrizeHistory({ extraRows = [] }: LuckyWheelPrizeHistoryProps) {
  const [page, setPage] = useState(1);

  const allRows = useMemo(() => [...extraRows, ...LUCKY_WHEEL_PRIZE_HISTORY], [extraRows]);
  const totalPages = Math.max(1, Math.min(LUCKY_WHEEL_HISTORY_TOTAL_PAGES, Math.ceil(allRows.length / LUCKY_WHEEL_HISTORY_PAGE_SIZE)));
  const safePage = Math.min(page, totalPages);
  const sliceStart = (safePage - 1) * LUCKY_WHEEL_HISTORY_PAGE_SIZE;
  const pageRows = allRows.slice(sliceStart, sliceStart + LUCKY_WHEEL_HISTORY_PAGE_SIZE);

  return (
    <section className="lucky-wheel-history cosmic-inset-card flex h-full min-h-0 flex-col" aria-labelledby="wheel-history-title">
      <header className="lucky-wheel-history__head">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-[var(--icon-active)]" />
          <h2 id="wheel-history-title" className="text-sm font-bold text-[var(--text-primary)]">
            ประวัติรางวัลของคุณ
          </h2>
        </div>
        <button type="button" className="lucky-wheel-wallet__link text-xs font-semibold">
          ดูทั้งหมด ›
        </button>
      </header>

      <div className="lucky-wheel-history__table-wrap min-h-0 flex-1 overflow-x-auto">
        <table className="lucky-wheel-history__table">
          <thead>
            <tr>
              <th scope="col">วันที่ – เวลา</th>
              <th scope="col">รางวัลที่ได้รับ</th>
              <th scope="col">จำนวน</th>
              <th scope="col">วิธีการหมุน</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id}>
                <td className="text-[var(--text-secondary)]">{row.atLabel}</td>
                <td>
                  <span className="inline-flex items-center gap-1.5">
                    <PrizeKindIcon kind={row.prizeKind} />
                    {row.prizeName}
                  </span>
                </td>
                <td className="lucky-wheel-history__amount tabular-nums">{row.amount}</td>
                <td>
                  <MethodLabel method={row.method} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="lucky-wheel-history__pager">
        <button
          type="button"
          className="lucky-wheel-history__pager-btn"
          aria-label="หน้าก่อน"
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ‹
        </button>
        <span className="text-xs tabular-nums text-[var(--text-secondary)]">
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className="lucky-wheel-history__pager-btn"
          aria-label="หน้าถัดไป"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          ›
        </button>
      </footer>
    </section>
  );
}

function MethodLabel({ method }: { method: WheelSpinMethod }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
      {method === "gems" ? <GemMiniIcon /> : <TicketMiniIcon />}
      {method === "gems" ? "ใช้เพชร" : "ใช้ตั๋ว"}
    </span>
  );
}

function PrizeKindIcon({ kind }: { kind: WheelPrizeHistoryRow["prizeKind"] }) {
  return kind === "gems" ? <GemMiniIcon /> : <CreditMiniIcon />;
}

function GemMiniIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[var(--icon-active)]" aria-hidden="true">
      <path d="M8 2 13 7 10 14 6 14 3 7Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function CreditMiniIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[var(--icon-active)]" aria-hidden="true">
      <circle cx="8" cy="8" r="5" fill="currentColor" opacity="0.35" />
      <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function TicketMiniIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[var(--icon-default)]" aria-hidden="true">
      <rect x="3" y="4" width="10" height="8" rx="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" />
    </svg>
  );
}
