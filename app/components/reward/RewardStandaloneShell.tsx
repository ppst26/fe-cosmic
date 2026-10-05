"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/layout/Header";
import { RightMenuDrawer } from "@/app/components/layout/RightMenuDrawer";
import { FloatingBottomNav } from "@/app/components/layout/FloatingBottomNav";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { BOTTOM_NAV_DATA } from "@/app/data/lobbyMockData";

/**
 * โครงหน้า standalone มือถือสำหรับฟีเจอร์รางวัล — ใช้ทุก route ใต้ /reward
 */
export function RewardStandaloneShell({
  title,
  backHref = "/reward",
  children,
}: {
  title: string;
  backHref?: string;
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-standalone-page">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SlotProvidersHeader title={title} backHref={backHref} />
      <main className="mobile-standalone-main pt-4">{children}</main>
      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
