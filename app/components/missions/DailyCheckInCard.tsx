"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CloseIcon } from "@/app/components/ui/Icons";
import { responsiveSheetCloseButtonClass } from "@/app/components/ui/responsiveSheetDialog";
import {
  DAILY_CHECKIN_INITIAL,
  CUMULATIVE_CHECKIN_MILESTONES,
  countCheckedInDays,
  type DailyCheckInDayReward,
} from "@/app/data/dailyCheckInMockData";
import { cn } from "@/lib/utils";

interface DailyCheckInCardProps {
  onClose?: () => void;
  className?: string;
  isStandalone?: boolean;
}

export function DailyCheckInCard({
  onClose,
  className,
  isStandalone = false,
}: DailyCheckInCardProps) {
  const [days, setDays] = useState<DailyCheckInDayReward[]>(DAILY_CHECKIN_INITIAL);
  const [justClaimed, setJustClaimed] = useState<number | null>(null);

  const checkedInCount = countCheckedInDays(days);
  const todayReward = days.find((d) => d.status === "today");
  const isTodayClaimed = !todayReward && checkedInCount > 0;
  const daysRemainingForBonus = Math.max(0, 7 - checkedInCount);

  const handleClaim = (dayNum?: number) => {
    const targetDay = dayNum ?? todayReward?.day;
    if (!targetDay) return;

    const reward = days.find((d) => d.day === targetDay);
    if (!reward || reward.status !== "today") return;

    const nextDay = reward.day + 1;
    setDays((prev) =>
      prev.map((item) => {
        if (item.day === targetDay && item.status === "today") {
          return { ...item, status: "claimed" };
        }
        if (item.day === nextDay && item.status === "locked") {
          return { ...item, status: "today" };
        }
        return item;
      }),
    );
    setJustClaimed(targetDay);
    setTimeout(() => setJustClaimed(null), 1500);
  };

  const progressPercent = Math.min(100, Math.max(10, (checkedInCount / 7) * 100));

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[500px] text-[var(--text-primary)] select-none p-4 sm:p-5",
        isStandalone && [
          "rounded-[24px] border border-[color-mix(in_srgb,var(--hub-modal-accent)_32%,rgb(255_255_255_/_0.1))]",
          "bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--hub-modal-lift)_62%,rgb(98_94_112)_38%)_0%,transparent_46%),linear-gradient(148deg,color-mix(in_srgb,var(--hub-modal-base)_70%,var(--hub-modal-lift))_0%,var(--hub-modal-base)_50%,#09090c_100%)]",
          "shadow-[0_30px_80px_rgba(0,0,0,0.68),inset_0_0_0_1px_rgba(255,255,255,0.02),0_0_36px_rgba(31,30,40,0.28)]",
          "backdrop-blur-[22px]",
        ],
        className,
      )}
    >
      {/* ── Close Button (matching hub modal close buttons) ── */}
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            responsiveSheetCloseButtonClass(),
            "absolute right-3.5 top-3.5 z-20 cursor-pointer text-[var(--icon-default)] hover:text-white",
          )}
          aria-label="ปิด"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : null}

      {/* ── Top Header Section ── */}
      <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 pt-0.5">
          {/* Icon & Title */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#7747e5]/35 bg-[#7747e5]/15 text-[#7747e5] shadow-[0_0_14px_rgba(119,71,229,0.25)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-5.5 sm:w-5.5"
              >
                <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)]">
              เช็คอินรายวัน
            </h2>
          </div>

          <p className="mt-1.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)] leading-snug">
            เช็คอินต่อเนื่องรับเพชรโบนัสพิเศษ
          </p>
          <p className="mt-0.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-snug">
            อีก <span className="font-medium text-white">{daysRemainingForBonus} วัน</span> ได้โบนัส{" "}
            <span className="font-medium text-[#a78bfa]">เพชร 20</span>
          </p>
        </div>

        {/* 3D Diamond & Luxury Gift Boxes Illustration */}
        <div className="relative -mt-1 mr-8 sm:mr-9 h-16 w-20 sm:h-18 sm:w-24 shrink-0 pointer-events-none flex items-center justify-center">
          <Image
            src="/assets/3d/diamon3.avif"
            alt="Diamonds"
            fill
            sizes="120px"
            priority
            className="object-contain drop-shadow-[0_4px_16px_rgba(119,71,229,0.35)]"
          />
        </div>
      </div>

      {/* ── Weekly Streak Progress Bar ── */}
      <div className="relative z-10 mt-3 mb-2.5 flex items-center justify-between gap-3">
        <div className="relative h-2 sm:h-2.5 flex-1 overflow-hidden rounded-full bg-black/40 border border-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7747e5] to-[#5b8cff] shadow-[0_0_10px_rgba(119,71,229,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-xs sm:text-sm font-medium tabular-nums">
          <span className="text-white">{checkedInCount}</span>
          <span className="text-[var(--text-muted)] font-medium"> / 7 วัน</span>
        </span>
      </div>

      {/* ── 7-Day Grid (จ. - อา.) ── */}
      <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((item) => {
          const isClaimed = item.status === "claimed";
          const isToday = item.status === "today";
          const isLocked = item.status === "locked";
          const isBig = item.isBigReward || item.day === 7;

          return (
            <div
              key={item.day}
              onClick={() => isToday && handleClaim(item.day)}
              className={cn(
                "group relative flex flex-col items-center justify-between rounded-xl py-2 px-1 text-center transition-all duration-200",
                isClaimed && [
                  "border border-[#7747e5]/30 bg-gradient-to-b from-[#1c162b] to-[#110e1a]",
                  "shadow-[inset_0_1px_0_rgba(119,71,229,0.1)]",
                ],
                isToday && [
                  "border-1.5 border-[#7747e5] bg-gradient-to-b from-[#261c3e] to-[#14101e] cursor-pointer",
                  "shadow-[0_0_16px_rgba(119,71,229,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] scale-[1.02] ring-1 ring-[#7747e5]/50",
                ],
                isLocked && [
                  "border border-white/8 bg-gradient-to-b from-[#1c1a24] to-[#121017] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] opacity-85 hover:border-white/15",
                ],
                justClaimed === item.day && "scale-105 ring-2 ring-[#7747e5]",
              )}
            >
              {/* Checkmark Badge for Claimed */}
              {isClaimed ? (
                <div
                  className="absolute -top-1.5 -right-1 z-20 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full border border-[#7747e5] bg-[#1a1230] text-[#c4b5fd] shadow-[0_0_8px_rgba(119,71,229,0.4)]"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : null}

              {/* Day Label */}
              <span
                className={cn(
                  "text-xs sm:text-[13px] font-medium leading-tight",
                  isClaimed ? "text-[#c4b5fd]" : isToday ? "text-white" : "text-[var(--text-secondary)]",
                )}
              >
                {item.label}
              </span>

              {/* Diamond Image */}
              <div className="relative my-0.5 sm:my-1 flex h-7.5 w-7.5 sm:h-9 sm:w-9 items-center justify-center">
                <Image
                  src={isBig ? "/assets/3d/diamonds.avif" : "/assets/3d/diamond.avif"}
                  alt={isBig ? "Diamonds Gift Box" : "Diamond"}
                  width={isBig ? 40 : 32}
                  height={isBig ? 40 : 32}
                  className={cn(
                    "object-contain transition-transform duration-200",
                    isClaimed
                      ? "drop-shadow-[0_0_8px_rgba(119,71,229,0.5)]"
                      : isToday
                        ? "drop-shadow-[0_0_12px_rgba(119,71,229,0.8)] scale-110"
                        : "opacity-75 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
                  )}
                />
              </div>

              {/* Reward Amount */}
              <span
                className={cn(
                  "text-xs sm:text-[13px] font-medium leading-tight mb-1 tabular-nums",
                  isClaimed ? "text-[#d8b4fe]" : isToday ? "text-white" : "text-[var(--text-secondary)]",
                )}
              >
                +{item.credits}
              </span>

              {/* Action Button/Tag */}
              <div
                className={cn(
                  "w-full rounded py-0.5 text-center text-xs font-medium transition-all whitespace-nowrap",
                  isClaimed && "border border-[#7747e5]/30 bg-[#7747e5]/15 text-[#c4b5fd]",
                  isToday &&
                    "bg-gradient-to-r from-[#7747e5] to-[#5b8cff] text-white shadow-[0_0_10px_rgba(119,71,229,0.5)] group-hover:brightness-110 font-medium",
                  isLocked && "bg-white/6 text-[var(--text-muted)]",
                )}
              >
                {isClaimed ? "รับแล้ว" : isToday ? "กดรับ" : "รอรับ"}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Cumulative Rewards Box (รางวัลเช็คอินสะสม) ── */}
      <div className="hub-modal-card relative z-10 my-3 sm:my-3.5 rounded-2xl border border-white/8 bg-gradient-to-b from-[#1a1824]/90 to-[#121018]/90 p-3 sm:p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_28px_rgba(0,0,0,0.28)]">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[#7747e5] text-xs">✦</span>
            <span className="text-base">🎁</span>
            <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
              รางวัลเช็คอินสะสม
            </h3>
            <span className="text-[#7747e5] text-xs">✦</span>
          </div>
          <p className="mt-0.5 text-xs sm:text-[13px] text-[var(--text-secondary)]">
            เช็คอินครบตามกำหนด รับเพชรโบนัสใหญ่
          </p>
        </div>

        {/* 4 Milestones Timeline */}
        <div className="relative mt-3.5 flex items-center justify-between px-1.5 sm:px-3">
          {/* Horizontal Connecting Track */}
          <div className="absolute left-6 right-6 top-[34px] sm:top-[38px] h-0.5 bg-white/10" />
          <div
            className="absolute left-6 top-[34px] sm:top-[38px] h-0.5 bg-gradient-to-r from-[#7747e5] to-[#5b8cff] shadow-[0_0_8px_rgba(119,71,229,0.6)] transition-all duration-500"
            style={{
              width: checkedInCount >= 7 ? "30%" : "8%",
            }}
          />

          {CUMULATIVE_CHECKIN_MILESTONES.map((m, idx) => {
            const isReached = checkedInCount >= m.milestoneDay || idx === 0;

            return (
              <div
                key={m.milestoneDay}
                className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5"
              >
                {/* Reward Badge */}
                <div
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs sm:text-[12.5px] font-medium tabular-nums transition-all whitespace-nowrap",
                    isReached
                      ? "border border-[#7747e5]/40 bg-[#7747e5]/20 text-[#e9d5ff] shadow-[0_0_8px_rgba(119,71,229,0.25)]"
                      : "border border-white/8 bg-[#14121a] text-[var(--text-muted)]",
                  )}
                >
                  เพชร {m.gemsReward}
                </div>

                {/* Milestone Node Circle */}
                <div
                  className={cn(
                    "flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-full transition-all overflow-hidden p-1",
                    isReached
                      ? "border-2 border-[#7747e5] bg-gradient-to-b from-[#251842] to-[#120e20] shadow-[0_0_12px_rgba(119,71,229,0.5)]"
                      : "border border-white/10 bg-[#14121a]",
                  )}
                >
                  {isReached ? (
                    <div className="relative h-5.5 w-5.5 sm:h-6 sm:w-6">
                      <Image
                        src="/assets/3d/diamonds.avif"
                        alt="Gift Box"
                        fill
                        sizes="32px"
                        className="object-contain drop-shadow-[0_0_6px_rgba(119,71,229,0.5)]"
                      />
                    </div>
                  ) : (
                    <div className="relative h-5 w-5 sm:h-5.5 sm:w-5.5 opacity-40 grayscale flex items-center justify-center">
                      <Image
                        src="/assets/3d/diamonds.avif"
                        alt="Locked Gift Box"
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="absolute bottom-0 right-0 h-2.5 w-2.5 text-white/90 drop-shadow"
                      >
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2Z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Milestone Label */}
                <span
                  className={cn(
                    "text-xs sm:text-[12.5px] font-medium whitespace-nowrap",
                    isReached ? "text-white" : "text-[var(--text-muted)]",
                  )}
                >
                  เช็คอิน {m.milestoneDay} วัน
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Big Action Button ── */}
      <button
        type="button"
        disabled={isTodayClaimed}
        onClick={() => todayReward && handleClaim(todayReward.day)}
        className={cn(
          "relative flex h-11 sm:h-12.5 w-full items-center justify-center gap-1.5 rounded-2xl font-medium text-base sm:text-lg transition-all duration-200",
          isTodayClaimed
            ? "border border-white/8 bg-[var(--surface-elevated)] text-[var(--text-muted)] shadow-none cursor-default opacity-60 font-medium"
            : "bg-gradient-to-r from-[#7747e5] via-[#8253ea] to-[#5b8cff] text-white shadow-[0_0_24px_rgba(119,71,229,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 active:scale-[0.99] cursor-pointer",
        )}
      >
        <span>{isTodayClaimed ? "เช็คอินแล้ววันนี้" : "กดรับรางวัลวันนี้"}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
