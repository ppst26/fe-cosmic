"use client";

import React from "react";
import { CosmicDataTablePagination } from "../ui/CosmicDataTablePagination";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * เลขหน้าตารางธุรกรรม — ใช้กับแท็บเดิมพัน
 */
export function TransactionHistoryPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const t = useT("transactions");
  return (
    <CosmicDataTablePagination
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      size="sm"
      className="tx-history-pagination justify-center pt-2"
      aria-label={t("paginationAria")}
    />
  );
}
