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
  REFERRAL_USERS_PAGE_SIZE,
  formatReferralCount,
  formatReferralRegisteredAt,
  type ReferralUserRow,
} from "@/app/data/referralMockData";
import { fetchReferralUsers } from "@/lib/api/referral";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";

/**
 * แท็บ Referral users — ตารางเพื่อนที่แนะนำ + pagination (10 แถว/หน้า)
 * ใช้ใน ReferralPageContent
 */
export function ReferralUsersPanel({ users = fetchReferralUsers() }: { users?: ReferralUserRow[] }) {
  const [page, setPage] = useState(1);
  const total = users.length;
  const pageSize = REFERRAL_USERS_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <h2
          id="referral-users-title"
          className="text-sm font-medium text-[var(--text-primary)] sm:text-base"
        >
          เพื่อนที่แนะนำ
        </h2>
        <span className="glass-card--soft rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
          {formatReferralCount(total)}
        </span>
      </div>

      <section className={`${COSMIC_PANEL_GLASS} overflow-hidden`} aria-labelledby="referral-users-title">
        <Table className="text-sm">
        <TableHeader>
          <TableRow className="border-[var(--border-subtle)]/40 hover:bg-transparent">
            <TableHead className="h-11 px-4 text-xs font-medium text-[var(--text-muted)] sm:px-5">
              Username
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-medium text-[var(--text-muted)] sm:px-5">
              สมัครเมื่อ
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
                ยังไม่มีเพื่อนที่สมัครผ่านลิงก์ของคุณ
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
                <TableCell className="px-4 py-3.5 font-medium text-[var(--text-primary)] sm:px-5">
                  {row.username}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right text-xs tabular-nums text-[var(--text-secondary)] sm:px-5">
                  {formatReferralRegisteredAt(row.registeredAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {total > 0 && (
        <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-[var(--text-muted)]">
            แสดง {rangeStart}–{rangeEnd} จาก {formatReferralCount(total)}
          </p>
          <nav className="flex items-center gap-1.5" aria-label="เปลี่ยนหน้ารายชื่อเพื่อน">
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
