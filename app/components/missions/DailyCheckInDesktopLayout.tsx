"use client";

import React from "react";
import {
  DAILY_CHECKIN_TERMS,
  formatCheckInCredits,
  type DailyCheckInDayReward,
} from "@/app/data/dailyCheckInMockData";
import { CheckInCoinGraphic, DailyCheckInCalendarGraphic } from "./DailyCheckInGraphics";

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
    <div className="daily-check-in-desktop">
      <aside className="daily-check-in-desktop__banner hub-desktop-card" aria-label="สรุปเช็คอิน">
        <div className="daily-check-in-desktop__banner-head">
          <h2 className="daily-check-in-desktop__banner-title">เช็คอินรายวัน</h2>
          <p className="daily-check-in-desktop__banner-sub">
            เข้าเช็คอินทุกวัน รับเครดิตฟรีสะสมครบ 7 วัน
          </p>
        </div>

        <div className="daily-check-in-desktop__banner-progress">
          <DailyCheckInCalendarGraphic className="daily-check-in-desktop__banner-art" />
          <p className="daily-check-in-desktop__banner-stat">
            <span className="daily-check-in-desktop__banner-stat-value">{checkedInCount}</span>
            <span className="daily-check-in-desktop__banner-stat-sep">/</span>
            <span>7</span>
            <span className="daily-check-in-desktop__banner-stat-label">วัน</span>
          </p>
        </div>

        <button
          type="button"
          disabled={!todayReward}
          onClick={() => todayReward && onClaimDay(todayReward.day)}
          className="daily-check-in-desktop__banner-cta cosmic-cta-primary cosmic-cta-primary--sm w-full"
        >
          {todayReward ? "รับรางวัลวันนี้" : "รับรางวัลแล้ว"}
        </button>

        <ol className="daily-check-in-desktop__streak" aria-label="ความคืบหน้า 7 วัน">
          {days.map((day) => {
            const claimed = day.status === "claimed";
            const isToday = day.status === "today";
            return (
              <li key={day.day} className="daily-check-in-desktop__streak-item">
                <span
                  className={`daily-check-in-desktop__streak-dot${
                    claimed ? " is-claimed" : isToday ? " is-today" : ""
                  }`}
                >
                  {claimed ? "✓" : day.day}
                </span>
                <span className="daily-check-in-desktop__streak-label">วันที่ {day.day}</span>
              </li>
            );
          })}
        </ol>

        <p className="daily-check-in-desktop__terms-hint">{DAILY_CHECKIN_TERMS[0]}</p>
      </aside>

      <div className="daily-check-in-desktop__main min-h-0">
        <div className="daily-check-in-desktop__main-head">
          <h3 className="daily-check-in-desktop__main-title">รายการเช็คอิน</h3>
          {claimMessage ? (
            <p className="daily-check-in-desktop__claim-msg" role="status">{claimMessage}</p>
          ) : null}
        </div>

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

  return (
    <li
      className={`daily-check-in-desktop__day-row hub-desktop-card glass-card--soft${
        isToday ? " is-today" : ""
      }${isClaimed ? " is-claimed" : ""}`}
    >
      <div
        className={`daily-check-in-desktop__day-badge${isToday ? " is-today" : ""}${
          isClaimed ? " is-claimed" : ""
        }`}
        aria-hidden="true"
      >
        <span className="daily-check-in-desktop__day-badge-num">{day.day}</span>
      </div>

      <div className="daily-check-in-desktop__day-body min-w-0">
        <p className="daily-check-in-desktop__day-title">
          วันที่ {day.day}
          {isBonusDay ? " · รางวัลพิเศษ" : ""}
        </p>
        <p className="daily-check-in-desktop__day-reward">{formatCheckInCredits(day.credits)}</p>
        <p className="daily-check-in-desktop__day-desc">
          {isBonusDay ? "เช็คอินครบสัปดาห์ รับเครดิตโบนัส" : "รางวัลเช็คอินประจำวัน"}
        </p>
      </div>

      <div className="daily-check-in-desktop__day-visual" aria-hidden="true">
        <CheckInCoinGraphic className="h-11 w-11" />
      </div>

      <div className="daily-check-in-desktop__day-action">
        {isClaimed ? (
          <span className="daily-check-in-desktop__claim-pill is-done">รับแล้ว</span>
        ) : isToday ? (
          <button type="button" className="daily-check-in-desktop__claim-btn cosmic-cta-primary cosmic-cta-primary--sm" onClick={onClaim}>
            รับรางวัล
          </button>
        ) : (
          <span className="daily-check-in-desktop__claim-pill is-locked">ล็อค</span>
        )}
      </div>
    </li>
  );
}
