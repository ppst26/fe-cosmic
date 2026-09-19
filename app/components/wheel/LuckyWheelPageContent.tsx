"use client";

import React, { useCallback, useMemo, useState } from "react";
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
import { formatGemsAmount } from "@/app/data/gemsStoreMockData";
import { ChevronDownIcon } from "../ui/Icons";
import { CosmicFortuneWheel } from "./CosmicFortuneWheel";
import { LuckyWheelIntroColumn } from "./LuckyWheelIntroColumn";
import { LuckyWheelLiveWinners } from "./LuckyWheelLiveWinners";
import { LuckyWheelPrizeHistory } from "./LuckyWheelPrizeHistory";
import { LuckyWheelWalletPanel } from "./LuckyWheelWalletPanel";

const SEGMENT_DEG = 360 / LUCKY_WHEEL_SEGMENTS.length;

/**
 * เนื้อหาหน้าวงล้อพารวย — ใช้ใน /wheel
 */
export function LuckyWheelPageContent({ embedded = false }: { embedded?: boolean }) {
  const [gemsBalance, setGemsBalance] = useState(LUCKY_WHEEL_INITIAL_GEMS);
  const [ticketCount] = useState(LUCKY_WHEEL_INITIAL_TICKETS);
  const [spinMethod, setSpinMethod] = useState<WheelSpinMethod>("gems");
  const [spinQty, setSpinQty] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [recentHistoryRows, setRecentHistoryRows] = useState<WheelPrizeHistoryRow[]>([]);

  const totalGemsCost = spinQty * LUCKY_WHEEL_GEMS_PER_SPIN;
  const totalTicketCost = spinQty * LUCKY_WHEEL_TICKETS_PER_SPIN;

  const canAfford =
    spinMethod === "gems"
      ? gemsBalance >= totalGemsCost
      : ticketCount >= totalTicketCost && ticketCount > 0;

  const totalCostLabel =
    spinMethod === "gems"
      ? `ใช้ ${formatGemsAmount(totalGemsCost)} เพชร`
      : `ใช้ ${totalTicketCost} ตั๋ว`;

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
      setGemsBalance((b) => b - totalGemsCost);
    }

    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setLastWin(`ได้รับ ${segment.label}`);
      const row: WheelPrizeHistoryRow = {
        id: `ph-${Date.now()}`,
        atLabel: "เมื่อสักครู่",
        prizeKind: segment.kind,
        prizeName: segment.kind === "gems" ? "เพชร" : "เครดิต",
        amount: segment.label.replace(/[^\d.]/g, "") || "—",
        method: spinMethod,
      };
      setRecentHistoryRows((prev) => [row, ...prev].slice(0, 3));
    }, 4200);
  }, [canAfford, rotation, spinMethod, spinning, totalGemsCost]);

  const handleMethodChange = useCallback(
    (method: WheelSpinMethod) => {
      setSpinMethod(method);
      if (method === "ticket" && ticketCount > 0) {
        setSpinQty((q) => Math.min(q, ticketCount));
      }
    },
    [ticketCount],
  );

  const termsSection = useMemo(
    () => (
      <section className="lucky-wheel-terms lucky-wheel-surface-glass cosmic-inset-card overflow-hidden">
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/20"
          aria-expanded={termsOpen}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)] text-[var(--icon-default)]">
            <DocLinesIcon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">กติกาและเงื่อนไข</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-[var(--icon-default)] transition-transform ${termsOpen ? "rotate-180" : ""}`}
          />
        </button>
        {termsOpen ? (
          <ul className="space-y-2 px-4 pb-3.5 pt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            {LUCKY_WHEEL_TERMS.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--border-active)]" aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    ),
    [termsOpen],
  );

  return (
    <div className={`lucky-wheel-page ${embedded ? "lucky-wheel-page--embedded" : ""}`}>
      <div className="lucky-wheel-page__hero">
        <div className="lucky-wheel-page__hero-bg" aria-hidden="true" />
        <div className="lucky-wheel-page__hero-overlay" aria-hidden="true" />
        <div className="lucky-wheel-page__hero-scrim" aria-hidden="true" />
        <div className="lucky-wheel-page__top">
        <LuckyWheelIntroColumn embedded={embedded} />

        <div className="lucky-wheel-page__wheel-col">
          <CosmicFortuneWheel
            segments={LUCKY_WHEEL_SEGMENTS}
            rotationDeg={rotation}
            spinning={spinning}
            onCenterClick={handleSpin}
            centerDisabled={!canAfford}
          />
          {lastWin ? (
            <p className="lucky-wheel-page__status" role="status">
              {lastWin}
            </p>
          ) : null}
        </div>

        <LuckyWheelWalletPanel
          gemsBalance={gemsBalance}
          ticketCount={ticketCount}
          spinMethod={spinMethod}
          onSpinMethodChange={handleMethodChange}
          spinQty={spinQty}
          onSpinQtyChange={setSpinQty}
          onSpin={handleSpin}
          spinning={spinning}
          canSpin={canAfford}
          totalCostLabel={totalCostLabel}
        />
        </div>

        <div className="lucky-wheel-page__bottom">
          <LuckyWheelLiveWinners />
          <LuckyWheelPrizeHistory extraRows={recentHistoryRows} />
        </div>
      </div>

      {termsSection}

      <p className="text-center text-[10px] text-[var(--text-muted)]">ตัวอย่างรางวัลและยอดกระเป๋า</p>
    </div>
  );
}

function DocLinesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round" />
      <rect x="5" y="4" width="14" height="16" rx="2" />
    </svg>
  );
}
