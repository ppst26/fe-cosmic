"use client";

import React, { useState } from "react";
import { Header } from "../../components/layout/Header";
import { RightMenuDrawer } from "../../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../../components/slots/SlotProvidersHeader";
import { FloatingBottomNav } from "../../components/layout/FloatingBottomNav";
import { ThaiLottoBetBoard } from "../../components/lottery/thai/ThaiLottoBetBoard";
import { BOTTOM_NAV_DATA } from "../../data/lobbyMockData";
import {
  THAI_LOTTO_BET_TYPES,
  THAI_LOTTO_CURRENT_DRAW,
  THAI_LOTTO_GROUPS,
  THAI_LOTTO_LAST_RESULT,
} from "../../data/thaiLottoMockData";

/**
 * หน้าแทงหวยรัฐบาลไทย (/lottery/thai-government) — ลิงก์มาจากการ์ด feature ใน LotteryHubContent
 * ยังไม่เชื่อม API ส่งโพย (onSubmit) — ปุ่มยืนยันจึงปิดไว้
 */
export default function ThaiGovernmentLotteryPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="แทงหวย" backHref="/lottery" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-4 lg:pb-8">
        <ThaiLottoBetBoard
          draw={THAI_LOTTO_CURRENT_DRAW}
          lastResult={THAI_LOTTO_LAST_RESULT}
          groups={THAI_LOTTO_GROUPS}
          betTypes={THAI_LOTTO_BET_TYPES}
        />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
