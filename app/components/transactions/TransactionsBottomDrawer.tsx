"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import type { TransactionKind } from "@/app/types/transaction";
import {
  getTransactionsByKind,
  TRANSACTION_KIND_TABS,
} from "@/app/data/transactionsMockData";
import { TransactionKindTabs } from "./TransactionKindTabs";
import { TransactionList } from "./TransactionList";
import { CloseIcon } from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";

interface TransactionsBottomDrawerProps {
  isOpen: boolean;
  initialKind: TransactionKind;
  onClose: () => void;
}

/**
 * Bottom sheet ประวัติธุรกรรม — tab ฝาก / ถอน เท่านั้น
 * ถูก mount ใน TransactionsProvider
 */
export function TransactionsBottomDrawer({
  isOpen,
  initialKind,
  onClose,
}: TransactionsBottomDrawerProps) {
  const { isAuthenticated } = useAuth();
  const [userKind, setUserKind] = useState<TransactionKind | null>(null);
  const activeKind = userKind ?? initialKind;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setUserKind(null);
      onClose();
    }
  };

  const items = isAuthenticated ? getTransactionsByKind(activeKind) : [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[var(--surface-end)]/85 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[min(92dvh,720px)] flex-col overflow-hidden rounded-t-[20px] bg-[var(--surface-mid)] text-[var(--text-primary)] shadow-[0_-12px_40px_rgba(0,0,0,0.45)] outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom duration-300"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-3 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-hover)]/90 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-selected)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label="ปิดรายการธุรกรรม"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </Dialog.Close>

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-14 sm:px-5">
            <Dialog.Title className="text-2xl font-extrabold">รายการธุรกรรม</Dialog.Title>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">ฝากและถอนของคุณ</p>

            <div className="mt-4 shrink-0">
              <TransactionKindTabs
                tabs={TRANSACTION_KIND_TABS}
                activeKind={activeKind}
                onSelect={setUserKind}
              />
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {!isAuthenticated ? (
                <p className="py-12 text-center text-sm text-[var(--text-muted)]">
                  กรุณาเข้าสู่ระบบเพื่อดูรายการธุรกรรม
                </p>
              ) : (
                <TransactionList items={items} />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
