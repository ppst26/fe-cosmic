"use client";

import React from "react";
import { LUCKY_WHEEL_LIVE_WINNERS } from "@/app/data/luckyWheelMockData";

/**
 * รายการผู้เล่นอื่นได้รับรางวัลแบบเรียลไทม์ (mock) — ใช้ใน LuckyWheelPageContent
 */
export function LuckyWheelLiveWinners() {
  return (
    <section
      className="lucky-wheel-feed lucky-wheel-surface-glass cosmic-inset-card flex h-full min-h-0 flex-col"
      aria-labelledby="wheel-live-title"
    >
      <header className="lucky-wheel-feed__head">
        <div className="flex min-w-0 items-center gap-2">
          <UsersIcon className="h-5 w-5 shrink-0 text-[var(--icon-active)]" />
          <h2 id="wheel-live-title" className="truncate text-sm font-medium text-[var(--text-primary)]">
            ผู้เล่นคนอื่นได้รับรางวัล
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="lucky-wheel-feed__live">LIVE</span>
          <span className="lucky-wheel-feed__pulse">
            <span className="lucky-wheel-feed__dot" aria-hidden="true" />
            อัปเดตแบบเรียลไทม์
          </span>
        </div>
      </header>

      <ul className="lucky-wheel-feed__list min-h-0 flex-1">
        {LUCKY_WHEEL_LIVE_WINNERS.map((entry) => (
          <li key={entry.id} className="lucky-wheel-feed__item">
            <span className="lucky-wheel-feed__avatar" aria-hidden="true">
              {entry.avatarLetter}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">{entry.maskedName}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                ได้รับ{" "}
                <span className="font-medium text-[var(--icon-active)] tabular-nums">{entry.gemsAmount}</span> เพชร
              </p>
            </div>
            <span className="shrink-0 text-[11px] text-[var(--text-muted)]">{entry.timeLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c0-2.5 2.2-4 5-4s5 1.5 5 4" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 19c.3-1.8 1.8-3 3.5-3" strokeLinecap="round" />
    </svg>
  );
}
