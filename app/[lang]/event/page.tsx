"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { ActivitiesHubPageContent } from "@/app/components/activities/ActivitiesHubPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้ากิจกรรม (/event) — แยกจากโปรโมชั่น
 */
export default function EventPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="กิจกรรม" backHref="/" />

      <main className="mobile-standalone-main pt-4">
        <ActivitiesHubPageContent />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
