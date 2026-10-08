"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { usePendingTransaction } from "@/app/components/transactions/PendingTransactionProvider";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** sheet ถอนเงินโหลดแยก chunk ตอนเปิดครั้งแรก — ไม่ติดไป bundle แรกของทุกหน้า */
const WithdrawBottomSheet = dynamic(() =>
  import("./WithdrawBottomSheet").then((m) => m.WithdrawBottomSheet),
);

interface WithdrawContextValue {
  openWithdraw: () => void;
  closeWithdraw: () => void;
}

const WithdrawContext = createContext<WithdrawContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet ถอนเงิน — mount ใน AppProviders · sync ?layer=withdraw
 */
export function WithdrawProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useOverlayLayer("withdraw");
  const { open: openLogin } = useOverlayLayer("login");
  const { showPendingWithdraw } = usePendingTransaction();

  const openWithdraw = useCallback(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    open();
  }, [isAuthenticated, isLoading, open, openLogin]);

  /** ?layer=withdraw โดยไม่ล็อกอิน → ปิดถอนแล้วเปิด login */
  useEffect(() => {
    if (!isOpen || isLoading) return;
    if (!isAuthenticated) {
      close();
      openLogin();
    }
  }, [close, isAuthenticated, isLoading, isOpen, openLogin]);

  const value = useMemo(
    () => ({ openWithdraw, closeWithdraw: close }),
    [close, openWithdraw],
  );

  const sheetOpen = isOpen && isAuthenticated;
  const sheetMounted = useLazyOverlayMount(sheetOpen);

  return (
    <WithdrawContext.Provider value={value}>
      {children}
      {sheetMounted ? (
        <WithdrawBottomSheet
          isOpen={sheetOpen}
          onClose={close}
          onCompleted={(amount) => showPendingWithdraw(amount)}
        />
      ) : null}
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
