"use client";

import React from "react";
import { useWheel } from "@/app/hooks/api/member";
import { valueClass } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * รายการผู้เล่นคนอื่นได้รับรางวัล — ดีไซน์การ์ดมนตามภาพตัวอย่าง
 */
export function LuckyWheelLiveWinners({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const t = useT("rewards");
  const isSidebar = variant === "sidebar";
  /** ใช้ cache เดียวกับ LuckyWheelPageContent (SWR) — ยังไม่มีข้อมูลแสดงรายการว่าง */
  const liveWinners = useWheel().data?.liveWinners ?? [];
  return (
    <section
      className={cn(
        "surface-solid-stack cosmic-outline-subtle flex h-full min-h-0 flex-col p-4 lg:p-3",
        isSidebar && "min-w-0",
      )}
      aria-labelledby="wheel-live-title"
    >
      <header className={cn("flex items-start gap-2 pb-3.5 lg:pb-2.5", isSidebar && "gap-1.5")}>
        <UsersIcon
          className={cn("shrink-0 text-[var(--icon-default)]", isSidebar ? "mt-0.5 h-3.5 w-3.5" : "h-4 w-4")}
          aria-hidden="true"
        />
        <h2
          id="wheel-live-title"
          className={cn(
            "font-medium leading-snug text-[var(--text-primary)]",
            isSidebar ? "text-[11px] lg:text-xs" : "text-sm",
          )}
        >
          {t("wheel.liveWinners.title")}
        </h2>
      </header>

      {/* รายการผู้เล่นแบบการ์ดแถวมน ตรงตามรูปที่ 2 */}
      <div className="flex flex-1 flex-col gap-2 min-h-0">
        {liveWinners.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "surface-solid-inner cosmic-outline-subtle rounded-[var(--radius-card)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-solid-inner)_72%,var(--surface-hover))]",
              isSidebar
                ? "flex min-w-0 flex-col gap-1 px-2.5 py-2 text-[10px] leading-snug lg:text-[11px]"
                : "flex items-center justify-between gap-1 px-3 py-2.5 text-xs lg:px-2.5 lg:py-2",
            )}
          >
            {isSidebar ? (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white/90"
                      aria-hidden="true"
                    >
                      {entry.avatarLetter}
                    </span>
                    <span className="truncate font-medium text-[var(--text-primary)]">{entry.maskedName}</span>
                  </div>
                  <span className={valueClass("muted", "mt-0.5 block tabular-nums")}>{entry.timeLabel}</span>
                </div>
                <div className="shrink-0 text-right leading-snug">
                  <span className={valueClass("success", "block font-medium tabular-nums")}>
                    {t("wheel.liveWinners.gemsWon", { amount: entry.gemsAmount.toFixed(2) })}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex w-24 shrink-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/90">
                    {entry.avatarLetter}
                  </span>
                  <span className="truncate text-xs font-medium text-[var(--text-primary)] sm:text-[13px]">
                    {entry.maskedName}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center gap-1.5 font-medium text-[var(--text-primary)]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/90">
                    <DiamondSmallIcon />
                  </span>
                  <span>
                    {t("wheel.liveWinners.received")}{" "}
                    <span className={valueClass("accent")}>
                      {t("wheel.liveWinners.gemsAmount", { amount: entry.gemsAmount.toFixed(2) })}
                    </span>
                  </span>
                </div>
                <span className="w-20 shrink-0 text-right text-xs tabular-nums text-[var(--text-secondary)]">
                  {entry.timeLabel}
                </span>
              </>
            )}
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
