"use client";

import React, { useEffect, useRef } from "react";
import type { VipRankId } from "@/app/types/vip";
import {
  getVipBenefitCellValue,
  getVipRankIndex,
} from "@/app/data/vipMockData";
import { fetchVipBenefits, fetchVipRanks } from "@/lib/api/vip";
import { ChevronRightIcon } from "../ui/Icons";
import { VipRankEmblem } from "./VipRankEmblem";

interface VipBenefitsComparisonTableProps {
  currentRankId: VipRankId;
  /** desktop VIP modal — ตารางเต็มความกว้างในการ์ด */
  variant?: "default" | "desktop-full";
}

const COL_MIN = "min-w-[5.75rem] w-[5.75rem]";

/**
 * ตารางสิทธิประโยชน์ — คอลัมน์แรก sticky เลื่อนแรงค์ซ้าย–ขวาได้
 */
export function VipBenefitsComparisonTable({
  currentRankId,
  variant = "default",
}: VipBenefitsComparisonTableProps) {
  const { rows: benefitRows } = fetchVipBenefits();
  const vipRankTiers = fetchVipRanks().tiers;
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
    <div
      className={`space-y-2 ${isDesktopFull ? "vip-benefits-table--desktop-full min-h-0 flex-1 pb-1" : "pb-2"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)] sm:text-[0.9375rem]">
          สิทธิประโยชน์แต่ละระดับ
        </h3>
        <p className="max-w-[9rem] text-right text-xs leading-snug text-[var(--text-muted)]">
          เลื่อนเพื่อดูระดับเพิ่มเติม
        </p>
      </div>

      <div
        className={`vip-benefits-table__scroll-wrap relative ${
          isDesktopFull ? "vip-benefits-table__scroll-wrap--desktop-full rounded-[var(--radius-control)]" : "cosmic-inset-card"
        }`}
      >
        <div
          className="vip-benefits-table__edge-fade pointer-events-none absolute inset-y-0 right-0 z-30 w-10"
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          className="vip-benefits-table__scroller overflow-x-auto overscroll-x-contain"
        >
          <table className="vip-benefits-table w-max min-w-full text-xs sm:text-[0.8125rem]">
            <thead>
              <tr>
                <th
                  className="vip-benefits-table__label-head min-w-[8.25rem] px-3 py-3 text-left sm:min-w-[9rem] sm:px-4"
                >
                  สิทธิประโยชน์
                </th>
                {vipRankTiers.map((tier) => {
                  const isCurrent = tier.id === currentRankId;
                  return (
                    <th
                      key={tier.id}
                      ref={isCurrent ? currentColRef : undefined}
                      className={`vip-benefits-table__rank-head ${COL_MIN} px-1 py-2 align-bottom ${
                        isCurrent ? "vip-benefits-table__rank-head--current" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 pb-0.5">
                        <VipRankEmblem rankId={tier.id} size="sm" playing={false} />
                        <span
                          className="text-xs font-medium tracking-wide"
                          style={{ color: tier.accent }}
                        >
                          {tier.label}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-[var(--cta-white-bg)] px-2 py-0.5 text-xs font-medium text-[var(--cta-white-fg)]">
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
              {benefitRows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={
                    rowIndex % 2 === 0 ? "vip-benefits-table__row--alt" : "vip-benefits-table__row"
                  }
                >
                  <td
                    className="vip-benefits-table__label min-w-[8.25rem] px-3 py-3 sm:min-w-[9rem] sm:px-4"
                  >
                    {row.label}
                  </td>
                  {vipRankTiers.map((tier) => {
                    const isCurrent = tier.id === currentRankId;
                    const locked = getVipRankIndex(tier.id) > getVipRankIndex(currentRankId);
                    return (
                      <td
                        key={tier.id}
                        className={`vip-benefits-table__value ${COL_MIN} px-2 py-3 text-center tabular-nums ${
                          isCurrent
                            ? "vip-benefits-table__value--current font-medium"
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

        <div className="vip-benefits-table__hint flex items-center justify-end gap-1 px-2 py-1.5 text-[var(--text-muted)]">
          <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" />
        </div>
      </div>
    </div>
  );
}
