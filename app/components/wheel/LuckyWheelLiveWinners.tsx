"use client";

import React from "react";
import { LUCKY_WHEEL_LIVE_WINNERS } from "@/app/data/luckyWheelMockData";

/**
 * รายการผู้เล่นคนอื่นได้รับรางวัล — ดีไซน์การ์ดมนตามภาพตัวอย่าง
 */
export function LuckyWheelLiveWinners() {
  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-[#0e0b16]/90 p-4 shadow-xl"
      aria-labelledby="wheel-live-title"
    >
      <header className="flex items-center justify-between pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
            <UsersIcon className="h-4 w-4" />
          </span>
          <h2 id="wheel-live-title" className="text-sm font-medium text-white">
            ผู้เล่นคนอื่นได้รับรางวัล
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-medium text-rose-400">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>LIVE</span>
        </div>
      </header>

      {/* รายการผู้เล่นแบบการ์ดแถวมน ตรงตามรูปที่ 2 */}
      <div className="flex flex-1 flex-col gap-2 min-h-0">
        {LUCKY_WHEEL_LIVE_WINNERS.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#14101e] px-3.5 py-3 text-xs transition-colors hover:bg-[#181326]"
          >
            <div className="flex w-24 shrink-0 items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/90">
                {entry.avatarLetter}
              </span>
              <span className="truncate font-medium text-white/80 text-[11px]">
                {entry.maskedName}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center gap-1.5 font-medium text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/90">
                <DiamondSmallIcon />
              </span>
              <span>
                ได้รับ{" "}
                <span className="font-medium text-purple-300">
                  {entry.gemsAmount.toFixed(2)} เพชร
                </span>
              </span>
            </div>

            <span className="w-20 shrink-0 text-right text-[11px] text-white/40 tabular-nums">
              {entry.timeLabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function DiamondSmallIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-white" fill="currentColor" aria-hidden="true">
      <path d="M8 2 13 7 10 14 6 14 3 7Z" />
    </svg>
  );
}
