"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";
import {
  COSMIC_DATA_TABLE,
  COSMIC_DATA_TABLE_SHELL_OUTLINE,
} from "../ui/cosmicDataTableClasses";
import { cn } from "@/lib/utils";
import { valueClass } from "@/lib/semanticValue";
import { useT } from "@/lib/i18n/I18nProvider";
import type { CashbackMessageKey } from "@/app/types/cashback";

/** ช่วงเวลาสรุปยอด — layout แบบ dashboard (ยังไม่ผูก API รายละเอียดทุกแท็บ) */
export type CashbackInsightPeriodId = "all" | "today" | "last_week" | "last_month";

export const CASHBACK_INSIGHT_PERIODS: { id: CashbackInsightPeriodId; labelKey: CashbackMessageKey }[] = [
  { id: "all", labelKey: "periods.all" },
  { id: "today", labelKey: "periods.today" },
  { id: "last_week", labelKey: "periods.lastWeek" },
  { id: "last_month", labelKey: "periods.lastMonth" },
];

type CashbackPanelShellProps = {
  children: React.ReactNode;
  embedded?: boolean;
  className?: string;
};

/**
 * กล่องหลักแท็บคืนยอด — โครงแบบ dashboard (หัวข้อ · แถบรับ · ช่วงเวลา · สรุป · ตาราง)
 * ใช้ใน CashbackPageContent
 */
export function CashbackPanelShell({ children, embedded = false, className }: CashbackPanelShellProps) {
  return (
    <section
      className={cn(
        embedded ? "hub-desktop-card px-4 py-4 sm:px-5" : "surface-solid-stack px-4 py-4 sm:px-5 sm:py-5",
        "flex flex-col gap-4",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** หัวข้อกลางในกล่องหลัก */
export function CashbackPanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-b border-[var(--border-subtle)]/40 pb-3 text-center">
      <h2 className="text-base font-medium text-[var(--text-primary)]">{title}</h2>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>
    </header>
  );
}

type CashbackClaimRowProps = {
  amountLabel: string;
  amount: React.ReactNode;
  statusHint: string;
  claimLabel: string;
  canClaim: boolean;
  onClaim: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

/** แถบยอดรับได้ + ปุ่มรับ (ซ้ายข้อความ · ขวา CTA) */
export function CashbackClaimRow({
  amountLabel,
  amount,
  statusHint,
  claimLabel,
  canClaim,
  onClaim,
  onRefresh,
  refreshing = false,
}: CashbackClaimRowProps) {
  const t = useT("cashback");
  const claimDisabled = !canClaim;

  return (
    <div className="surface-solid-inner flex items-center justify-between gap-3 p-3.5 sm:gap-4 sm:p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--text-secondary)] sm:text-[13px]">{amountLabel}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className={valueClass("reward", "text-xl leading-tight sm:text-2xl")}>{amount}</p>
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex shrink-0 items-center justify-center text-[var(--icon-default)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
              aria-label={t("panel.refresh")}
            >
              <RefreshIcon className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-xs">{statusHint}</p>
      </div>
      <button
        type="button"
        disabled={claimDisabled}
        onClick={onClaim}
        className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--sm flex h-10 shrink-0 items-center justify-center px-4 text-xs disabled:opacity-45 sm:h-11 sm:px-5 sm:text-sm`}
      >
        {claimLabel}
      </button>
    </div>
  );
}

type CashbackInsightPeriodTabsProps = {
  activeId: CashbackInsightPeriodId;
  onSelect: (id: CashbackInsightPeriodId) => void;
};

/** แถบเลือกช่วงเวลา 4 ช่อง */
export function CashbackInsightPeriodTabs({ activeId, onSelect }: CashbackInsightPeriodTabsProps) {
  const t = useT("cashback");
  return (
    <div
      className="cosmic-segment-track cosmic-segment-track--glass-white grid grid-cols-4 gap-1.5 p-1.5"
      role="group"
      aria-label={t("periods.ariaLabel")}
    >
      {CASHBACK_INSIGHT_PERIODS.map((period) => {
        const isActive = period.id === activeId;
        return (
          <button
            key={period.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(period.id)}
            className={cn(
              "cosmic-segment-btn min-h-9 px-1.5 py-2 text-xs font-medium leading-snug sm:text-[13px]",
              isActive ? "is-active" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {t(period.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

type CashbackHighlightCardProps = {
  primaryLabel: string;
  primaryValue: React.ReactNode;
  secondaryValue: React.ReactNode;
  secondaryHint: string;
};

/** การ์ดสรุปกรอบ outline — ซ้ายยอด · ขวาตัวเลขรอง */
export function CashbackHighlightCard({
  primaryLabel,
  primaryValue,
  secondaryValue,
  secondaryHint,
}: CashbackHighlightCardProps) {
  return (
    <div
      className="cosmic-outline-subtle flex items-start justify-between gap-4 rounded-[var(--radius-panel)] px-3.5 py-3 sm:px-4 sm:py-3.5"
    >
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-secondary)]">{primaryLabel}</p>
        <p className={valueClass("emphasis", "mt-1 text-xl leading-tight sm:text-2xl")}>{primaryValue}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className={valueClass("neutral", "text-lg leading-tight sm:text-xl")}>{secondaryValue}</p>
        <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-xs">{secondaryHint}</p>
      </div>
    </div>
  );
}

export type CashbackRuleRow = {
  id: string;
  label: string;
  value: React.ReactNode;
};

type CashbackRulesTableSectionProps = {
  title: string;
  rows: CashbackRuleRow[];
  action?: React.ReactNode;
};

/** ตารางเงื่อนไข 2 คอลัมน์ — outline */
export function CashbackRulesTableSection({ title, rows, action }: CashbackRulesTableSectionProps) {
  const t = useT("cashback");
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">{title}</h3>
        {action}
      </div>
      <div className={COSMIC_DATA_TABLE_SHELL_OUTLINE}>
        <Table className={`${COSMIC_DATA_TABLE} text-sm`}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 px-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4">
                {t("rules.item")}
              </TableHead>
              <TableHead className="h-10 px-3 text-right text-xs font-medium text-[var(--text-secondary)] sm:px-4">
                {t("rules.value")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-0 hover:bg-transparent">
                <TableCell className="px-3 py-3 text-xs text-[var(--text-secondary)] sm:px-4 sm:text-sm">
                  {row.label}
                </TableCell>
                <TableCell className="px-3 py-3 text-right text-xs font-medium tabular-nums text-[var(--text-primary)] sm:px-4 sm:text-sm">
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.2 5.5" strokeLinecap="round" />
      <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
