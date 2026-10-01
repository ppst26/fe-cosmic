"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUrlSearchParams } from "@/app/hooks/useUrlSearchParams";
import type { VipModalTabId } from "@/app/types/vip";
import {
  OVERLAY_VIP_TAB_KEY,
  parseVipModalTab,
  readOverlayLayer,
} from "@/lib/overlayUrl";
import { vipPageHref } from "@/lib/vipRoutes";
import { useDesktopHubModal } from "@/app/components/hub/DesktopHubModalProvider";
import { getIsDesktopViewport } from "@/app/components/hub/useIsDesktop";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

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
  const searchParams = useUrlSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { open: openLogin } = useOverlayLayer("login");
  const { openHub } = useDesktopHubModal();

  useEffect(() => {
    if (readOverlayLayer(searchParams) !== "vip") return;
    const tab = parseVipModalTab(searchParams.get(OVERLAY_VIP_TAB_KEY)) ?? "my-level";
    if (getIsDesktopViewport()) {
      openHub("vip", tab === "my-level" ? undefined : { vipTab: tab });
      return;
    }
    router.replace(vipPageHref(tab));
  }, [openHub, router, searchParams]);

  const openVipModal = useCallback(
    (tab: VipModalTabId = "my-level") => {
      if (!isLoading && !isAuthenticated) {
        openLogin();
        return;
      }
      if (getIsDesktopViewport()) {
        openHub("vip", tab === "my-level" ? undefined : { vipTab: tab });
        return;
      }
      router.push(vipPageHref(tab));
    },
    [isAuthenticated, isLoading, openHub, openLogin, router],
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
