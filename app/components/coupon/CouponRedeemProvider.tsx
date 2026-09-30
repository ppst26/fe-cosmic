"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { CouponRedeemBottomSheet } from "./CouponRedeemBottomSheet";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useAuth } from "@/app/components/auth/AuthProvider";

interface CouponRedeemContextValue {
  openCouponRedeem: () => void;
  closeCouponRedeem: () => void;
}

const CouponRedeemContext = createContext<CouponRedeemContextValue | null>(null);

/**
 * เปิด/ปิด bottom sheet แลกคูปอง — sync ?layer=coupon
 */
export function CouponRedeemProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen, open, close } = useOverlayLayer("coupon");
  const { open: openLogin } = useOverlayLayer("login");

  const openCouponRedeem = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin();
      return;
    }
    open();
  }, [isAuthenticated, isLoading, open, openLogin]);

  const value = useMemo(
    () => ({ openCouponRedeem, closeCouponRedeem: close }),
    [close, openCouponRedeem],
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
