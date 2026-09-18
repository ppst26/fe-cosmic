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
 * รายการรอบแทงหวยยี่กี 30 นาที (/lottery/yiki-30) — ลิงก์มาจากการ์ด feature ใน LotteryHubContent
 * เหมือน /lottery/yiki-15 ทุกอย่าง ต่างแค่ระยะห่างรอบ (30 นาที) — เลือกรอบแล้วเข้าไปแทงที่ /lottery/yiki-30/[roundId]
 */
export default function Yiki30RoundListPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // สร้างรายการรอบครั้งเดียวตอน mount — คำนวณจากเวลาปัจจุบันฝั่ง client เท่านั้น
  const rounds = useMemo(() => generateYikiRounds(8, 30), []);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="หวยยี่กี 30 นาที" backHref="/lottery" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4 lg:pb-8">
        <YikiRoundList rounds={rounds} basePath="/lottery/yiki-30" />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
