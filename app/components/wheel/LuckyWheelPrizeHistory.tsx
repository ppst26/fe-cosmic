"use client";

import React, { useMemo, useState } from "react";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelPrizeHistoryRow, WheelPrizeKind, WheelSpinMethod } from "@/app/types/reward";
import { valueClass, type ValueRole } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface LuckyWheelPrizeHistoryProps {
  extraRows?: WheelPrizeHistoryRow[];
  /** desktop — คอลัมน์แคบข้างวงล้อ */
  variant?: "default" | "sidebar";
}

/**
 * ตารางประวัติการหมุนของฉัน — ดีไซน์การ์ดมนตามภาพตัวอย่าง
 */
export function LuckyWheelPrizeHistory({ extraRows = [], variant = "default" }: LuckyWheelPrizeHistoryProps) {
  const t = useT("rewards");
  const isSidebar = variant === "sidebar";
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
      className={cn(
        "surface-solid-stack cosmic-outline-subtle flex h-full min-h-0 flex-col p-4 lg:p-3",
        isSidebar && "min-w-0",
      )}
      aria-labelledby="wheel-history-title"
    >
      <header className={cn("flex items-start gap-2 pb-3.5 lg:pb-2.5", isSidebar && "gap-1.5")}>
        <ClockIcon
          className={cn("shrink-0 text-[var(--icon-default)]", isSidebar ? "mt-0.5 h-3.5 w-3.5" : "h-4 w-4")}
          aria-hidden="true"
        />
        <h2
          id="wheel-history-title"
          className={cn(
            "font-medium leading-snug text-[var(--text-primary)]",
            isSidebar ? "text-[11px] lg:text-xs" : "text-sm",
          )}
        >
          {t("wheel.history.title")}
        </h2>
      </header>

      {/* รายการประวัติแบบการ์ดแถวมน ตรงตามรูปที่ 2 */}
      <div className="flex flex-1 flex-col gap-2 min-h-0">
        {pageRows.map((row) => (
          <div
            key={row.id}
            className={cn(
              "surface-solid-inner cosmic-outline-subtle rounded-[var(--radius-card)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-solid-inner)_72%,var(--surface-hover))]",
              isSidebar
                ? "flex min-w-0 flex-col gap-1 px-2.5 py-2 text-[10px] leading-snug lg:text-[11px]"
                : "flex items-center justify-between gap-1 px-3 py-2.5 text-xs lg:px-2.5 lg:py-2",
            )}
          >
            {isSidebar ? (
              <div className="flex items-start justify-between gap-2">
                <span className={valueClass("muted", "shrink-0 tabular-nums")}>{row.atLabel}</span>
                <div className="flex min-w-0 flex-col items-end gap-0.5 text-right leading-snug">
                  <span className={valueClass(wheelPrizeValueRole(row.prizeKind), "font-medium tabular-nums")}>
                    +{row.amount} {row.prizeName}
                  </span>
                  <span className={valueClass(wheelSpinCostRole(row.method), "tabular-nums")}>
                    {row.method === "gems" ? t("wheel.history.usedGems") : t("wheel.history.usedTicket")}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <span className="w-24 shrink-0 tabular-nums text-xs text-[var(--text-secondary)]">
                  {row.atLabel}
                </span>
                <div className="flex flex-1 items-center justify-center gap-1.5 font-medium text-[var(--text-primary)]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/90">
                    <DiamondSmallIcon />
                  </span>
                  <span className={valueClass("reward")}>{row.amount} {row.prizeName}</span>
                </div>
                <div className="flex w-20 shrink-0 items-center justify-end gap-1 text-xs text-[var(--text-secondary)]">
                  <DiamondOutlineSmallIcon />
                  <span>{row.method === "gems" ? t("wheel.history.usedGems") : t("wheel.history.usedTicket")}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <footer className="flex items-center justify-end gap-3 pt-3.5">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm text-white/80 transition-all hover:bg-white/20 disabled:opacity-30 cursor-pointer"
          aria-label={t("wheel.history.prevPage")}
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
          aria-label={t("wheel.history.nextPage")}
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          &rsaquo;
        </button>
      </footer>
    </section>
  );
}

/** สีรางวัลที่ได้ — เขียว (ได้รับ) */
function wheelPrizeValueRole(_kind: WheelPrizeKind): ValueRole {
  return "success";
}

/** สีค่าใช้จ่าย — ใช้เพชรแดงอ่อน (ลด) · ใช้ตั๋ว neutral */
function wheelSpinCostRole(method: WheelSpinMethod): ValueRole {
  return method === "gems" ? "danger" : "neutral";
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
