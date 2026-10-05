"use client";

import React, { useEffect, useState } from "react";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "@/app/components/auth/AuthProvider";
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
  const [refCode, setRefCode] = useState(fetchReferralOverview().refCode);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    void fetchProfile().then((profile) => {
      if (cancelled || !profile?.memberId) return;
      setRefCode(profile.memberId);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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
