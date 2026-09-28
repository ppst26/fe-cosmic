"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LOSS_REBATE_HISTORY_MOCK,
  LOSS_REBATE_HISTORY_PAGE_SIZE,
  LOSS_REBATE_MONTH_OPTIONS,
  LOSS_REBATE_SUMMARY_MOCK,
  LOSS_REBATE_TERMS,
  formatLossRebateCurrency,
  formatLossRebateDateTime,
  formatLossRebatePercent,
  formatLossRebateRecordCount,
  type LossRebateHistoryRow,
  type LossRebateSummaryMock,
} from "@/app/data/lossRebateMockData";
import { ChevronDownIcon } from "../ui/Icons";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { CosmicSelectField } from "../ui/CosmicSelectField";

type CashbackLossRebateExtraSectionsProps = {
  summary?: LossRebateSummaryMock;
  history?: LossRebateHistoryRow[];
};

/**
 * สูตรคำนวณ + ตารางประวัติ + เงื่อนไขคืนยอดเสีย — ต่อท้าย CashbackPageContent แท็บเสีย
 */
export function CashbackLossRebateExtraSections({
  summary = LOSS_REBATE_SUMMARY_MOCK,
  history = LOSS_REBATE_HISTORY_MOCK,
}: CashbackLossRebateExtraSectionsProps) {
  const [monthId, setMonthId] = useState(LOSS_REBATE_MONTH_OPTIONS[0]?.id ?? "2026-09");
  const [historyPage, setHistoryPage] = useState(1);
  const [termsOpen, setTermsOpen] = useState(false);

  const filteredHistory = useMemo(
    () => history.filter((row) => row.monthId === monthId),
    [history, monthId],
  );

  const totalHistory = filteredHistory.length;
  const pageSize = LOSS_REBATE_HISTORY_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalHistory / pageSize));
  const currentPage = Math.min(Math.max(1, historyPage), totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);

  const rangeStart = totalHistory === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalHistory);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  const handleMonthChange = (nextMonthId: string) => {
    setMonthId(nextMonthId);
    setHistoryPage(1);
  };

  return (
    <div className="loss-rebate-page flex flex-col gap-5 border-t border-[var(--border-subtle)]/35 pt-5">
      <LossRebateFormulaSection summary={summary} />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-[var(--text-primary)] sm:text-base">
            ประวัติการรับคืนยอดเสีย
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <CosmicSelectField
              aria-label="เลือกเดือน"
              value={monthId}
              onValueChange={handleMonthChange}
              triggerClassName="loss-rebate-page__month-select"
              options={LOSS_REBATE_MONTH_OPTIONS.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
            />
          </div>
        </div>

        <div className={`${COSMIC_PANEL_GLASS} overflow-hidden`}>
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="border-[var(--border-subtle)]/40 hover:bg-transparent">
                <TableHead className="h-11 px-3 text-[11px] font-medium text-[var(--border-active)] sm:px-4">
                  รอบคำนวณ
                </TableHead>
                <TableHead className="h-11 px-3 text-right text-[11px] font-medium text-[var(--border-active)] sm:px-4">
                  ยอดเสียสุทธิ
                </TableHead>
                <TableHead className="h-11 px-3 text-right text-[11px] font-medium text-[var(--border-active)] sm:px-4">
                  โบนัสที่ได้รับ
                </TableHead>
                <TableHead className="hidden h-11 px-3 text-right text-[11px] font-medium text-[var(--border-active)] sm:table-cell sm:px-4">
                  วันที่รับ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow className="border-[var(--border-subtle)]/30 hover:bg-transparent">
                  <TableCell
                    colSpan={4}
                    className="px-4 py-10 text-center text-xs text-[var(--text-muted)]"
                  >
                    ไม่มีประวัติในเดือนที่เลือก
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`border-[var(--border-subtle)]/30 hover:bg-[color-mix(in_srgb,var(--surface-hover)_35%,transparent)] ${
                      index % 2 === 1
                        ? "bg-[color-mix(in_srgb,var(--surface-solid-inner)_40%,transparent)]"
                        : "bg-transparent"
                    }`}
                  >
                    <TableCell className="px-3 py-3 text-xs font-medium text-[var(--text-primary)] sm:px-4">
                      {row.periodLabel}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-xs tabular-nums text-[var(--text-secondary)] sm:px-4">
                      {formatLossRebateCurrency(row.netLossThb)}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-xs font-medium tabular-nums text-[var(--text-primary)] sm:px-4">
                      {formatLossRebateCurrency(row.bonusThb)}
                    </TableCell>
                    <TableCell className="hidden px-3 py-3 text-right text-[11px] tabular-nums text-[var(--text-muted)] sm:table-cell sm:px-4">
                      {formatLossRebateDateTime(row.receivedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalHistory > 0 && (
            <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[var(--text-muted)]">
                แสดง {rangeStart}–{rangeEnd} จาก {formatLossRebateRecordCount(totalHistory)}
              </p>
              <nav className="flex items-center gap-1.5" aria-label="เปลี่ยนหน้าประวัติคืนยอดเสีย">
                <PaginationButton
                  label="หน้าก่อน"
                  disabled={currentPage <= 1}
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </PaginationButton>
                {pageNumbers.map((num) => (
                  <PaginationButton
                    key={num}
                    label={`หน้า ${num}`}
                    active={num === currentPage}
                    onClick={() => setHistoryPage(num)}
                  >
                    {num}
                  </PaginationButton>
                ))}
                <PaginationButton
                  label="หน้าถัดไป"
                  disabled={currentPage >= totalPages}
                  onClick={() => setHistoryPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </PaginationButton>
              </nav>
            </div>
          )}
        </div>
      </section>

      <section className={`${COSMIC_PANEL_GLASS} overflow-hidden`}>
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--surface-hover)_40%,transparent)]"
          aria-expanded={termsOpen}
        >
          <span className="glass-card--soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-[var(--text-muted)]">
            i
          </span>
          <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">เงื่อนไขการคืนยอดเสีย</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-[var(--icon-default)] transition-transform ${
              termsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {termsOpen && (
          <ul className="space-y-2 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {LOSS_REBATE_TERMS.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--accent-primary)]" aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function LossRebateFormulaSection({ summary }: { summary: LossRebateSummaryMock }) {
  return (
    <section className={`${COSMIC_PANEL_GLASS} px-4 py-4 sm:px-5`}>
      <h2 className="text-sm font-medium text-[var(--text-primary)]">รายละเอียดการคำนวณ</h2>
      <div className="mt-4 flex flex-row items-center gap-1.5 sm:gap-2">
        <FormulaBlock
          label="ยอดเสียสุทธิที่เข้าเงื่อนไข"
          value={formatLossRebateCurrency(summary.eligibleNetLossThb)}
        />
        <FormulaOperator symbol="×" />
        <FormulaBlock
          label="อัตราคืนยอดเสีย"
          value={formatLossRebatePercent(summary.rebateRatePercent)}
        />
        <FormulaOperator symbol="=" />
        <FormulaBlock
          label="โบนัสคืนยอดเสีย"
          value={formatLossRebateCurrency(summary.rebateBonusThb)}
          valueClassName="text-[var(--text-primary)]"
        />
      </div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">ข้อมูลและอัตราในภาพเป็นตัวอย่าง</p>
    </section>
  );
}

function FormulaBlock({
  label,
  value,
  valueClassName = "text-[var(--text-primary)]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="glass-card--soft min-w-0 flex-1 rounded-[var(--radius-control)] px-2 py-2 sm:px-3 sm:py-2.5">
      <p className="line-clamp-2 text-xs leading-normal text-[var(--text-secondary)] sm:text-[13px]">{label}</p>
      <p className={`mt-0.5 text-xs font-medium tabular-nums sm:text-base ${valueClassName}`}>{value}</p>
    </div>
  );
}

function FormulaOperator({ symbol }: { symbol: string }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center text-base font-medium text-[var(--text-muted)] sm:h-8 sm:w-8 sm:text-lg"
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

function PaginationButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`cosmic-choice-btn flex h-9 min-w-9 items-center justify-center px-2 text-xs disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "is-active" : ""
      }`}
    >
      {children}
    </button>
  );
}
