"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import type { VipModalTabId } from "@/app/types/vip";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { VipPageContent } from "@/app/components/vip/VipPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import { parseVipPageTab, vipPageHref, VIP_PAGE_TAB_QUERY_KEY } from "@/lib/vipRoutes";
import { getIsDesktopViewport } from "@/app/components/hub/useIsDesktop";
import { OVERLAY_HUB_KEY, OVERLAY_LAYER_KEY, OVERLAY_VIP_TAB_KEY } from "@/lib/overlayUrl";

/**
 * หน้า VIP / แร็งค์ — แทน bottom sheet
 */
function VipPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeTab = parseVipPageTab(searchParams.get(VIP_PAGE_TAB_QUERY_KEY));

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  /** Desktop — เปิด hub modal บน lobby แทนหน้าเต็ม */
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (!getIsDesktopViewport()) return;
    const params = new URLSearchParams();
    params.set(OVERLAY_LAYER_KEY, "hub");
    params.set(OVERLAY_HUB_KEY, "vip");
    if (activeTab !== "my-level") params.set(OVERLAY_VIP_TAB_KEY, activeTab);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }, [activeTab, isAuthenticated, isLoading, router]);

  const handleSelectTab = (tab: VipModalTabId) => {
    router.replace(vipPageHref(tab), { scroll: false });
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="VIP" backHref="/" />

      <main className="mobile-standalone-main pt-4">
        <VipPageContent activeTab={activeTab} onSelectTab={handleSelectTab} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}

export default function VipPage() {
  const t = useT("vip");
  return (
    <Suspense
      fallback={
        <div className="mobile-standalone-page mobile-standalone-main py-16 text-center text-sm text-[var(--text-muted)]">
          {t("status.loading")}
        </div>
      }
    >
      <VipPageInner />
    </Suspense>
  );
}
