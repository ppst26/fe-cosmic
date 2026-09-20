"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import type { VipModalTabId } from "@/app/types/vip";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { OVERLAY_VIP_TAB_KEY } from "@/lib/overlayUrl";
import { VipModal } from "./VipModal";

interface VipModalContextValue {
  openVipModal: (tab?: VipModalTabId) => void;
  closeVipModal: () => void;
}

const VipModalContext = createContext<VipModalContextValue | null>(null);

/**
 * เปิด/ปิด modal VIP — mount ใน AppProviders · sync ?layer=vip&vipTab=
 */
export function VipModalProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, open, close } = useOverlayLayer("vip");

  const openVipModal = useCallback(
    (tab: VipModalTabId = "my-level") => {
      open({ [OVERLAY_VIP_TAB_KEY]: tab });
    },
    [open],
  );

  const value = useMemo(
    () => ({ openVipModal, closeVipModal: close }),
    [openVipModal, close],
  );

  return (
    <VipModalContext.Provider value={value}>
      {children}
      <VipModal isOpen={isOpen} onClose={close} />
    </VipModalContext.Provider>
  );
}

export function useVipModal(): VipModalContextValue {
  const ctx = useContext(VipModalContext);
  if (!ctx) {
    throw new Error("useVipModal ต้องใช้ภายใน VipModalProvider");
  }
  return ctx;
}
