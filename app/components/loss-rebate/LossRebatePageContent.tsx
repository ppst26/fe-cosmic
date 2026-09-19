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
import { ChevronDownIcon, ChevronRightIcon } from "../ui/Icons";

/**
 * เนื้อหาหน้าคืนยอดเสีย — ใช้ใน /loss-rebate
 */
export function LossRebatePageContent({
  initialSummary = LOSS_REBATE_SUMMARY_MOCK,
  history = LOSS_REBATE_HISTORY_MOCK,
}: {
  initialSummary?: LossRebateSummaryMock;
  history?: LossRebateHistoryRow[];
}) {
  const [summary, setSummary] = useState(initialSummary);
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

  const handleClaim = () => {
    if (!summary.isReadyToClaim || summary.rebateReadyThb <= 0) return;
    setSummary((prev) => ({
      ...prev,
      isReadyToClaim: false,
      rebateReadyThb: 0,
      statusLabel: "รับแล้ว",
    }));
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <header>
        <h1 className="text-xl font-medium text-[var(--text-primary)] sm:text-2xl">คืนยอดเสีย</h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
          ตรวจสอบยอดคืนและรับโบนัสเข้ากระเป๋าของคุณ
        </p>
      </header>

      <LossRebateHeroCard summary={summary} onClaim={handleClaim} />

      <LossRebateFormulaSection summary={summary} />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-[var(--text-primary)] sm:text-base">
            ประวัติการรับคืนยอดเสีย
          </h2>
          <label className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span className="sr-only">เลือกเดือน</span>
            <select
              value={monthId}
              onChange={(event) => handleMonthChange(event.target.value)}
              className="rounded-[var(--radius-control)] border border-[var(--border-subtle)]/60 bg-[var(--surface-mid)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] outline-none"
            >
              {LOSS_REBATE_MONTH_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-hover)]/25">
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
                    className={`border-[var(--border-subtle)]/30 hover:bg-[var(--surface-hover)]/40 ${
                      index % 2 === 1 ? "bg-[var(--surface-mid)]/45" : "bg-transparent"
                    }`}
                  >
                    <TableCell className="px-3 py-3 text-xs font-medium text-[var(--text-primary)] sm:px-4">
                      {row.periodLabel}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-xs tabular-nums text-[var(--text-secondary)] sm:px-4">
                      {formatLossRebateCurrency(row.netLossThb)}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-xs font-medium tabular-nums text-[#c4b5fd] sm:px-4">
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

      <section className="overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-hover)]/35">
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/20"
          aria-expanded={termsOpen}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)]/70 text-[10px] font-medium text-[var(--text-muted)]">
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
                <span className="text-[var(--border-active)]" aria-hidden="true">
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

function LossRebateHeroCard({
  summary,
  onClaim,
}: {
  summary: LossRebateSummaryMock;
  onClaim: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-hover)]/35 px-4 py-4 sm:px-5 sm:py-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 85% 20%, rgba(124,108,255,0.28) 0%, rgba(9,11,24,0.2) 45%, transparent 70%)",
        }}
      />
      <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--text-secondary)]">ยอดคืนที่ได้รับ</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-2xl font-medium tabular-nums text-[var(--text-primary)] sm:text-3xl">
              {formatLossRebateCurrency(summary.rebateReadyThb)}
            </p>
            {summary.isReadyToClaim && summary.rebateReadyThb > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0f3d2e] px-2.5 py-0.5 text-[10px] font-medium text-[var(--success)]">
                <span aria-hidden="true">•</span> พร้อมรับ
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={!summary.isReadyToClaim || summary.rebateReadyThb <= 0}
            onClick={onClaim}
            className="cosmic-action-btn mt-4 inline-flex items-center gap-1 px-4 py-2.5 text-xs disabled:opacity-45 sm:text-sm"
          >
            รับโบนัสคืนยอดเสีย
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex shrink-0 flex-col items-center sm:items-end">
          <RebateCoinGraphic className="h-24 w-24 sm:h-28 sm:w-28" />
          <p className="mt-1 text-[10px] text-[var(--text-muted)]">
            อัตราคืนตัวอย่าง {formatLossRebatePercent(summary.exampleRatePercent)}
          </p>
        </div>
      </div>

      <div className="relative z-[1] mt-4 grid grid-cols-2 gap-3 pt-2">
        <div className="cosmic-inset-card flex min-w-0 items-center gap-2.5 bg-[var(--surface-hover)]/25 px-2 py-2 sm:px-3">
          <ClockIcon className="h-5 w-5 shrink-0 text-[var(--border-active)]" />
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--text-muted)]">รอบคำนวณ</p>
            <p className="truncate text-xs font-medium text-[var(--text-primary)]">
              {summary.calculationPeriodLabel}
            </p>
          </div>
        </div>
        <div className="cosmic-inset-card flex min-w-0 items-center gap-2.5 bg-[var(--surface-hover)]/25 px-2 py-2 sm:px-3">
          <DocumentIcon className="h-5 w-5 shrink-0 text-[var(--border-active)]" />
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--text-muted)]">สถานะ</p>
            <p className="truncate text-xs font-medium text-[var(--text-primary)]">{summary.statusLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LossRebateFormulaSection({ summary }: { summary: LossRebateSummaryMock }) {
  return (
    <section className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-hover)]/30 px-4 py-4 sm:px-5">
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
          valueClassName="text-[#c4b5fd]"
        />
      </div>
      <p className="mt-3 text-[11px] text-[var(--text-muted)]">ข้อมูลและอัตราในภาพเป็นตัวอย่าง</p>
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
    <div className="min-w-0 flex-1 rounded-[var(--radius-control)] border border-[var(--border-subtle)]/40 bg-[var(--surface-mid)]/50 px-2 py-2 sm:px-3 sm:py-2.5">
      <p className="line-clamp-2 text-[9px] leading-tight text-[var(--text-muted)] sm:text-[10px]">{label}</p>
      <p
        className={`mt-0.5 text-xs font-medium tabular-nums sm:text-base ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

function FormulaOperator({ symbol }: { symbol: string }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center text-base font-medium text-[#c4b5fd] sm:h-8 sm:w-8 sm:text-lg"
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

function RebateCoinGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="44" fill="none" stroke="#7c6cff" strokeWidth="6" strokeDasharray="18 10" />
      <circle cx="60" cy="60" r="28" fill="url(#lossRebateCoin)" stroke="#facc15" strokeWidth="2" />
      <path
        d="M60 44v32M48 56h24"
        stroke="#78350f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="lossRebateCoin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M8 4h8l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 4v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
      className={`cosmic-choice-btn flex h-9 min-w-9 items-center justify-center border px-2 text-xs disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "is-active border-transparent"
          : "border-[var(--border-subtle)]/60 bg-[var(--surface-mid)]/80 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}
