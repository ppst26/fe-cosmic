"use client";

import React, { useCallback, useState } from "react";
import {
  LUCKY_WHEEL_HISTORY,
  LUCKY_WHEEL_INITIAL_SPINS,
  LUCKY_WHEEL_SEGMENTS,
  LUCKY_WHEEL_TERMS,
  type WheelHistoryEntry,
  type WheelSegment,
} from "@/app/data/luckyWheelMockData";
import { ChevronDownIcon } from "../ui/Icons";
import { CosmicFortuneWheel } from "./CosmicFortuneWheel";

const SEGMENT_DEG = 360 / LUCKY_WHEEL_SEGMENTS.length;

/**
 * เนื้อหาหน้าวงล้อจักรวาล — ใช้ใน /wheel
 */
export function LuckyWheelPageContent({ embedded = false }: { embedded?: boolean }) {
  const [spinsLeft, setSpinsLeft] = useState(LUCKY_WHEEL_INITIAL_SPINS);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState(LUCKY_WHEEL_HISTORY);
  const [termsOpen, setTermsOpen] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);

  const handleSpin = useCallback(() => {
    if (spinning || spinsLeft <= 0) return;

    const targetIndex = Math.floor(Math.random() * LUCKY_WHEEL_SEGMENTS.length);
    const segment: WheelSegment = LUCKY_WHEEL_SEGMENTS[targetIndex];
    const extraTurns = 5 * 360;
    const targetAngle = 360 - targetIndex * SEGMENT_DEG - SEGMENT_DEG / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetAngle - currentMod + 360) % 360;
    const nextRotation = rotation + extraTurns + delta;

    setSpinning(true);
    setSpinsLeft((n) => n - 1);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setLastWin(`ได้รับ ${segment.label} (mock)`);
      const entry: WheelHistoryEntry = {
        id: `h-${Date.now()}`,
        label: segment.label,
        kind: segment.kind,
        timeLabel: "เมื่อสักครู่",
      };
      setHistory((prev) => [entry, ...prev].slice(0, 5));
    }, 4200);
  }, [rotation, spinning, spinsLeft]);

  return (
    <div className="lucky-wheel-page flex flex-col gap-5 pb-4">
      {!embedded ? (
        <header className="text-center">
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] drop-shadow-[0_0_24px_rgba(167,139,250,0.35)] sm:text-2xl">
            วงล้อจักรวาล
          </h1>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)] sm:text-sm">
            หมุนวงล้อ ลุ้นรับเครดิตและ Gems
          </p>
          <p className="lucky-wheel-page__badge mt-3 inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
            สิทธิ์คงเหลือ{" "}
            <span className="text-base font-extrabold text-[#facc15]">{spinsLeft}</span> ครั้ง
          </p>
        </header>
      ) : (
        <p className="lucky-wheel-page__badge mx-auto inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
          สิทธิ์คงเหลือ{" "}
          <span className="text-base font-extrabold text-[#facc15]">{spinsLeft}</span> ครั้ง
        </p>
      )}

      <CosmicFortuneWheel segments={LUCKY_WHEEL_SEGMENTS} rotationDeg={rotation} spinning={spinning} />

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={spinning || spinsLeft <= 0}
          onClick={handleSpin}
          className="lucky-wheel-page__spin-btn flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-[var(--radius-pill)] text-sm font-extrabold text-[var(--text-primary)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 sm:text-base"
        >
          <SpinRefreshIcon className="h-5 w-5" />
          หมุนวงล้อ
        </button>
        <p className="text-[11px] text-[var(--text-muted)]">ใช้ 1 สิทธิ์ต่อการหมุน</p>
        {lastWin && (
          <p className="text-xs text-[var(--success)]" role="status">
            {lastWin}
          </p>
        )}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold text-[var(--text-primary)]">รางวัลล่าสุดของคุณ</h2>
        <ul className="flex flex-col gap-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/45 bg-[var(--surface-hover)]/35 px-3 py-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[var(--surface-mid)]">
                {item.kind === "credit" ? (
                  <CreditPrizeIcon className="h-5 w-5" />
                ) : (
                  <GemPrizeIcon className="h-5 w-5" />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">
                {item.label}
              </span>
              <span className="shrink-0 text-[11px] text-[var(--text-muted)]">{item.timeLabel}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/50 bg-[var(--surface-hover)]/35">
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/20"
          aria-expanded={termsOpen}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)]/70 text-[var(--icon-default)]">
            <DocLinesIcon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-bold text-[var(--text-primary)]">กติกาและเงื่อนไข</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-[var(--icon-default)] transition-transform ${
              termsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {termsOpen && (
          <ul className="space-y-2 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {LUCKY_WHEEL_TERMS.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--border-active)]" aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-center text-[10px] text-[var(--text-muted)]">ตัวอย่างรางวัลและจำนวนสิทธิ์</p>
    </div>
  );
}

function SpinRefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
      <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

function CreditPrizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <ellipse cx="12" cy="16" rx="8" ry="2.5" fill="#ca8a04" opacity="0.45" />
      <ellipse cx="12" cy="12" rx="8" ry="3" fill="#eab308" stroke="#fde047" strokeWidth="0.75" />
      <ellipse cx="12" cy="8" rx="8" ry="3" fill="#facc15" stroke="#fef08a" strokeWidth="0.75" />
    </svg>
  );
}

function GemPrizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3 L19 9 L15 21 L9 21 L5 9 Z" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1" />
    </svg>
  );
}
