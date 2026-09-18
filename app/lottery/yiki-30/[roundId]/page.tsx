"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../../components/layout/Header";
import { RightMenuDrawer } from "../../../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../../../components/slots/SlotProvidersHeader";
import { YikiBetBoard } from "../../../components/lottery/yiki/YikiBetBoard";
import {
  YIKI_BET_TYPES,
  YIKI_GROUPS,
  YIKI_SETTLEMENT_TYPES,
  getYikiRoundById,
} from "../../../data/yikiMockData";

/**
 * หน้าแทงหวยยี่กี 30 นาทีของรอบที่เลือก (/lottery/yiki-30/[roundId]) — เหมือน yiki-15 ทุกอย่าง
 * ไม่มี FloatingBottomNav — แทนที่ด้วย YikiActionBar (กลับหน้าก่อนหน้า/ย้อนกลับ + ใส่ราคา/ยืนยันการแทง)
 * ยังไม่เชื่อม API ส่งโพย (onSubmit) — ปุ่ม "ยืนยันการแทง" จึงปิดไว้
 */
export default function Yiki30PlayPage() {
  const urlParams = useParams();
  const roundId = (urlParams?.roundId as string) || "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const round = useMemo(() => getYikiRoundById(roundId), [roundId]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="หวยยี่กี 30 นาที" backHref="/lottery/yiki-30" />

      <main className="yiki-page-main mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pt-4">
        {round ? (
          <YikiBetBoard
            round={round}
            groups={YIKI_GROUPS}
            betTypes={YIKI_BET_TYPES}
            settlementTypes={YIKI_SETTLEMENT_TYPES}
            backHref="/lottery/yiki-30"
          />
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบรอบที่เลือก</p>
        )}
      </main>
    </div>
  );
}
