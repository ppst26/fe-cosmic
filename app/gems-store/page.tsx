"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { GemsStorePageContent } from "@/app/components/gems-store/GemsStorePageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้าร้านค้า Gems (/gems-store)
 */
export default function GemsStorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4">
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
