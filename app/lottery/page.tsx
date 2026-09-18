"use client";

import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { RightMenuDrawer } from "../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../components/slots/SlotProvidersHeader";
import { FloatingBottomNav } from "../components/layout/FloatingBottomNav";
import { LotteryHubContent } from "../components/lottery/LotteryHubContent";
import { BOTTOM_NAV_DATA } from "../data/lobbyMockData";

/**
 * หน้าแทงหวย (/lottery) — feature · กริดประเภท · ผลหวยล่าสุด
 */
export default function LotteryPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="หวย" backHref="/" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4 lg:pb-8">
        <LotteryHubContent showPageHeading={false} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
