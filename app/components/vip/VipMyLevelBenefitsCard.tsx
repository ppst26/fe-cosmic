"use client";

import React from "react";
import type { VipPlayerState } from "@/app/types/vip";
import {
  getVipBenefitCellValue,
  VIP_BENEFIT_COMPARISON_VALUES,
} from "@/app/data/vipMockData";
import { cn } from "@/lib/utils";

/** สิทธิ์ในแท็บระดับของฉัน — ตรงตารางสิทธิประโยชน์ */
const MY_LEVEL_BENEFIT_ROWS: { id: string; label: string }[] = [
  { id: "cashback", label: "Cashback" },
  { id: "rolling", label: "Rolling" },
  { id: "diamond-deposit", label: "เพชรจากฝาก" },
  { id: "fast-withdraw", label: "ถอนด่วน" },
  { id: "vip-manager", label: "VIP Manager" },
];

/**
 * บล็อกสิทธิประโยชน์ — การ์ดกลุ่ม + inner chip สลับสีในกริด
 */
export function VipMyLevelBenefitsCard({ player }: { player: VipPlayerState }) {
  return (
    <section className="vip-my-level-benefits w-full">
      <div className="vip-panel-card vip-my-level-benefits__group">
        <h3 className="mb-2.5 text-center text-lg font-semibold tracking-wide text-[var(--text-primary)] sm:mb-3 sm:text-xl">
          สิทธิประโยชน์
        </h3>
        <ul className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {MY_LEVEL_BENEFIT_ROWS.map((row, index) => {
            const value = getVipBenefitCellValue(
              row.id,
              player.currentRankId,
              VIP_BENEFIT_COMPARISON_VALUES,
            );
            return (
              <li
                key={row.id}
                className={cn(
                  "vip-my-level-benefits__cell flex min-w-0 items-center gap-1.5 sm:gap-2",
                  index % 2 === 0 ? "vip-my-level-benefits__cell--a" : "vip-my-level-benefits__cell--b",
                )}
              >
                <BenefitRowIcon rowId={row.id} />
                <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-secondary)] sm:text-base">
                  {row.label}
                </span>
                <p
                  className={cn(
                    "vip-my-level-benefits__value shrink-0 text-right text-lg font-bold leading-none tabular-nums sm:text-xl",
                    benefitValueTone(value),
                  )}
                >
                  {value}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function benefitValueTone(value: string): string {
  const normalized = value.trim();
  if (normalized === "—" || normalized === "-" || normalized === "–") {
    return "vip-my-level-benefits__value--muted";
  }
  if (normalized.includes("✓") || normalized.includes("✔")) {
    return "vip-my-level-benefits__value--success";
  }
  return "";
}

function BenefitRowIcon({ rowId, className: extraClass }: { rowId: string; className?: string }) {
  const className = cn("h-5 w-5 shrink-0 text-[var(--icon-default)]", extraClass);
  switch (rowId) {
    case "cashback":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
          <path d="M7 7h10M7 12h6M7 17h4" strokeLinecap="round" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      );
    case "rolling":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
          <path d="M4 18V6M4 18h16M20 6v12" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
          <path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z" strokeLinejoin="round" />
        </svg>
      );
  }
}
