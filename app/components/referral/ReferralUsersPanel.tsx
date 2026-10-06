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
import { CosmicDataTablePagination } from "../ui/CosmicDataTablePagination";
import { cosmicDataTableRowClass } from "../ui/cosmicDataTableRowClass";

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <h2
          id="referral-users-title"
          className="text-sm font-medium text-[var(--text-primary)] sm:text-base"
        >
          เพื่อนที่แนะนำ
        </h2>
        <span className="cosmic-inset-card rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
          {formatReferralCount(total)}
        </span>
      </div>

      <section className="cosmic-data-table-shell" aria-labelledby="referral-users-title">
        <Table className="cosmic-data-table text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[var(--text-secondary)] sm:px-5">
                Username
              </TableHead>
              <TableHead className="h-11 px-4 text-right text-xs font-medium text-[var(--text-secondary)] sm:px-5">
                สมัครเมื่อ
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
                  ยังไม่มีเพื่อนที่สมัครผ่านลิงก์ของคุณ
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, index) => (
                <TableRow key={row.id} className={cosmicDataTableRowClass(index)}>
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
          <div className="cosmic-data-table__footer flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[var(--text-muted)]">
              แสดง {rangeStart}–{rangeEnd} จาก {formatReferralCount(total)}
            </p>
            <CosmicDataTablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              aria-label="เปลี่ยนหน้ารายชื่อเพื่อน"
            />
          </div>
        )}
      </section>
    </div>
  );
}
