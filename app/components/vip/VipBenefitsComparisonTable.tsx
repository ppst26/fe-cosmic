"use client";

import React, { useEffect, useRef } from "react";
import type { VipRankId } from "@/app/types/vip";
import {
  getVipBenefitCellValue,
  getVipRankIndex,
  VIP_BENEFIT_COMPARISON_ROWS,
  VIP_RANK_TIERS,
} from "@/app/data/vipMockData";
import { ChevronRightIcon } from "../ui/Icons";
import { VipRankEmblem } from "./VipRankEmblem";

interface VipBenefitsComparisonTableProps {
  currentRankId: VipRankId;
  /** desktop VIP modal — ตารางเต็มความกว้างในการ์ด */
  variant?: "default" | "desktop-full";
}

const STICKY_BG = "bg-[var(--surface-mid)]";
const COL_MIN = "min-w-[5.75rem] w-[5.75rem]";

/**
 * ตารางสิทธิประโยชน์ — คอลัมน์แรก sticky เลื่อนแรงค์ซ้าย–ขวาได้
 */
export function VipBenefitsComparisonTable({
  currentRankId,
  variant = "default",
}: VipBenefitsComparisonTableProps) {
  const isDesktopFull = variant === "desktop-full";
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentColRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    const col = currentColRef.current;
    const scroller = scrollRef.current;
    if (!col || !scroller) return;

    const colLeft = col.offsetLeft - scroller.clientWidth / 2 + col.offsetWidth / 2;
    scroller.scrollTo({ left: Math.max(0, colLeft - 120), behavior: "smooth" });
  }, [currentRankId]);

  return (
    <div className={`space-y-2 ${isDesktopFull ? "vip-benefits-table--desktop-full" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          สิทธิประโยชน์แต่ละระดับ
        </h3>
        <p className="max-w-[9rem] text-right text-[10px] leading-snug text-[var(--text-muted)]">
          เลื่อนเพื่อดูระดับเพิ่มเติม
        </p>
      </div>

      <div
        className={`relative overflow-hidden ${
          isDesktopFull
            ? "vip-benefits-table__scroll-wrap rounded-[var(--radius-control)] bg-[rgb(0_0_0/0.22)]"
            : "cosmic-inset-card bg-[var(--surface-hover)]/30"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-8 rounded-r-[10px] bg-gradient-to-l from-[var(--surface-mid)] to-transparent"
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [scrollbar-color:var(--border-active)_transparent]"
        >
          <table className="w-max min-w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]/50">
                <th
                  className={`sticky left-0 z-20 ${STICKY_BG} min-w-[7.5rem] px-3 py-2.5 text-left font-medium text-[var(--text-secondary)] shadow-[4px_0_12px_rgba(0,0,0,0.25)]`}
                >
                  สิทธิประโยชน์
                </th>
                {VIP_RANK_TIERS.map((tier) => {
                  const isCurrent = tier.id === currentRankId;
                  return (
                    <th
                      key={tier.id}
                      ref={isCurrent ? currentColRef : undefined}
                      className={`${COL_MIN} px-1 py-2 align-bottom ${
                        isCurrent
                          ? "bg-[var(--surface-hover)]/70 ring-1 ring-inset ring-[var(--border-active)]/45"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 pb-0.5">
                        <VipRankEmblem rankId={tier.id} size="sm" playing={false} />
                        <span
                          className="text-[10px] font-medium tracking-wide"
                          style={{ color: tier.accent }}
                        >
                          {tier.label}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-[var(--cta-white-bg)] px-2 py-0.5 text-[9px] font-medium text-[var(--cta-white-fg)]">
                            ระดับของฉัน
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {VIP_BENEFIT_COMPARISON_ROWS.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={
                    rowIndex % 2 === 0
                      ? "bg-[var(--surface-hover)]/20"
                      : "bg-transparent"
                  }
                >
                  <td
                    className={`sticky left-0 z-10 ${STICKY_BG} border-r border-[var(--border-subtle)]/40 px-3 py-2.5 font-medium text-[var(--text-primary)] shadow-[4px_0_12px_rgba(0,0,0,0.2)]`}
                  >
                    {row.label}
                  </td>
                  {VIP_RANK_TIERS.map((tier) => {
                    const isCurrent = tier.id === currentRankId;
                    const locked = getVipRankIndex(tier.id) > getVipRankIndex(currentRankId);
                    return (
                      <td
                        key={tier.id}
                        className={`${COL_MIN} px-2 py-2.5 text-center tabular-nums ${
                          isCurrent
                            ? "bg-[var(--surface-hover)]/50 font-medium text-[var(--text-primary)]"
                            : locked
                              ? "text-[var(--text-muted)]"
                              : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {getVipBenefitCellValue(row.id, tier.id)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-[var(--border-subtle)]/40 px-2 py-1.5 text-[var(--text-muted)]">
          <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" />
        </div>
      </div>
    </div>
  );
}
