"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  LUCKY_WHEEL_GEMS_PER_SPIN,
  LUCKY_WHEEL_INITIAL_GEMS,
  LUCKY_WHEEL_INITIAL_TICKETS,
  LUCKY_WHEEL_SEGMENTS,
  LUCKY_WHEEL_TERMS,
  LUCKY_WHEEL_TICKETS_PER_SPIN,
  type WheelPrizeHistoryRow,
  type WheelSegment,
  type WheelSpinMethod,
} from "@/app/data/luckyWheelMockData";
import { formatGemsBalance } from "@/app/data/gemsStoreMockData";
import { ArrowLeftIcon } from "../ui/Icons";
import { CosmicFortuneWheel } from "./CosmicFortuneWheel";
import { LuckyWheelLiveWinners } from "./LuckyWheelLiveWinners";
import { LuckyWheelPrizeHistory } from "./LuckyWheelPrizeHistory";

const SEGMENT_DEG = 360 / LUCKY_WHEEL_SEGMENTS.length;

/**
 * หน้าเล่นวงล้อพารวย — รองรับ Mobile-first layout ตรงตาม mockup
 */
export function LuckyWheelPageContent({ embedded = false }: { embedded?: boolean }) {
  const [gemsBalance, setGemsBalance] = useState(LUCKY_WHEEL_INITIAL_GEMS);
  const [ticketCount, setTicketCount] = useState(LUCKY_WHEEL_INITIAL_TICKETS);
  const [spinMethod, setSpinMethod] = useState<WheelSpinMethod>("ticket");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [recentHistoryRows, setRecentHistoryRows] = useState<WheelPrizeHistoryRow[]>([]);

  const currentGemsCost = LUCKY_WHEEL_GEMS_PER_SPIN;
  const currentTicketCost = LUCKY_WHEEL_TICKETS_PER_SPIN;

  const canAfford =
    spinMethod === "gems"
      ? gemsBalance >= currentGemsCost
      : ticketCount >= currentTicketCost && ticketCount > 0;

  const handleSpin = useCallback(() => {
    if (spinning || !canAfford) return;

    const targetIndex = Math.floor(Math.random() * LUCKY_WHEEL_SEGMENTS.length);
    const segment: WheelSegment = LUCKY_WHEEL_SEGMENTS[targetIndex];
    const extraTurns = 5 * 360;
    const targetAngle = 360 - targetIndex * SEGMENT_DEG - SEGMENT_DEG / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetAngle - currentMod + 360) % 360;
    const nextRotation = rotation + extraTurns + delta;

    if (spinMethod === "gems") {
      setGemsBalance((b) => Math.max(0, b - currentGemsCost));
    } else {
      setTicketCount((t) => Math.max(0, t - currentTicketCost));
    }

    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setLastWin(`ยินดีด้วย! คุณได้รับ ${segment.label}`);
      const row: WheelPrizeHistoryRow = {
        id: `ph-${Date.now()}`,
        atLabel: "เมื่อสักครู่",
        prizeKind: segment.kind,
        prizeName: segment.kind === "gems" ? "เพชร" : "เครดิต",
        amount: segment.label.replace(/[^\d.]/g, "") || "—",
        method: spinMethod,
      };
      setRecentHistoryRows((prev) => [row, ...prev].slice(0, 5));
    }, 4200);
  }, [canAfford, currentGemsCost, currentTicketCost, rotation, spinMethod, spinning]);

  return (
    <div className={`lucky-wheel-page ${embedded ? "lucky-wheel-page--embedded" : ""}`}>
      {/* 1. Header Bar: ย้อนกลับ arrow back ไร้ card ครอบ, หัวข้อกึ่งกลาง, และจำนวนเพชร/ตั๋วมินิมอลบนขวา */}
      <div className="relative flex w-full items-center justify-between gap-3 px-1 py-1 sm:px-2">
        <Link
          href="/"
          className="flex h-10 w-10 shrink-0 items-center justify-start text-white hover:text-white/80 active:scale-90 transition-transform cursor-pointer"
          aria-label="ย้อนกลับไปหน้าแรก"
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center pointer-events-none">
          <h1 className="text-base font-medium text-white sm:text-lg leading-tight">วงล้อพารวย</h1>
          <p className="hidden text-xs sm:text-[13px] text-[var(--text-secondary)] sm:block">หมุนลุ้นรับรางวัลใหญ่ทุกวัน</p>
        </div>

        {/* ปุ่มเพชร และ ตั๋วมินิมอลบนขวา (ธีม Cosmicbet) */}
        <div className="flex items-center gap-2">
          {/* ชิปเพชร */}
          <Link
            href="/gems-store"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-purple-500/30 bg-[#150d2c]/90 px-3 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)] transition-all hover:border-purple-400/60 hover:bg-[#1d123d] active:scale-95"
            aria-label="ยอดเพชรของคุณ"
          >
            <GoldGemIcon className="h-3.5 w-3.5 shrink-0 text-sky-400" />
            <span className="text-xs font-medium text-white tabular-nums tracking-tight">
              {formatGemsBalance(gemsBalance)}
            </span>
          </Link>

          {/* ชิปตั๋ว */}
          <div
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-purple-500/30 bg-[#150d2c]/90 px-3 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]"
            aria-label="จำนวนตั๋วของคุณ"
          >
            <GoldTicketIcon className="h-3.5 w-3.5 shrink-0 text-purple-400" />
            <span className="text-xs font-medium text-white tabular-nums tracking-tight">
              {ticketCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. โซนวงล้อ และปุ่มหมุน (Mobile-first centered column) */}
      <div className="flex w-full flex-col items-center">
        {/* ตัววงล้อ + ปุ่ม info ขวาบน */}
        <div className="relative flex w-full max-w-[380px] sm:max-w-[420px] flex-col items-center justify-center pt-2">
          {/* ปุ่ม Info กติกา ขวาบนวงล้อ */}
          <button
            type="button"
            onClick={() => setTermsOpen((prev) => !prev)}
            className="absolute right-1 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/30 bg-[#150d2c]/80 text-purple-300 backdrop-blur-md transition-colors hover:border-purple-400 hover:text-white active:scale-95 cursor-pointer"
            aria-label="กติกาและเงื่อนไข"
            title="กติกาและเงื่อนไข"
          >
            <span className="text-xs font-serif font-medium italic">i</span>
          </button>

          {/* ดีไซน์วงล้อเดิม (ห้ามเปลี่ยนดีไซน์) */}
          <CosmicFortuneWheel
            segments={LUCKY_WHEEL_SEGMENTS}
            rotationDeg={rotation}
            spinning={spinning}
            onCenterClick={handleSpin}
            centerDisabled={!canAfford}
          />

          {/* Indicator dots 2 จุด ใต้วงล้อ */}
          <div className="mt-2 flex items-center justify-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          </div>
        </div>

        {/* 3. แท็บเลือกว่าจะใช้อะไรหมุน (เพชร ×10.00 / ตั๋ว ×1) — ธีม Cosmicbet */}
        <div
          role="tablist"
          aria-label="เลือกวิธีหมุนวงล้อ"
          className="my-3.5 flex items-center rounded-2xl border border-purple-500/20 bg-[#120b24]/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={spinMethod === "gems"}
            onClick={() => setSpinMethod("gems")}
            className={`rounded-xl px-5 py-2 text-xs font-medium sm:text-sm transition-all cursor-pointer ${
              spinMethod === "gems"
                ? "border border-[#8b5cf6] bg-gradient-to-r from-[#7747e5]/40 to-[#9333ea]/30 text-purple-200 shadow-[0_0_14px_rgba(139,92,246,0.35)] font-medium"
                : "text-white/60 hover:text-white"
            }`}
          >
            เพชร ×{LUCKY_WHEEL_GEMS_PER_SPIN.toFixed(2)}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={spinMethod === "ticket"}
            onClick={() => setSpinMethod("ticket")}
            className={`rounded-xl px-5 py-2 text-xs font-medium sm:text-sm transition-all cursor-pointer ${
              spinMethod === "ticket"
                ? "border border-[#8b5cf6] bg-gradient-to-r from-[#7747e5]/40 to-[#9333ea]/30 text-purple-200 shadow-[0_0_14px_rgba(139,92,246,0.35)] font-medium"
                : "text-white/60 hover:text-white"
            }`}
          >
            ตั๋ว ×{LUCKY_WHEEL_TICKETS_PER_SPIN}
          </button>
        </div>

        {/* 4. ปุ่มหมุนใหญ่ — สีตรงธีม Cosmicbet (ม่วงนีออน Action Gradient) */}
        <div className="flex w-full max-w-[340px] flex-col items-center">
          <button
            type="button"
            disabled={spinning}
            onClick={() => {
              if (!canAfford) {
                if (spinMethod === "ticket") setSpinMethod("gems");
                return;
              }
              handleSpin();
            }}
            className={`group relative flex w-full flex-col items-center justify-center rounded-2xl py-3.5 px-6 transition-all cursor-pointer ${
              canAfford
                ? "bg-gradient-to-r from-[#7747e5] via-[#8b5cf6] to-[#6d28d9] text-white shadow-[0_0_24px_rgba(124,58,237,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 active:scale-[0.98]"
                : "bg-gradient-to-r from-[#4c2896] via-[#5b32b3] to-[#432085] text-white/80 shadow-[0_0_16px_rgba(124,58,237,0.25)] hover:brightness-105"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <SpinArrowIcon className={`h-5 w-5 shrink-0 text-white ${spinning ? "animate-spin" : ""}`} />
              <span className="text-lg font-medium tracking-wide text-white">
                {spinning ? "กำลังหมุน…" : "หมุนเลย"}
              </span>
            </div>
            <span className="text-xs font-medium text-purple-200">
              {spinMethod === "ticket"
                ? `ใช้ตั๋ว ${LUCKY_WHEEL_TICKETS_PER_SPIN} ใบ`
                : `ใช้ ${LUCKY_WHEEL_GEMS_PER_SPIN.toFixed(2)} เพชร`}
            </span>
          </button>

          {/* ข้อความช่วยเหลือใต้ปุ่ม — ธีม Cosmicbet */}
          {spinMethod === "ticket" && ticketCount <= 0 ? (
            <button
              type="button"
              onClick={() => setSpinMethod("gems")}
              className="mt-2.5 text-xs font-medium text-purple-300 underline decoration-purple-400/40 underline-offset-4 transition-colors hover:text-purple-200 hover:decoration-purple-300 cursor-pointer"
            >
              ไม่มีตั๋ว ลองหมุนด้วยเพชร
            </button>
          ) : spinMethod === "gems" && gemsBalance < currentGemsCost ? (
            <Link
              href="/gems-store"
              className="mt-2.5 text-xs font-medium text-purple-300 underline decoration-purple-400/40 underline-offset-4 transition-colors hover:text-purple-200 hover:decoration-purple-300"
            >
              เพชรไม่เพียงพอ ลองเติมเพชร
            </Link>
          ) : (
            <span className="mt-2.5 text-xs text-[var(--text-secondary)]">หมุนสนุก ลุ้นรับของรางวัลได้ทุกวัน</span>
          )}

          {lastWin ? (
            <div className="mt-2 text-center text-xs font-medium text-emerald-400 animate-fade-in" role="status">
              {lastWin}
            </div>
          ) : null}
        </div>
      </div>

      {/* Accordion กติกาและเงื่อนไข (เมื่อกดปุ่ม i) */}
      {termsOpen ? (
        <section className="mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#120e20]/90 p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h2 className="text-sm font-medium text-white">กติกาและเงื่อนไขการหมุนวงล้อ</h2>
            <button
              type="button"
              onClick={() => setTermsOpen(false)}
              className="text-xs text-white/60 hover:text-white cursor-pointer"
            >
              ปิด
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-white/70">
            {LUCKY_WHEEL_TERMS.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-amber-400" aria-hidden="true">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 5. ตารางยังเก็บไว้เหมือนเดิม (ประวัติการหมุนของฉัน & ผู้เล่นคนอื่นได้รับรางวัล) */}
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 pt-4 lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-5">
        <LuckyWheelPrizeHistory extraRows={recentHistoryRows} />
        <LuckyWheelLiveWinners />
      </div>

      <p className="pt-2 text-center text-xs text-[var(--text-secondary)]">ตัวอย่างรางวัลและยอดกระเป๋า</p>
    </div>
  );
}

function GoldGemIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2 3 9l9 13 9-13-9-7ZM6.4 9l5.6-4.35L17.6 9H6.4Z" />
    </svg>
  );
}

function GoldTicketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Zm5 3a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H9Z" />
    </svg>
  );
}

function SpinArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
