"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { GemsStorePageContent } from "@/app/components/gems-store/GemsStorePageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้าร้านค้า Gems (/gems-store)
 */
export default function GemsStorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="ร้านค้า Gems" backHref="/" />

      <main className="mobile-standalone-main pt-4">
        <GemsStorePageContent />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
