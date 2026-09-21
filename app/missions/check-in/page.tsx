"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { DailyCheckInPageContent } from "@/app/components/missions/DailyCheckInPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้าเช็คอินรายวัน (/missions/check-in)
 */
export default function DailyCheckInPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-standalone-page">
      <Header />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="เช็คอินรายวัน" backHref="/" />

      <main className="mobile-standalone-main pt-4">
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
