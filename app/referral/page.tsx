"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useProfile } from "@/app/hooks/api/account";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { ReferralPageContent } from "@/app/components/referral/ReferralPageContent";
import { fetchReferralOverview } from "@/lib/api/referral";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้าแนะนำเพื่อน (/referral)
 */
export default function ReferralPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: profile } = useProfile();
  /** รหัสชวนเพื่อน = memberId ของผู้ใช้ที่ login · ยังไม่ login ใช้ค่าจาก referral overview */
  const refCode =
    (isAuthenticated ? profile?.memberId : undefined) ?? fetchReferralOverview().refCode;

  if (isLoading) {
    return null;
  }

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="แนะนำเพื่อน" backHref="/" />

      <main className="mobile-standalone-main pt-4">
        <ReferralPageContent refCode={refCode} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
