"use client";

import React, { createContext, useContext, useMemo } from "react";
import { WithdrawBottomSheet } from "./WithdrawBottomSheet";
import { usePendingTransaction } from "@/app/components/transactions/PendingTransactionProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

interface WithdrawContextValue {
  openWithdraw: () => void;
  closeWithdraw: () => void;
}

const WithdrawContext = createContext<WithdrawContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet ถอนเงิน — mount ใน AppProviders · sync ?layer=withdraw
 */
export function WithdrawProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, open, close } = useOverlayLayer("withdraw");
  const { showPendingWithdraw } = usePendingTransaction();

  const value = useMemo(
    () => ({ openWithdraw: open, closeWithdraw: close }),
    [open, close],
  );

  return (
    <WithdrawContext.Provider value={value}>
      {children}
      <WithdrawBottomSheet
        isOpen={isOpen}
        onClose={close}
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
