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
import { useReferralEarnings } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import {
  COSMIC_BTN_PRIMARY,
} from "../ui/cosmicButtonClasses";
import { Menu3DIcon } from "../ui/Menu3DIcon";
import { CosmicDataTablePagination } from "../ui/CosmicDataTablePagination";
import {
  COSMIC_DATA_TABLE,
  COSMIC_DATA_TABLE_SHELL_OUTLINE,
} from "../ui/cosmicDataTableClasses";
import { cosmicDataTableRowClass } from "../ui/cosmicDataTableRowClass";
import { valueClass } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { REFERRAL_EARNING_PAGE_SIZE } from "@/lib/uiConstants";
import {
  formatReferralCurrency,
  formatReferralEarningDateTime,
  formatReferralRecordCount,
} from "@/lib/format";
import type { ReferralEarningHistoryRow, ReferralEarningSummaryMock } from "@/app/types/referral";

type ReferralEarningPanelProps = {
  summary?: ReferralEarningSummaryMock;
  history?: ReferralEarningHistoryRow[];
  showSummary?: boolean;
  sectionTitle?: string;
  received?: number;
  claimable?: number;
  onClaim?: () => void;
  /** desktop hub — ตารางไม่ห่อการ์ดทึบ */
  flat?: boolean;
};

/**
 * แท็บ Earning — สรุปโบนัส + ประวัติรับโบนัส (10 แถว/หน้า)
 * ใช้ใน ReferralPageContent · ไม่ส่ง summary/history → โหลดจาก useReferralEarnings
 */
export function ReferralEarningPanel(props: ReferralEarningPanelProps) {
  const earnings = useReferralEarnings();
  if (props.summary && props.history) {
    return <ReferralEarningPanelContent {...props} summary={props.summary} history={props.history} />;
  }
  return (
    <ResourceGate resource={earnings} loadingLabel="กำลังโหลดรายได้…" errorTitle="โหลดรายได้ไม่สำเร็จ">
      {(data) => (
        <ReferralEarningPanelContent
          {...props}
          summary={props.summary ?? data.summary}
          history={props.history ?? data.history}
        />
      )}
    </ResourceGate>
  );
}

function ReferralEarningPanelContent({
  summary,
  history,
  showSummary = true,
  sectionTitle = "ประวัติรับโบนัส",
  received: receivedProp,
  claimable: claimableProp,
  onClaim,
  flat = false,
}: ReferralEarningPanelProps & {
  summary: ReferralEarningSummaryMock;
  history: ReferralEarningHistoryRow[];
}) {
  const [page, setPage] = useState(1);
  const [claimableInternal, setClaimableInternal] = useState(summary.bonusClaimableThb);
  const [receivedInternal, setReceivedInternal] = useState(summary.bonusReceivedThb);

  const claimable = claimableProp ?? claimableInternal;
  const received = receivedProp ?? receivedInternal;

  const total = history.length;
  const pageSize = REFERRAL_EARNING_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return history.slice(start, start + pageSize);
  }, [history, currentPage, pageSize]);

  /** ข้อมูลประวัติชุดใหม่ → กลับหน้า 1 (ปรับ state ระหว่าง render แทน effect) */
  const [prevHistory, setPrevHistory] = useState(history);
  if (prevHistory !== history) {
    setPrevHistory(history);
    setPage(1);
  }

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const handleClaimBonus = () => {
    if (claimable <= 0) return;
    if (onClaim) {
      onClaim();
      return;
    }
    setReceivedInternal((prev) => prev + claimable);
    setClaimableInternal(0);
  };

  return (
    <div className="referral-earning-panel flex min-h-0 flex-col gap-3">
      {showSummary ? (
        <section
          className="referral-earning-claim surface-solid-stack flex items-center justify-between gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-4 sm:py-4"
          aria-label="โบนัสที่รับได้"
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Menu3DIcon iconId="cashback" size={40} className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text-secondary)] sm:text-[13px]">
                โบนัสที่รับได้
              </p>
              <p className={valueClass("reward", "mt-0.5 text-xl leading-tight sm:text-2xl")}>
                {formatReferralCurrency(claimable)}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={claimable <= 0}
            onClick={handleClaimBonus}
            className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--sm flex h-10 shrink-0 items-center justify-center px-4 text-xs disabled:opacity-45 sm:h-11 sm:px-5 sm:text-sm`}
          >
            รับโบนัส
          </button>
        </section>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <h2
            className={`font-medium text-[var(--text-primary)] ${flat ? "text-base" : "text-sm"}`}
          >
            {sectionTitle}
          </h2>
          <p className={`text-[var(--text-secondary)] ${flat ? "text-sm" : "text-xs"}`}>
            รับสะสม {formatReferralCurrency(received)}
          </p>
        </div>
      )}

      <section
        className={cn(
          "referral-earning-table min-h-0 overflow-hidden",
          flat
            ? "border-t border-[var(--border-subtle)]/50 pt-1"
            : COSMIC_DATA_TABLE_SHELL_OUTLINE,
        )}
      >
        <Table className={cn(COSMIC_DATA_TABLE, flat ? "text-base" : "text-sm")}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className={`px-4 font-medium text-[var(--text-secondary)] sm:px-5 ${
                  flat ? "h-12 text-sm" : "h-11 text-xs"
                }`}
              >
                จำนวนโบนัส
              </TableHead>
              <TableHead
                className={`px-4 text-right font-medium text-[var(--text-secondary)] sm:px-5 ${
                  flat ? "h-12 text-sm" : "h-11 text-xs"
                }`}
              >
                วันที่
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={2}
                  className="px-4 py-10 text-center text-xs text-[var(--text-muted)] sm:px-5"
                >
                  ยังไม่มีประวัติการรับโบนัส
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={cosmicDataTableRowClass(index, flat ? "solid" : "outline")}
                >
                  <TableCell
                    className={valueClass(
                      "reward",
                      `px-4 sm:px-5 ${flat ? "py-4 text-base" : "py-3.5 text-sm"}`,
                    )}
                  >
                    {formatReferralCurrency(row.amountThb)}
                  </TableCell>
                  <TableCell
                    className={`px-4 text-right tabular-nums text-[var(--text-secondary)] sm:px-5 ${
                      flat ? "py-4 text-sm" : "py-3.5 text-xs"
                    }`}
                  >
                    {formatReferralEarningDateTime(row.occurredAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {total > 0 && (
          <div
            className={cn(
              "cosmic-data-table__footer flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
              flat ? "py-4" : "py-3.5",
            )}
          >
            <p className={`text-[var(--text-muted)] ${flat ? "text-sm" : "text-xs"}`}>
              แสดง {rangeStart}–{rangeEnd} จาก {formatReferralRecordCount(total)}
            </p>
            <CosmicDataTablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              aria-label="เปลี่ยนหน้าประวัติโบนัส"
            />
          </div>
        )}
      </section>
    </div>
  );
}

