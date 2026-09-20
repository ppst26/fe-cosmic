"use client";

import React, { createContext, useContext, useMemo } from "react";
import { DepositBottomSheet } from "./DepositBottomSheet";
import { usePendingTransaction } from "@/app/components/transactions/PendingTransactionProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

interface DepositContextValue {
  openDeposit: () => void;
  closeDeposit: () => void;
}

const DepositContext = createContext<DepositContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet ฝากเงิน — mount ใน AppProviders · sync ?layer=deposit
 */
export function DepositProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, open, close } = useOverlayLayer("deposit");
  const { showPendingDeposit } = usePendingTransaction();

  const value = useMemo(
    () => ({ openDeposit: open, closeDeposit: close }),
    [open, close],
  );

  return (
    <DepositContext.Provider value={value}>
      {children}
      <DepositBottomSheet
        isOpen={isOpen}
        onClose={close}
        onCompleted={(amount) => showPendingDeposit(amount)}
      />
    </DepositContext.Provider>
  );
}

export function useDeposit(): DepositContextValue {
  const ctx = useContext(DepositContext);
  if (!ctx) {
    throw new Error("useDeposit ต้องใช้ภายใน DepositProvider");
  }
  return ctx;
}
