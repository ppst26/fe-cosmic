"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { DepositBottomSheet } from "./DepositBottomSheet";
import { usePendingTransaction } from "@/app/components/transactions/PendingTransactionProvider";

interface DepositContextValue {
  openDeposit: () => void;
  closeDeposit: () => void;
}

const DepositContext = createContext<DepositContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet ฝากเงิน — mount ใน AppProviders
 */
export function DepositProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { showPendingDeposit } = usePendingTransaction();

  const openDeposit = useCallback(() => setIsOpen(true), []);
  const closeDeposit = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openDeposit, closeDeposit }),
    [openDeposit, closeDeposit],
  );

  return (
    <DepositContext.Provider value={value}>
      {children}
      <DepositBottomSheet
        isOpen={isOpen}
        onClose={closeDeposit}
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
