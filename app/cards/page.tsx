"use client";

import React, { useState } from "react";
import { Header } from "../components/layout/Header";
import { RightMenuDrawer } from "../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../components/slots/SlotProvidersHeader";
import { FloatingBottomNav } from "../components/layout/FloatingBottomNav";
import { BOTTOM_NAV_DATA } from "../data/lobbyMockData";

/**
 * หน้ารวมเกมไพ่ (/cards) — placeholder รอค่าย/รายการจริง
 */
export default function CardsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="เกมไพ่" backHref="/" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4 lg:pb-8">
        <section
          className="rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
          aria-live="polite"
        >
          กำลังเตรียมเกมไพ่ในหมวดนี้ — กลับมาใหม่เร็ว ๆ นี้นะ
        </section>
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
