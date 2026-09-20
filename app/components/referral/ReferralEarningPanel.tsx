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
  REFERRAL_EARNING_HISTORY_MOCK,
  REFERRAL_EARNING_PAGE_SIZE,
  REFERRAL_EARNING_SUMMARY_MOCK,
  formatReferralCurrency,
  formatReferralEarningDateTime,
  formatReferralRecordCount,
  type ReferralEarningHistoryRow,
  type ReferralEarningSummaryMock,
} from "@/app/data/referralMockData";
import { BonusNavIcon } from "../ui/Icons";
import {
  COSMIC_BTN_PRIMARY,
  COSMIC_PANEL_GLASS,
  COSMIC_PANEL_GLASS_ICON,
} from "../ui/cosmicButtonClasses";

/**
 * แท็บ Earning — สรุปโบนัส + ประวัติรับโบนัส (10 แถว/หน้า)
 * ใช้ใน ReferralPageContent
 */
export function ReferralEarningPanel({
  summary = REFERRAL_EARNING_SUMMARY_MOCK,
  history = REFERRAL_EARNING_HISTORY_MOCK,
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

  React.useEffect(() => {
    setPage(1);
  }, [history]);

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

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
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-[var(--text-primary)]">{sectionTitle}</h2>
          <p className="text-[11px] text-[var(--text-muted)]">
            รับสะสม {formatReferralCurrency(received)}
          </p>
        </div>
      )}

      <section
        className={
          flat
            ? "referral-earning-table min-h-0 overflow-hidden border-t border-[var(--border-subtle)]/50 pt-1"
            : `${COSMIC_PANEL_GLASS} min-h-0 overflow-hidden`
        }
      >
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-[var(--border-subtle)]/40 hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[var(--text-muted)] sm:px-5">
                จำนวนโบนัส
              </TableHead>
              <TableHead className="h-11 px-4 text-right text-xs font-medium text-[var(--text-muted)] sm:px-5">
                วันที่
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow className="border-[var(--border-subtle)]/30 hover:bg-transparent">
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
                  className={`border-[var(--border-subtle)]/30 hover:bg-[var(--surface-hover)]/40 ${
                    index % 2 === 1 ? "bg-[var(--surface-mid)]/45" : "bg-transparent"
                  }`}
                >
                  <TableCell className="px-4 py-3.5 text-sm font-medium tabular-nums text-[var(--text-primary)] sm:px-5">
                    {formatReferralCurrency(row.amountThb)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right text-xs tabular-nums text-[var(--text-secondary)] sm:px-5">
                    {formatReferralEarningDateTime(row.occurredAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {total > 0 && (
          <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[var(--text-muted)]">
              แสดง {rangeStart}–{rangeEnd} จาก {formatReferralRecordCount(total)}
            </p>
            <nav className="flex items-center gap-1.5" aria-label="เปลี่ยนหน้าประวัติโบนัส">
              <PaginationButton
                label="หน้าก่อน"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </PaginationButton>
              {pageNumbers.map((num) => (
                <PaginationButton
                  key={num}
                  label={`หน้า ${num}`}
                  active={num === currentPage}
                  onClick={() => setPage(num)}
                >
                  {num}
                </PaginationButton>
              ))}
              <PaginationButton
                label="หน้าถัดไป"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </PaginationButton>
            </nav>
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
    <div className={`${COSMIC_PANEL_GLASS} flex items-center gap-3 px-4 py-3.5 sm:gap-4`}>
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
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)]/80 text-[9px] font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-active)] hover:text-[var(--text-secondary)]"
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
