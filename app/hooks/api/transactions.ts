"use client";

import { fetchTransactions } from "@/lib/api/transactions";
import type { TransactionKind } from "@/app/types/transaction";
import { useApi } from "@/app/hooks/useApi";

/** รายการธุรกรรม — key แยกตามประเภท + ช่วงวันที่ (ใช้ใน TransactionsPageContent) */
export function useTransactions(kind: TransactionKind, from: Date, to: Date) {
  return useApi(
    ["transactions", kind, from.toISOString(), to.toISOString()],
    () => fetchTransactions({ kind, from, to }),
    { auth: true },
  );
}
