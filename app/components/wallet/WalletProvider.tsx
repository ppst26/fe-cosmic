"use client";

import React, { createContext, useContext } from "react";
import { fetchWalletBalance, type WalletBalance } from "@/lib/api/profile";
import { useScopedResource, type ScopedResource } from "@/app/hooks/useScopedResource";
import { useAuth } from "@/app/components/auth/AuthProvider";

const WalletContext = createContext<ScopedResource<WalletBalance> | null>(null);

/**
 * ยอดเครดิตหลักของผู้ใช้ — แหล่งเดียวสำหรับ Header · เมนู · reward hub
 * เรียก refresh() หลัง mutation ที่กระทบยอด (ฝาก · ถอน · คูปอง · รับ cashback) · ต้องอยู่ใต้ AuthProvider
 */
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const wallet = useScopedResource<WalletBalance>(user?.id ?? null, fetchWalletBalance);
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}

/** อ่านยอดเครดิต — data?.amount · status · refresh() */
export function useWallet(): ScopedResource<WalletBalance> {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet ต้องใช้ภายใน WalletProvider");
  return ctx;
}
