"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { LuckyWheelPageContent } from "@/app/components/wheel/LuckyWheelPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้าวงล้อจักรวาล (/wheel)
 */
export default function LuckyWheelPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="cosmic-bg-shell text-[var(--text-primary)]">
      <Header />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="กิจกรรม" backHref="/promotions" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4">
        <LuckyWheelPageContent />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
