"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  buildPendingDepositPayload,
  buildPendingWithdrawPayload,
} from "@/app/data/pendingTransactionMockData";
import dynamic from "next/dynamic";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** dialog ธุรกรรมค้างโหลดแยก chunk ตอนมี payload ครั้งแรก — ไม่ติดไป bundle แรกของทุกหน้า */
const PendingTransactionDialog = dynamic(() =>
  import("./PendingTransactionDialog").then((m) => m.PendingTransactionDialog),
);
import type { PendingTransactionPayload } from "@/app/types/transaction";

interface PendingTransactionContextValue {
  showPendingDeposit: (amount: number) => void;
  showPendingWithdraw: (amount: number) => void;
}

const PendingTransactionContext = createContext<PendingTransactionContextValue | null>(null);

/**
 * เปิด dialog รายการรอดำเนินการ — เรียกจาก flow ฝาก/ถอน
 * TODO(api): ใช้เลขอ้างอิง / เวลา / บัญชีจาก response ของ submitDeposit / submitWithdraw แทน builder mock
 */
export function PendingTransactionProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<PendingTransactionPayload | null>(null);

  const showPendingDeposit = useCallback((amount: number) => {
    setPayload(buildPendingDepositPayload(amount));
  }, []);

  const showPendingWithdraw = useCallback((amount: number) => {
    setPayload(buildPendingWithdrawPayload(amount));
  }, []);

  const closePending = useCallback(() => setPayload(null), []);

  const value = useMemo(
    () => ({ showPendingDeposit, showPendingWithdraw }),
    [showPendingDeposit, showPendingWithdraw],
  );

  const dialogMounted = useLazyOverlayMount(payload !== null);

  return (
    <PendingTransactionContext.Provider value={value}>
      {children}
      {dialogMounted ? (
        <PendingTransactionDialog payload={payload} onClose={closePending} />
      ) : null}
    </PendingTransactionContext.Provider>
  );
}

export function usePendingTransaction(): PendingTransactionContextValue {
  const ctx = useContext(PendingTransactionContext);
  if (!ctx) {
    throw new Error("usePendingTransaction ต้องใช้ภายใน PendingTransactionProvider");
  }
  return ctx;
}
