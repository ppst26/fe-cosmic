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
import type { LossRebateData } from "@/lib/api/cashback";
import { useLossRebate } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { ChevronDownIcon } from "../ui/Icons";
import { COSMIC_PANEL_SOLID } from "../ui/cosmicButtonClasses";
import { CosmicSelectField } from "../ui/CosmicSelectField";
import {
  CosmicFormulaCell,
  CosmicFormulaOperator,
  CosmicFormulaRow,
} from "../ui/CosmicFormulaRow";
import { CosmicDataTablePagination } from "../ui/CosmicDataTablePagination";
import { cosmicDataTableRowClass } from "../ui/cosmicDataTableRowClass";
import { LOSS_REBATE_HISTORY_PAGE_SIZE } from "@/lib/uiConstants";
import {
  formatLossRebateCurrency,
  formatLossRebateDateTime,
  formatLossRebatePercent,
  formatLossRebateRecordCount,
} from "@/lib/format";
import type { LossRebateHistoryRow, LossRebateSummaryMock } from "@/app/types/cashback";

type CashbackLossRebateExtraSectionsProps = {
  summary?: LossRebateSummaryMock;
  history?: LossRebateHistoryRow[];
};

/**
 * สูตรคำนวณ + ตารางประวัติ + เงื่อนไขคืนยอดเสีย — ต่อท้าย CashbackPageContent แท็บเสีย
 * โหลดผ่าน useLossRebate · ส่ง summary / history มาแทนค่าจาก API ได้
 */
export function CashbackLossRebateExtraSections({ summary, history }: CashbackLossRebateExtraSectionsProps) {
  const lossRebate = useLossRebate();
  return (
    <ResourceGate resource={lossRebate} loadingLabel="กำลังโหลดคืนยอดเสีย…" errorTitle="โหลดข้อมูลคืนยอดเสียไม่สำเร็จ">
      {(data) => (
        <LossRebateSections
          lossRebate={data}
          summary={summary ?? data.summary}
          history={history ?? data.history}
        />
      )}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — เดือนเริ่มต้นมาจาก lossRebate.months */
function LossRebateSections({
  lossRebate,
  summary,
  history,
}: {
  lossRebate: LossRebateData;
  summary: LossRebateSummaryMock;
  history: LossRebateHistoryRow[];
}) {
  const [monthId, setMonthId] = useState(lossRebate.months[0]?.id ?? "2026-09");
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
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <CosmicSelectField
              aria-label="เลือกเดือน"
              value={monthId}
              onValueChange={handleMonthChange}
              variant="solid"
              triggerClassName="loss-rebate-page__month-select"
              options={lossRebate.months.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
            />
          </div>
        </div>

        <div className="cosmic-data-table-shell">
          <Table className="cosmic-data-table text-sm">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 px-3 text-xs font-medium text-[var(--text-secondary)] sm:px-4">
                  รอบคำนวณ
                </TableHead>
                <TableHead className="h-11 px-3 text-right text-xs font-medium text-[var(--text-secondary)] sm:px-4">
                  ยอดเสียสุทธิ
                </TableHead>
                <TableHead className="h-11 px-3 text-right text-xs font-medium text-[var(--text-secondary)] sm:px-4">
                  โบนัสที่ได้รับ
                </TableHead>
                <TableHead className="hidden h-11 px-3 text-right text-xs font-medium text-[var(--text-secondary)] sm:table-cell sm:px-4">
                  วันที่รับ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={4}
                    className="px-4 py-10 text-center text-xs text-[var(--text-muted)]"
                  >
                    ไม่มีประวัติในเดือนที่เลือก
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, index) => (
                  <TableRow key={row.id} className={cosmicDataTableRowClass(index)}>
                    <TableCell className="px-3 py-3 text-xs font-medium text-[var(--text-primary)] sm:px-4">
                      {row.periodLabel}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-xs tabular-nums text-[var(--text-secondary)] sm:px-4">
                      {formatLossRebateCurrency(row.netLossThb)}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right text-xs font-medium tabular-nums text-[var(--text-primary)] sm:px-4">
                      {formatLossRebateCurrency(row.bonusThb)}
                    </TableCell>
                    <TableCell className="hidden px-3 py-3 text-right text-xs tabular-nums text-[var(--text-secondary)] sm:table-cell sm:px-4">
                      {formatLossRebateDateTime(row.receivedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalHistory > 0 && (
            <div className="cosmic-data-table__footer flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[var(--text-muted)]">
                แสดง {rangeStart}–{rangeEnd} จาก {formatLossRebateRecordCount(totalHistory)}
              </p>
              <CosmicDataTablePagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setHistoryPage}
                aria-label="เปลี่ยนหน้าประวัติคืนยอดเสีย"
              />
            </div>
          )}
        </div>
      </section>

      <section className={`${COSMIC_PANEL_SOLID} overflow-hidden`}>
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[var(--inner-card-fill-hover)]"
          aria-expanded={termsOpen}
        >
          <span className="loss-rebate-page__info-well flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-[var(--text-muted)]">
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
          <ul className="space-y-2 border-t border-[color-mix(in_srgb,var(--border-subtle)_50%,transparent)] px-4 py-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {lossRebate.terms.map((line) => (
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
    <section className={`${COSMIC_PANEL_SOLID} px-4 py-4 sm:px-5`}>
      <h2 className="text-sm font-medium text-[var(--text-primary)]">รายละเอียดการคำนวณ</h2>
      <CosmicFormulaRow className="mt-4">
        <CosmicFormulaCell
          label="ยอดเสียสุทธิที่เข้าเงื่อนไข"
          value={formatLossRebateCurrency(summary.eligibleNetLossThb)}
        />
        <CosmicFormulaOperator symbol="×" />
        <CosmicFormulaCell
          label="อัตราคืนยอดเสีย"
          value={formatLossRebatePercent(summary.rebateRatePercent)}
        />
        <CosmicFormulaOperator symbol="=" />
        <CosmicFormulaCell
          label="โบนัสคืนยอดเสีย"
          value={formatLossRebateCurrency(summary.rebateBonusThb)}
        />
      </CosmicFormulaRow>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">ข้อมูลและอัตราในภาพเป็นตัวอย่าง</p>
    </section>
  );
}

