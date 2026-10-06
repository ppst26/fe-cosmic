"use client";

import React, { useMemo, useState } from "react";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelPrizeHistoryRow, WheelSpinMethod } from "@/app/types/reward";

interface LuckyWheelPrizeHistoryProps {
  extraRows?: WheelPrizeHistoryRow[];
}

/**
 * ตารางประวัติการหมุนของฉัน — ดีไซน์การ์ดมนตามภาพตัวอย่าง
 */
export function LuckyWheelPrizeHistory({ extraRows = [] }: LuckyWheelPrizeHistoryProps) {
  /** ใช้ cache เดียวกับ LuckyWheelPageContent (SWR) */
  const wheel = useWheel().data;
  const [page, setPage] = useState(1);

  const prizeHistory = wheel?.prizeHistory;
  const historyPageSize = wheel?.historyPageSize ?? 1;
  const allRows = useMemo(() => [...extraRows, ...(prizeHistory ?? [])], [extraRows, prizeHistory]);
  const totalPages = Math.max(
    1,
    Math.min(
      wheel?.historyTotalPages ?? 1,
      Math.ceil(allRows.length / historyPageSize),
    ),
  );
  const safePage = Math.min(page, totalPages);
  const sliceStart = (safePage - 1) * historyPageSize;
  const pageRows = allRows.slice(sliceStart, sliceStart + historyPageSize);

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-[#0e0b16]/90 p-4 shadow-xl"
      aria-labelledby="wheel-history-title"
    >
      <header className="flex items-center justify-between pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
            <ClockIcon className="h-4 w-4" />
          </span>
          <h2 id="wheel-history-title" className="text-sm font-medium text-white">
            ประวัติการหมุนของฉัน
          </h2>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline cursor-pointer"
        >
          ดูทั้งหมด &rsaquo;
        </button>
      </header>

      {/* รายการประวัติแบบการ์ดแถวมน ตรงตามรูปที่ 2 */}
      <div className="flex flex-1 flex-col gap-2 min-h-0">
        {pageRows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#14101e] px-3.5 py-3 text-xs transition-colors hover:bg-[#181326]"
          >
            <span className="w-24 shrink-0 text-[var(--text-secondary)] text-xs tabular-nums">
              {row.atLabel}
            </span>
            <div className="flex flex-1 items-center justify-center gap-1.5 font-medium text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/90">
                <DiamondSmallIcon />
              </span>
              <span>{row.amount} {row.prizeName}</span>
            </div>
            <div className="flex w-20 shrink-0 items-center justify-end gap-1 text-[var(--text-secondary)] text-xs">
              <DiamondOutlineSmallIcon />
              <span>{row.method === "gems" ? "ใช้เพชร" : "ใช้ตั๋ว"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <footer className="flex items-center justify-end gap-3 pt-3.5">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm text-white/80 transition-all hover:bg-white/20 disabled:opacity-30 cursor-pointer"
          aria-label="หน้าก่อน"
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &lsaquo;
        </button>
        <span className="text-xs tabular-nums text-white/70 font-medium">
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm text-white/80 transition-all hover:bg-white/20 disabled:opacity-30 cursor-pointer"
          aria-label="หน้าถัดไป"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          &rsaquo;
        </button>
      </footer>
    </section>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function DiamondSmallIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-white" fill="currentColor" aria-hidden="true">
      <path d="M8 2 13 7 10 14 6 14 3 7Z" />
    </svg>
  );
}

function DiamondOutlineSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden="true">
      <path d="M12 4 19 10 15 20 9 20 5 10Z" strokeLinejoin="round" />
    </svg>
  );
}
