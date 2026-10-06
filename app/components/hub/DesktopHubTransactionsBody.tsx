"use client";

import React, { useState } from "react";
import type { TransactionKind } from "@/app/types/transaction";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { TransactionsPageContent } from "@/app/components/transactions/TransactionsPageContent";

/**
 * เนื้อหา hub ธุรกรรม — state แท็บฝาก/ถอนภายใน modal
 */
export function DesktopHubTransactionsBody({
  initialKind = "deposit",
}: {
  initialKind?: TransactionKind;
}) {
  const { isAuthenticated } = useAuth();
  const [activeKind, setActiveKind] = useState<TransactionKind>(initialKind);

  /** เปิดจากลิงก์อื่น (เช่น ?kind=withdraw) ขณะ modal เปิดอยู่ — sync แท็บระหว่าง render */
  const [prevInitialKind, setPrevInitialKind] = useState(initialKind);
  if (prevInitialKind !== initialKind) {
    setPrevInitialKind(initialKind);
    setActiveKind(initialKind);
  }

  return (
    <TransactionsPageContent
      activeKind={activeKind}
      onSelectKind={setActiveKind}
      isAuthenticated={isAuthenticated}
    />
  );
}
