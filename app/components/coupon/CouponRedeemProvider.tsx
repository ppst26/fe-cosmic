"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** sheet แลกคูปองโหลดแยก chunk ตอนเปิดครั้งแรก — ไม่ติดไป bundle แรกของทุกหน้า */
const CouponRedeemBottomSheet = dynamic(() =>
  import("./CouponRedeemBottomSheet").then((m) => m.CouponRedeemBottomSheet),
);

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

  const sheetMounted = useLazyOverlayMount(isOpen);

  return (
    <CouponRedeemContext.Provider value={value}>
      {children}
      {sheetMounted ? <CouponRedeemBottomSheet isOpen={isOpen} onClose={close} /> : null}
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
