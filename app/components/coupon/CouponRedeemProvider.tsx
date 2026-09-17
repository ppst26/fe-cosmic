"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CouponRedeemBottomSheet } from "./CouponRedeemBottomSheet";

interface CouponRedeemContextValue {
  openCouponRedeem: () => void;
  closeCouponRedeem: () => void;
}

const CouponRedeemContext = createContext<CouponRedeemContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet แลกคูปอง — mount ใน AppProviders
 */
export function CouponRedeemProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCouponRedeem = useCallback(() => setIsOpen(true), []);
  const closeCouponRedeem = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openCouponRedeem, closeCouponRedeem }),
    [openCouponRedeem, closeCouponRedeem],
  );

  return (
    <CouponRedeemContext.Provider value={value}>
      {children}
      <CouponRedeemBottomSheet isOpen={isOpen} onClose={closeCouponRedeem} />
    </CouponRedeemContext.Provider>
  );
}

export function useCouponRedeem(): CouponRedeemContextValue {
  const ctx = useContext(CouponRedeemContext);
  if (!ctx) {
    throw new Error("useCouponRedeem ต้องใช้ภายใน CouponRedeemProvider");
  }
  return ctx;
}
