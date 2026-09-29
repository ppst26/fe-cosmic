"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { VipModalTabId } from "@/app/types/vip";
import {
  OVERLAY_VIP_TAB_KEY,
  parseVipModalTab,
  readOverlayLayer,
} from "@/lib/overlayUrl";
import { vipPageHref } from "@/lib/vipRoutes";

interface VipModalContextValue {
  openVipModal: (tab?: VipModalTabId) => void;
  closeVipModal: () => void;
}

const VipModalContext = createContext<VipModalContextValue | null>(null);

/**
 * นำทางไปหน้า /vip — รองรับลิงก์เก่า ?layer=vip&vipTab=
 */
export function VipModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (readOverlayLayer(searchParams) !== "vip") return;
    const tab = parseVipModalTab(searchParams.get(OVERLAY_VIP_TAB_KEY)) ?? "my-level";
    router.replace(vipPageHref(tab));
  }, [router, searchParams]);

  const openVipModal = useCallback(
    (tab: VipModalTabId = "my-level") => {
      router.push(vipPageHref(tab));
    },
    [router],
  );

  const closeVipModal = useCallback(() => {
    router.back();
  }, [router]);

  const value = useMemo(
    () => ({ openVipModal, closeVipModal }),
    [openVipModal, closeVipModal],
  );

  return <VipModalContext.Provider value={value}>{children}</VipModalContext.Provider>;
}

export function useVipModal(): VipModalContextValue {
  const ctx = useContext(VipModalContext);
  if (!ctx) {
    throw new Error("useVipModal ต้องใช้ภายใน VipModalProvider");
  }
  return ctx;
}
