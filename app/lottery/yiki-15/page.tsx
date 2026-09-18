"use client";

import React, { useMemo, useState } from "react";
import { Header } from "../../components/layout/Header";
import { RightMenuDrawer } from "../../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../../components/slots/SlotProvidersHeader";
import { FloatingBottomNav } from "../../components/layout/FloatingBottomNav";
import { YikiRoundList } from "../../components/lottery/yiki/YikiRoundList";
import { BOTTOM_NAV_DATA } from "../../data/lobbyMockData";
import { generateYikiRounds } from "../../data/yikiMockData";

/**
 * รายการรอบแทงหวยยี่กี 15 นาที (/lottery/yiki-15) — ลิงก์มาจากการ์ด feature ใน LotteryHubContent
 * เลือกรอบแล้วเข้าไปแทงที่ /lottery/yiki-15/[roundId]
 */
export default function Yiki15RoundListPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // สร้างรายการรอบครั้งเดียวตอน mount — คำนวณจากเวลาปัจจุบันฝั่ง client เท่านั้น
  const rounds = useMemo(() => generateYikiRounds(), []);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="หวยยี่กี 15 นาที" backHref="/lottery" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4 lg:pb-8">
        <YikiRoundList rounds={rounds} basePath="/lottery/yiki-15" />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
