"use client";

import React, { useMemo, useState } from "react";
import {
  DAILY_CHECKIN_INITIAL,
  DAILY_CHECKIN_TERMS,
  countCheckedInDays,
  formatCheckInCredits,
  getTodayReward,
  type DailyCheckInDayReward,
} from "@/app/data/dailyCheckInMockData";
import { ChevronDownIcon, ChevronRightIcon } from "../ui/Icons";
import {
  COSMIC_BTN_PRIMARY,
  COSMIC_BTN_NAV,
  COSMIC_BTN_GLASS_PILL_SM,
  COSMIC_PANEL_GLASS,
  COSMIC_PANEL_GLASS_ICON,
} from "../ui/cosmicButtonClasses";
import { DailyCheckInDesktopLayout } from "./DailyCheckInDesktopLayout";
import {
  CheckInCoinGraphic,
  DailyCheckInCalendarGraphic,
  TreasureChestGraphic,
} from "./DailyCheckInGraphics";

/**
 * เนื้อหาเช็คอินรายวัน — ใช้ใน /missions/check-in และ DesktopHubModal
 */
export function DailyCheckInPageContent({ embedded = false }: { embedded?: boolean }) {
  const [days, setDays] = useState<DailyCheckInDayReward[]>(DAILY_CHECKIN_INITIAL);
  const [termsOpen, setTermsOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const checkedInCount = countCheckedInDays(days);
  const todayReward = getTodayReward(days);
  const regularDays = useMemo(() => days.filter((d) => d.day <= 6), [days]);
  const daySeven = days.find((d) => d.day === 7);

  const handleClaimDay = (dayNum: number) => {
    const reward = days.find((d) => d.day === dayNum);
    if (!reward || reward.status !== "today") return;

    const nextDay = reward.day + 1;
    setDays((prev) =>
      prev.map((item) => {
        if (item.status === "today" && item.day === dayNum) {
          return { ...item, status: "claimed" };
        }
        if (item.day === nextDay && item.status === "locked") {
          return { ...item, status: "today" };
        }
        return item;
      }),
    );
    setClaimMessage(`รับ ${formatCheckInCredits(reward.credits)} แล้ว (mock)`);
  };

  if (embedded) {
    return (
      <DailyCheckInDesktopLayout
        days={days}
        checkedInCount={checkedInCount}
        claimMessage={claimMessage}
        onClaimDay={handleClaimDay}
      />
    );
  }

  return (
    <div className="daily-check-in-mobile flex flex-col gap-5 pb-4">
      <header className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-medium text-[var(--text-primary)] drop-shadow-[0_0_20px_rgba(167,139,250,0.25)] sm:text-2xl">
              เช็คอินรายวัน
            </h1>
            <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
              เข้าเช็คอิน รับรางวัลเครดิตฟรี
            </p>
          </div>
          <DailyCheckInCalendarGraphic className="h-20 w-24 shrink-0 sm:h-24 sm:w-28" />
        </div>
      </header>

      <section className={`${COSMIC_PANEL_GLASS} px-3 py-3.5 sm:px-4`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <p className="font-medium text-[var(--text-primary)]">
            เช็คอินแล้ว {checkedInCount} / 7 วัน
          </p>
          <p className="text-[var(--text-secondary)]">สะสมทุกวัน รับรางวัลพิเศษ</p>
        </div>
        <DailyCheckInProgressTrack days={days} />
      </section>

      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {regularDays.map((day) => (
          <DailyRewardCard key={day.day} day={day} />
        ))}
      </div>

      {daySeven && <DailyDaySevenCard day={daySeven} />}

      {claimMessage && (
        <p className="text-center text-xs text-[var(--success)]" role="status">
          {claimMessage}
        </p>
      )}

      <button
        type="button"
        disabled={!todayReward}
        onClick={() => todayReward && handleClaimDay(todayReward.day)}
        className={`${COSMIC_BTN_PRIMARY} flex h-12 w-full items-center justify-center gap-2 text-sm disabled:opacity-45 sm:text-base`}
      >
        <GiftMiniIcon className="h-5 w-5" />
        {todayReward
          ? `รับ ${new Intl.NumberFormat("th-TH").format(todayReward.credits)} เครดิตวันนี้`
          : "รับรางวัลวันนี้แล้ว"}
        <ChevronRightIcon className="h-4 w-4" />
      </button>

      <p className="text-center text-[10px] text-[var(--text-muted)]">ตัวอย่างรางวัลสำหรับการออกแบบ</p>

      <section className={`${COSMIC_PANEL_GLASS} overflow-hidden`}>
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_6%,transparent)]"
          aria-expanded={termsOpen}
        >
          <span className={`${COSMIC_PANEL_GLASS_ICON} !h-9 !w-9`}>
            <ListIcon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">เงื่อนไขการเช็คอิน</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-[var(--icon-default)] transition-transform ${
              termsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {termsOpen && (
          <ul className="space-y-2 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {DAILY_CHECKIN_TERMS.map((line) => (
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
    </div>
  );
}

function DailyCheckInProgressTrack({ days }: { days: DailyCheckInDayReward[] }) {
  return (
    <ol className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const isClaimed = day.status === "claimed";
        const isToday = day.status === "today";
        return (
          <li key={day.day} className="flex flex-col items-center gap-1.5">
            <div
              className={`daily-check-in-mobile__streak-dot flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium sm:h-9 sm:w-9 ${
                isClaimed
                  ? "is-claimed"
                  : isToday
                    ? "is-today glass-control"
                    : "glass-control text-[var(--text-muted)]"
              }`}
            >
              {isClaimed ? "✓" : day.day}
            </div>
            <span className="text-[9px] text-[var(--text-muted)] sm:text-[10px]">วันที่ {day.day}</span>
          </li>
        );
      })}
    </ol>
  );
}

function DailyRewardCard({ day }: { day: DailyCheckInDayReward }) {
  const isClaimed = day.status === "claimed";
  const isToday = day.status === "today";
  const isLocked = day.status === "locked";

  return (
    <article
      className={`glass-card--soft relative flex flex-col rounded-[var(--radius-panel)] px-2 pb-2 pt-2.5 sm:px-2.5 ${
        isToday ? "daily-check-in-mobile__day-card is-today" : ""
      } ${isLocked ? "opacity-85" : ""}`}
    >
      {isToday && (
        <span className="daily-check-in-mobile__today-badge absolute right-1.5 top-1.5 rounded-[var(--radius-pill)] px-1.5 py-0.5 text-[8px] font-medium sm:text-[9px]">
          วันนี้
        </span>
      )}
      <p className="text-[10px] font-medium text-[var(--text-secondary)] sm:text-xs">วันที่ {day.day}</p>
      <CheckInCoinGraphic className="mx-auto my-1.5 h-10 w-10 sm:h-11 sm:w-11" />
      <p className="text-center text-[11px] font-medium text-[var(--text-primary)] sm:text-xs">
        {formatCheckInCredits(day.credits)}
      </p>
      <div className="mt-2">
        {isClaimed && (
          <span
            className={`${COSMIC_BTN_GLASS_PILL_SM} flex w-full items-center justify-center gap-1 !text-[9px] sm:!text-[10px] text-[var(--success)]`}
          >
            ✓ รับแล้ว
          </span>
        )}
        {isToday && (
          <span
            className={`${COSMIC_BTN_NAV} cosmic-btn-nav--sm flex w-full items-center justify-center gap-1 py-1 text-[9px] sm:text-[10px]`}
          >
            🎁 พร้อมรับ
          </span>
        )}
        {isLocked && (
          <span
            className={`${COSMIC_BTN_GLASS_PILL_SM} flex w-full items-center justify-center gap-1 !text-[9px] sm:!text-[10px] text-[var(--text-muted)]`}
          >
            <LockMiniIcon className="h-3 w-3" /> ล็อค
          </span>
        )}
      </div>
    </article>
  );
}

function DailyDaySevenCard({ day }: { day: DailyCheckInDayReward }) {
  return (
    <article
      className={`${COSMIC_PANEL_GLASS} relative flex items-center gap-3 overflow-hidden px-3 py-3 sm:gap-4 sm:px-4`}
    >
      <TreasureChestGraphic className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--text-secondary)]">วันที่ 7</p>
        <p className="text-lg font-medium text-[var(--text-primary)] sm:text-xl">
          {formatCheckInCredits(day.credits)}
        </p>
        <span
          className={`${COSMIC_BTN_GLASS_PILL_SM} mt-2 inline-flex items-center gap-1 !text-[10px] text-[var(--text-muted)]`}
        >
          <LockMiniIcon className="h-3 w-3" /> ล็อค
        </span>
      </div>
    </article>
  );
}

function GiftMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 11h16v9H4z" fill="currentColor" opacity="0.35" />
      <path d="M12 11v9M4 11h16V8a2 2 0 0 0-2-2h-1.5a2.5 2.5 0 0 0 0 5H12M4 11h16V8a2 2 0 0 1 2-2h1.5a2.5 2.5 0 0 1 0 5H12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LockMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" opacity="0.35" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
