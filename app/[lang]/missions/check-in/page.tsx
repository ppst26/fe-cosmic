"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { DailyCheckInPageContent } from "@/app/components/missions/DailyCheckInPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * หน้าเช็คอินรายวัน (/missions/check-in)
 */
export default function DailyCheckInPage() {
  const t = useT("rewards");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title={t("checkIn.title")} backHref="/" />

      <main className="mobile-standalone-main pt-2">
        <DailyCheckInPageContent />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
