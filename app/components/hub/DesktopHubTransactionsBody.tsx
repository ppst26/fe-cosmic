"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setActiveKind(initialKind);
  }, [initialKind]);

  return (
    <TransactionsPageContent
      embedded
      activeKind={activeKind}
      onSelectKind={setActiveKind}
      isAuthenticated={isAuthenticated}
    />
  );
}
