"use client";

import React, { createContext, useContext, useMemo } from "react";
import { CouponRedeemBottomSheet } from "./CouponRedeemBottomSheet";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

interface CouponRedeemContextValue {
  openCouponRedeem: () => void;
  closeCouponRedeem: () => void;
}

const CouponRedeemContext = createContext<CouponRedeemContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet แลกคูปอง — sync ?layer=coupon
 */
export function CouponRedeemProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, open, close } = useOverlayLayer("coupon");

  const value = useMemo(
    () => ({ openCouponRedeem: open, closeCouponRedeem: close }),
    [open, close],
  );

  return (
    <CouponRedeemContext.Provider value={value}>
      {children}
      <CouponRedeemBottomSheet isOpen={isOpen} onClose={close} />
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
