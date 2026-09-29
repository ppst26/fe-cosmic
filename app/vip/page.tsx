"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { VipModalTabId } from "@/app/types/vip";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { VipPageContent } from "@/app/components/vip/VipPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import { parseVipPageTab, vipPageHref, VIP_PAGE_TAB_QUERY_KEY } from "@/lib/vipRoutes";

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

      <SlotProvidersHeader
        title="VIP"
        subtitle="ระดับ แร็งค์ และสิทธิประโยชน์"
        backHref="/"
      />

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
  return (
    <Suspense
      fallback={
        <div className="mobile-standalone-page mobile-standalone-main py-16 text-center text-sm text-[var(--text-muted)]">
          กำลังโหลด...
        </div>
      }
    >
      <VipPageInner />
    </Suspense>
  );
}
