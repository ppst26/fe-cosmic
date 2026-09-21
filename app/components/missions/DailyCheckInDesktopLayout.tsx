"use client";

import React from "react";
import {
  DAILY_CHECKIN_TERMS,
  formatCheckInCredits,
  type DailyCheckInDayReward,
} from "@/app/data/dailyCheckInMockData";
import { CheckInCoinGraphic, DailyCheckInCalendarGraphic } from "./DailyCheckInGraphics";
import { COSMIC_BTN_GLASS_PILL, COSMIC_BTN_GLASS_PILL_SM } from "../ui/cosmicButtonClasses";

interface DailyCheckInDesktopLayoutProps {
  days: DailyCheckInDayReward[];
  checkedInCount: number;
  claimMessage: string | null;
  onClaimDay: (day: number) => void;
}

/**
 * เช็คอิน desktop hub — แบนเนอร์ซ้าย · แถวรายวันขวา (DesktopHubModal)
 */
export function DailyCheckInDesktopLayout({
  days,
  checkedInCount,
  claimMessage,
  onClaimDay,
}: DailyCheckInDesktopLayoutProps) {
  const todayReward = days.find((d) => d.status === "today");

  return (
    <div
      className="daily-check-in-desktop daily-check-in-desktop--flat grid min-h-0 gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-0"
    >
      <aside
        className="daily-check-in-desktop__banner flex min-w-0 flex-col gap-4"
        aria-label="สรุปเช็คอิน"
      >
        <section
          className="referral-hub-block flex flex-col items-center gap-3 py-2"
          aria-label="ความคืบหน้าเช็คอิน"
        >
          <p className="m-0 text-xs font-medium text-[var(--text-secondary)]">
            ความคืบหน้าสัปดาห์นี้
          </p>
          <DailyCheckInCalendarGraphic className="daily-check-in-desktop__banner-art h-auto w-28 sm:w-30" />
          <div className="text-center">
            <p className="daily-check-in-desktop__banner-stat m-0 flex items-baseline justify-center gap-[0.2rem]">
              <span className="daily-check-in-desktop__banner-stat-value tabular-nums">
                {checkedInCount}
              </span>
              <span className="daily-check-in-desktop__banner-stat-sep text-[var(--text-muted)]">
                /
              </span>
              <span className="tabular-nums">7</span>
              <span className="daily-check-in-desktop__banner-stat-label ml-1">วัน</span>
            </p>
          </div>
        </section>

        <section className="referral-hub-block flex flex-col gap-3 py-2" aria-label="รับรางวัลวันนี้">
          <button
            type="button"
            disabled={!todayReward}
            onClick={() => todayReward && onClaimDay(todayReward.day)}
            className={`${COSMIC_BTN_GLASS_PILL} daily-check-in-desktop__banner-cta !min-h-11 w-full !text-sm font-medium ${
              todayReward ? "is-active" : ""
            }`}
          >
            {todayReward ? "รับรางวัลวันนี้" : "รับรางวัลแล้ว"}
          </button>
        </section>

        <ol
          className="daily-check-in-desktop__streak m-0 grid list-none grid-cols-7 gap-1.5 p-0"
          aria-label="ความคืบหน้า 7 วัน"
        >
          {days.map((day) => {
            const claimed = day.status === "claimed";
            const isToday = day.status === "today";
            return (
              <li
                key={day.day}
                className="daily-check-in-desktop__streak-item flex flex-col items-center gap-1"
              >
                <span
                  className={`daily-check-in-desktop__streak-dot grid h-[1.75rem] w-[1.75rem] place-items-center${
                    claimed ? " is-claimed" : isToday ? " is-today" : ""
                  }`}
                >
                  {claimed ? "✓" : day.day}
                </span>
                <span className="daily-check-in-desktop__streak-label whitespace-nowrap">
                  วัน {day.day}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="daily-check-in-desktop__terms-hint mb-0 mt-auto text-[11px] leading-snug text-[var(--text-muted)]">
          {DAILY_CHECKIN_TERMS[0]}
        </p>
      </aside>

      <div className="daily-check-in-desktop__main flex min-h-0 min-w-0 flex-col gap-3">
        <header className="daily-check-in-desktop__main-head flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="daily-check-in-desktop__main-title m-0">รายการเช็คอิน</h3>
          {claimMessage ? (
            <p className="daily-check-in-desktop__claim-msg m-0" role="status">
              {claimMessage}
            </p>
          ) : null}
        </header>

        <ul className="daily-check-in-desktop__day-list">
          {days.map((day) => (
            <DailyCheckInDayRow key={day.day} day={day} onClaim={() => onClaimDay(day.day)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function DailyCheckInDayRow({
  day,
  onClaim,
}: {
  day: DailyCheckInDayReward;
  onClaim: () => void;
}) {
  const isClaimed = day.status === "claimed";
  const isToday = day.status === "today";
  const isBonusDay = day.day === 7;
  const isLocked = day.status === "locked";

  return (
    <li
      className={`daily-check-in-desktop__day-row grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3.5 py-3.5${
        isToday ? " is-today" : ""
      }${isClaimed ? " is-claimed" : ""}${isLocked ? " is-locked" : ""}`}
    >
      <div
        className={`daily-check-in-desktop__day-badge grid h-10 w-10 shrink-0 place-items-center rounded-full${
          isToday ? " is-today" : ""
        }${isClaimed ? " is-claimed" : ""}`}
        aria-hidden="true"
      >
        <span className="daily-check-in-desktop__day-badge-num leading-none">{day.day}</span>
      </div>

      <div className="daily-check-in-desktop__day-body flex min-w-0 flex-col gap-1">
        <p className="daily-check-in-desktop__day-title m-0">
          วันที่ {day.day}
          {isBonusDay ? " · รางวัลพิเศษ" : ""}
        </p>
        <p className="daily-check-in-desktop__day-reward m-0 tabular-nums">
          {formatCheckInCredits(day.credits)}
        </p>
        <p className="daily-check-in-desktop__day-desc m-0">
          {isBonusDay ? "เช็คอินครบสัปดาห์ รับเครดิตโบนัส" : "รางวัลเช็คอินประจำวัน"}
        </p>
      </div>

      <div className="daily-check-in-desktop__day-visual hidden sm:block" aria-hidden="true">
        <CheckInCoinGraphic className="h-11 w-11" />
      </div>

      <div className="daily-check-in-desktop__day-action flex min-w-[5.5rem] justify-end">
        {isClaimed ? (
          <span
            className={`${COSMIC_BTN_GLASS_PILL_SM} daily-check-in-desktop__claim-pill min-w-[5.25rem] whitespace-nowrap !w-full text-[var(--success)]`}
          >
            รับแล้ว
          </span>
        ) : isToday ? (
          <button
            type="button"
            className={`${COSMIC_BTN_GLASS_PILL} daily-check-in-desktop__claim-btn min-w-[5.25rem] whitespace-nowrap !min-h-9 !px-3 !text-xs is-active`}
            onClick={onClaim}
          >
            รับรางวัล
          </button>
        ) : (
          <span
            className={`${COSMIC_BTN_GLASS_PILL_SM} daily-check-in-desktop__claim-pill min-w-[5.25rem] whitespace-nowrap !w-full text-[var(--text-muted)]`}
          >
            ล็อค
          </span>
        )}
      </div>
    </li>
  );
}
