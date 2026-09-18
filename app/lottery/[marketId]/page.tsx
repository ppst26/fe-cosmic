"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../components/layout/Header";
import { RightMenuDrawer } from "../../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../../components/slots/SlotProvidersHeader";
import { YikiBetBoard } from "../../components/lottery/yiki/YikiBetBoard";
import { YIKI_BET_TYPES, YIKI_GROUPS, YIKI_SETTLEMENT_TYPES } from "../../data/yikiMockData";
import { getLotteryMarketBySlug, type LotteryMarketConfig } from "../../data/lotteryMarketsMockData";

/**
 * งวดเดียวที่กำลังเปิดรับของตลาด + กระดานแทง — แยกเป็นคอมโพเนนต์ย่อยคีย์ด้วย market.slug
 * เพื่อให้ useState lazy initializer (อ่านเวลาปัจจุบันครั้งเดียวตอนสร้าง) รีเซ็ตใหม่ทุกครั้งที่ผู้ใช้
 * กด Link ไปตลาดอื่นแบบ client-side (Next.js ไม่ remount component เดิมแค่เพราะ params เปลี่ยน)
 */
function LotteryMarketBoard({ market }: { market: LotteryMarketConfig }) {
  const [round] = useState(() => {
    const closeAt = new Date(Date.now() + market.closesInMinutes * 60 * 1000);
    return { id: market.slug, label: market.title, closeAt: closeAt.toISOString() };
  });

  return (
    <YikiBetBoard
      round={round}
      groups={YIKI_GROUPS}
      betTypes={YIKI_BET_TYPES}
      settlementTypes={YIKI_SETTLEMENT_TYPES}
      backHref="/lottery"
      flagLabel={market.flagLabel}
      flagTone={market.flagTone}
    />
  );
}

/**
 * หน้าแทงหวยหุ้น/ต่างประเทศ (/lottery/[marketId] เช่น /lottery/laos, /lottery/china)
 * ใช้ UI เดียวกับยี่กี (โพยซ้าย/ใส่เลขขวา) — ต่างจากยี่กีตรงไม่มีหน้ารายการรอบ เพราะมีงวดเดียวที่กำลังเปิดรับ
 * ตลาดที่ปิดรับแทง (status "closed") จะเข้าสถานะปิดรับอัตโนมัติจาก closeAt ที่ตั้งไว้ในอดีต — ไม่ต้องแยกเงื่อนไข
 * ไม่มี FloatingBottomNav — แทนที่ด้วย YikiActionBar · ยังไม่เชื่อม API ส่งโพย ปุ่ม "ยืนยันการแทง" จึงปิดไว้
 */
export default function LotteryMarketPage() {
  const urlParams = useParams();
  const marketId = (urlParams?.marketId as string) || "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const market = useMemo(() => getLotteryMarketBySlug(marketId), [marketId]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title={market?.title ?? "แทงหวย"} backHref="/lottery" />

      <main className="yiki-page-main mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pt-4">
        {market ? (
          <LotteryMarketBoard key={market.slug} market={market} />
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ไม่พบตลาดหวยนี้</p>
        )}
      </main>
    </div>
  );
}
