"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { WithdrawBottomSheet } from "./WithdrawBottomSheet";
import { usePendingTransaction } from "@/app/components/transactions/PendingTransactionProvider";

interface WithdrawContextValue {
  openWithdraw: () => void;
  closeWithdraw: () => void;
}

const WithdrawContext = createContext<WithdrawContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet ถอนเงิน — mount ใน AppProviders
 */
export function WithdrawProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showPendingWithdraw } = usePendingTransaction();

  const openWithdraw = useCallback(() => setIsOpen(true), []);
  const closeWithdraw = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openWithdraw, closeWithdraw }),
    [openWithdraw, closeWithdraw],
  );

  return (
    <WithdrawContext.Provider value={value}>
      {children}
      <WithdrawBottomSheet
        isOpen={isOpen}
        onClose={closeWithdraw}
        onCompleted={(amount) => showPendingWithdraw(amount)}
      />
    </WithdrawContext.Provider>
  );
}

export function useWithdraw(): WithdrawContextValue {
  const ctx = useContext(WithdrawContext);
  if (!ctx) {
    throw new Error("useWithdraw ต้องใช้ภายใน WithdrawProvider");
  }
  return ctx;
}
