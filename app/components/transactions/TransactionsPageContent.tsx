"use client";

import React from "react";
import type { TransactionKind } from "@/app/types/transaction";
import {
  getTransactionsByKind,
  TRANSACTION_KIND_TABS,
} from "@/app/data/transactionsMockData";
import { TransactionKindTabs } from "./TransactionKindTabs";
import { TransactionList } from "./TransactionList";

interface TransactionsPageContentProps {
  activeKind: TransactionKind;
  onSelectKind: (kind: TransactionKind) => void;
  isAuthenticated: boolean;
}

/**
 * เนื้อหาหน้ารายการธุรกรรม — ใช้ใน /transactions
 */
export function TransactionsPageContent({
  activeKind,
  onSelectKind,
  isAuthenticated,
}: TransactionsPageContentProps) {
  const items = isAuthenticated ? getTransactionsByKind(activeKind) : [];

  return (
    <>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">ฝากและถอนของคุณ</p>

      <div className="mt-4">
        <TransactionKindTabs
          tabs={TRANSACTION_KIND_TABS}
          activeKind={activeKind}
          onSelect={onSelectKind}
        />
      </div>

      <div className="mt-4">
        {!isAuthenticated ? (
          <p className="py-12 text-center text-sm text-[var(--text-muted)]">
            กรุณาเข้าสู่ระบบเพื่อดูรายการธุรกรรม
          </p>
        ) : (
          <TransactionList items={items} />
        )}
      </div>
    </>
  );
}
