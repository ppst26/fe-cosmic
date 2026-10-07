"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { DepositBottomSheet } from "./DepositBottomSheet";
import { usePendingTransaction } from "@/app/components/transactions/PendingTransactionProvider";
import { useAuth } from "@/app/components/auth/AuthProvider";
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
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useOverlayLayer("deposit");
  const { open: openLogin } = useOverlayLayer("login");
  const { showPendingDeposit } = usePendingTransaction();

  const openDeposit = useCallback(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    open();
  }, [isAuthenticated, isLoading, open, openLogin]);

  /** ?layer=deposit โดยไม่ล็อกอิน → ปิดฝากแล้วเปิด login */
  useEffect(() => {
    if (!isOpen || isLoading) return;
    if (!isAuthenticated) {
      close();
      openLogin();
    }
  }, [close, isAuthenticated, isLoading, isOpen, openLogin]);

  const value = useMemo(
    () => ({ openDeposit, closeDeposit: close }),
    [close, openDeposit],
  );

  const sheetOpen = isOpen && isAuthenticated;

  return (
    <DepositContext.Provider value={value}>
      {children}
      <DepositBottomSheet
        isOpen={sheetOpen}
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
