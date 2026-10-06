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
  type ReferralEarningHistoryRow,
  type ReferralEarningSummaryMock,
} from "@/app/data/referralMockData";
import { fetchReferralEarnings } from "@/lib/api/referral";
import { BonusNavIcon } from "../ui/Icons";
import {
  COSMIC_BTN_PRIMARY,
  COSMIC_PANEL_SOLID,
  COSMIC_PANEL_GLASS_ICON,
} from "../ui/cosmicButtonClasses";
import { CosmicDataTablePagination } from "../ui/CosmicDataTablePagination";
import { cosmicDataTableRowClass } from "../ui/cosmicDataTableRowClass";
import { cn } from "@/lib/utils";
import { REFERRAL_EARNING_PAGE_SIZE } from "@/lib/uiConstants";
import {
  formatReferralCurrency,
  formatReferralEarningDateTime,
  formatReferralRecordCount,
} from "@/lib/format";

/**
 * แท็บ Earning — สรุปโบนัส + ประวัติรับโบนัส (10 แถว/หน้า)
 * ใช้ใน ReferralPageContent
 */
export function ReferralEarningPanel({
  summary = fetchReferralEarnings().summary,
  history = fetchReferralEarnings().history,
  showSummary = true,
  sectionTitle = "ประวัติรับโบนัส",
  received: receivedProp,
  claimable: claimableProp,
  onClaim,
  flat = false,
}: {
  summary?: ReferralEarningSummaryMock;
  history?: ReferralEarningHistoryRow[];
  showSummary?: boolean;
  sectionTitle?: string;
  received?: number;
  claimable?: number;
  onClaim?: () => void;
  /** desktop hub — ตารางไม่ห่อการ์ดทึบ */
  flat?: boolean;
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
      <div className="flex flex-col gap-2.5">
        <EarningSummaryCard
          icon={<WalletCheckIcon className="h-7 w-7 text-[var(--icon-active)]" />}
          label="โบนัสที่รับแล้ว"
          hint="ยอดโบนัสที่คุณกดรับเข้ากระเป๋าแล้ว"
          value={formatReferralCurrency(received)}
          valueClassName="text-[var(--text-primary)]"
        />
        <EarningSummaryCard
          icon={<BonusNavIcon className="h-7 w-7 text-[var(--icon-active)]" />}
          label="โบนัสที่รับได้"
          hint="ยอดที่พร้อมกดรับเข้ากระเป๋า"
          value={formatReferralCurrency(claimable)}
          valueClassName="text-[var(--text-primary)]"
          trailing={
            <button
              type="button"
              disabled={claimable <= 0}
              onClick={handleClaimBonus}
              className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--sm shrink-0 px-4 py-2.5 text-xs disabled:opacity-45 sm:text-sm`}
            >
              รับโบนัส
            </button>
          }
        />
      </div>
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
            : "cosmic-data-table-shell",
        )}
      >
        <Table className={cn("cosmic-data-table", flat ? "text-base" : "text-sm")}>
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
                <TableRow key={row.id} className={cosmicDataTableRowClass(index)}>
                  <TableCell
                    className={`px-4 font-medium tabular-nums text-[var(--text-primary)] sm:px-5 ${
                      flat ? "py-4 text-base" : "py-3.5 text-sm"
                    }`}
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

function EarningSummaryCard({
  icon,
  label,
  hint,
  value,
  valueClassName,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  value: string;
  valueClassName: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className={`${COSMIC_PANEL_SOLID} flex items-center gap-3 px-4 py-3.5 sm:gap-4`}>
      <div className={`${COSMIC_PANEL_GLASS_ICON} !h-12 !w-12`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-[var(--text-secondary)] sm:text-sm">{label}</p>
          <InfoHintButton label={hint} />
        </div>
        <p className={`mt-0.5 text-lg font-medium tabular-nums sm:text-xl ${valueClassName}`}>
          {value}
        </p>
      </div>
      {trailing}
    </div>
  );
}

function InfoHintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)]/80 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-active)] hover:text-[var(--text-secondary)]"
    >
      i
    </button>
  );
}

function WalletCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 8V6a2 2 0 0 1 2-2h12v14H6a2 2 0 0 1-2-2v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 6h14v3H8a2 2 0 0 0-2 2v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m9 14 1.5 1.5L13 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

