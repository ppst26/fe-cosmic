"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { PromotionsHubPageContent } from "@/app/components/promotions/PromotionsHubPageContent";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * หน้าโปรโมชั่นและกิจกรรม (/promotions)
 */
export default function PromotionsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />

      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4">
        <PromotionsHubPageContent />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
