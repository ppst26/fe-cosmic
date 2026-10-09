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
import { useReferralUsers } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { CosmicDataTablePagination } from "../ui/CosmicDataTablePagination";
import {
  COSMIC_DATA_TABLE,
  COSMIC_DATA_TABLE_SHELL_OUTLINE,
} from "../ui/cosmicDataTableClasses";
import { cosmicDataTableRowClass } from "../ui/cosmicDataTableRowClass";
import { REFERRAL_USERS_PAGE_SIZE } from "@/lib/uiConstants";
import { formatReferralRegisteredAt } from "@/lib/format";
import type { ReferralUserRow } from "@/app/types/referral";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";

/**
 * แท็บ Referral users — ตารางเพื่อนที่แนะนำ + pagination (10 แถว/หน้า)
 * ใช้ใน ReferralPageContent
 */
export function ReferralUsersPanel({ users: usersProp }: { users?: ReferralUserRow[] }) {
  const usersResource = useReferralUsers();
  const t = useT("referral");
  if (usersProp) return <ReferralUsersTable users={usersProp} />;
  return (
    <ResourceGate resource={usersResource} loadingLabel={t("status.usersLoading")} errorTitle={t("status.usersError")}>
      {(users) => <ReferralUsersTable users={users} />}
    </ResourceGate>
  );
}

function ReferralUsersTable({ users }: { users: ReferralUserRow[] }) {
  const t = useT("referral");
  const fmt = useFormat();
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
          {t("tabs.users")}
        </h2>
        <span className="cosmic-inset-card rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
          {fmt.people(total)}
        </span>
      </div>

      <section className={COSMIC_DATA_TABLE_SHELL_OUTLINE} aria-labelledby="referral-users-title">
        <Table className={`${COSMIC_DATA_TABLE} text-sm`}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium text-[var(--text-secondary)] sm:px-5">
                Username
              </TableHead>
              <TableHead className="h-11 px-4 text-right text-xs font-medium text-[var(--text-secondary)] sm:px-5">
                {t("users.registeredAt")}
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
                  {t("users.empty")}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, index) => (
                <TableRow key={row.id} className={cosmicDataTableRowClass(index, "outline")}>
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
              {t("pagination.showing", { start: rangeStart, end: rangeEnd, total: fmt.people(total) })}
            </p>
            <CosmicDataTablePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              aria-label={t("users.paginationAriaLabel")}
            />
          </div>
        )}
      </section>
    </div>
  );
}
