"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CloseIcon } from "@/app/components/ui/Icons";
import { responsiveSheetCloseButtonClass } from "@/app/components/ui/responsiveSheetDialog";
import type { CheckInData } from "@/lib/api/checkIn";
import { useCheckIn } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { cn } from "@/lib/utils";
import { COSMIC_BTN_PRIMARY } from "@/app/components/ui/cosmicButtonClasses";
import { Menu3DIcon } from "@/app/components/ui/Menu3DIcon";
import { MODAL_TITLE_LEADING_ICON_CLASS } from "@/app/components/ui/ModalTitleLeadingIcon";
import { DailyCheckInClaimSuccessDialog } from "./DailyCheckInClaimSuccessDialog";
import { countCheckedInDays } from "@/lib/domain/checkIn";
import type { DailyCheckInDayReward } from "@/app/types/checkIn";
import { useT } from "@/lib/i18n/I18nProvider";

interface DailyCheckInCardProps {
  onClose?: () => void;
  className?: string;
  isStandalone?: boolean;
}

/** การ์ดเช็คอินรายวัน — โหลดผ่าน useCheckIn แล้วส่งให้ DailyCheckInCardView */
export function DailyCheckInCard(props: DailyCheckInCardProps) {
  const t = useT("rewards");
  const checkIn = useCheckIn();
  return (
    <ResourceGate resource={checkIn} loadingLabel={t("checkIn.loading")} errorTitle={t("checkIn.loadError")}>
      {(data) => <DailyCheckInCardView {...props} checkIn={data} />}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — วันเริ่มต้นมาจาก API แล้วอัปเดตในเครื่องหลังกดรับ */
function DailyCheckInCardView({
  onClose,
  className,
  isStandalone = false,
  checkIn,
}: DailyCheckInCardProps & { checkIn: CheckInData }) {
  const t = useT("rewards");
  const [days, setDays] = useState<DailyCheckInDayReward[]>(checkIn.days);
  const [justClaimed, setJustClaimed] = useState<number | null>(null);
  const [claimSuccessCredits, setClaimSuccessCredits] = useState<number | null>(
    null,
  );

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
    setClaimSuccessCredits(reward.credits);
  };

  const progressPercent = Math.min(100, Math.max(10, (checkedInCount / 7) * 100));

  const isHubSurface = !isStandalone;
  const weekGridGap = isHubSurface ? "gap-1.5 sm:gap-2" : "gap-1 sm:gap-1.5";

  const renderDayCell = (item: DailyCheckInDayReward) => {
    const isClaimed = item.status === "claimed";
    const isToday = item.status === "today";
    const isLocked = item.status === "locked";
    const isBig = item.isBigReward || item.day === 7;

    return (
      <div
        key={item.day}
        onClick={() => isToday && handleClaim(item.day)}
        className={cn(
          "group relative flex flex-col items-center justify-between rounded-xl text-center transition-all duration-200",
          isHubSurface ? "min-h-[8rem] py-2.5 px-1 sm:min-h-[8.5rem] sm:py-3" : "min-h-[7.5rem] py-2 px-1 sm:min-h-[8rem]",
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

        <span
          className={cn(
            "font-medium leading-tight",
            isHubSurface ? "text-sm sm:text-[0.9375rem]" : "text-xs sm:text-[13px]",
            isClaimed ? "text-[#c4b5fd]" : isToday ? "text-white" : "text-[var(--text-secondary)]",
          )}
        >
          {t(item.labelKey)}
        </span>

        <div
          className={cn(
            "relative my-1 flex shrink-0 items-center justify-center sm:my-1.5",
            isHubSurface
              ? isBig
                ? "h-[3.75rem] w-[3.75rem] sm:h-[4.25rem] sm:w-[4.25rem]"
                : "h-[3.25rem] w-[3.25rem] sm:h-[3.75rem] sm:w-[3.75rem]"
              : isBig
                ? "h-14 w-14 sm:h-16 sm:w-16"
                : "h-12 w-12 sm:h-14 sm:w-14",
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-[8%] rounded-full blur-[2px]",
              isClaimed && "bg-[radial-gradient(circle,rgb(119_71_229/0.42)_0%,transparent_72%)]",
              isToday &&
                "bg-[radial-gradient(circle,rgb(91_140_255/0.5)_0%,rgb(119_71_229/0.35)_45%,transparent_75%)]",
              isLocked && "bg-[radial-gradient(circle,rgb(255_255_255/0.12)_0%,transparent_70%)]",
            )}
            aria-hidden
          />
          <Image
            src={isBig ? "/assets/check-in/diamonds.avif" : "/assets/check-in/diamond.avif"}
            alt={isBig ? "Diamonds Gift Box" : "Diamond"}
            fill
            sizes={isBig ? "80px" : "72px"}
            className={cn(
              "relative z-[1] object-contain transition-transform duration-200",
              isClaimed &&
                "drop-shadow-[0_0_14px_rgba(119,71,229,0.75)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
              isToday &&
                "scale-[1.12] drop-shadow-[0_0_20px_rgba(119,71,229,0.95)] drop-shadow-[0_0_28px_rgba(91,140,255,0.45)]",
              isLocked &&
                "opacity-90 drop-shadow-[0_0_10px_rgba(119,71,229,0.25)] drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]",
            )}
          />
        </div>

        <span
          className={cn(
            "font-medium leading-tight mb-1 tabular-nums",
            isHubSurface ? "text-sm sm:text-[0.9375rem]" : "text-xs sm:text-[13px]",
            isClaimed ? "text-[#d8b4fe]" : isToday ? "text-white" : "text-[var(--text-secondary)]",
          )}
        >
          +{item.credits}
        </span>

        <div
          className={cn(
            "w-full rounded text-center font-medium transition-all whitespace-nowrap",
            isHubSurface ? "py-1 text-xs sm:text-sm" : "py-0.5 text-xs",
            isClaimed && "border border-[#7747e5]/30 bg-[#7747e5]/15 text-[#c4b5fd]",
            isToday &&
              "bg-gradient-to-r from-[#7747e5] to-[#5b8cff] text-white shadow-[0_0_10px_rgba(119,71,229,0.5)] group-hover:brightness-110 font-medium",
            isLocked && "bg-white/6 text-[var(--text-muted)]",
          )}
        >
          {t(`checkIn.dayStatus.${item.status}`)}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "daily-check-in-card relative mx-auto w-full text-[var(--text-primary)] select-none",
        isStandalone
          ? "max-w-[500px] bg-transparent px-0 py-1 shadow-none"
          : [
              "daily-check-in-card--hub max-w-none border-0 rounded-none p-5 sm:p-6 lg:px-8 lg:py-7",
              "bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--hub-modal-lift)_62%,rgb(98_94_112)_38%)_0%,transparent_46%),linear-gradient(148deg,color-mix(in_srgb,var(--hub-modal-base)_70%,var(--hub-modal-lift))_0%,var(--hub-modal-base)_50%,#09090c_100%)]",
              "shadow-none backdrop-blur-0",
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
            "absolute right-4 top-4 z-20 cursor-pointer text-[var(--icon-default)] hover:text-white sm:right-5 sm:top-5",
          )}
          aria-label={t("actions.close")}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      ) : null}

      {/* ── Top Header Section ── */}
      <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 pt-0.5">
          {/* Icon & Title */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Menu3DIcon
              iconId="check-in"
              size={isHubSurface ? 48 : 40}
              className={cn(
                MODAL_TITLE_LEADING_ICON_CLASS,
                isHubSurface ? "!h-11 !w-11 sm:!h-12 sm:!w-12" : "!h-9 !w-9 sm:!h-10 sm:!w-10",
              )}
            />
            <h2
              className={cn(
                "font-medium tracking-tight text-[var(--text-primary)]",
                isHubSurface ? "text-2xl sm:text-[1.75rem]" : "text-xl sm:text-2xl",
              )}
            >
              {t("checkIn.title")}
            </h2>
          </div>

          <p
            className={cn(
              "mt-2 font-medium text-[var(--text-secondary)] leading-snug",
              isHubSurface ? "text-sm sm:text-base" : "mt-1.5 text-xs sm:text-sm",
            )}
          >
            {t("checkIn.subtitle")}
          </p>
          <p
            className={cn(
              "text-[var(--text-secondary)] leading-snug",
              isHubSurface ? "mt-1 text-sm sm:text-base" : "mt-0.5 text-xs sm:text-sm",
            )}
          >
            {t("checkIn.bonusBefore")}{" "}
            <span className="font-medium text-white">
              {t("checkIn.bonusDays", { count: daysRemainingForBonus })}
            </span>{" "}
            {t("checkIn.bonusAfter")}{" "}
            <span className="font-medium text-[#a78bfa]">{t("checkIn.bonusGems", { amount: 20 })}</span>
          </p>
        </div>

        {/* 3D Diamond & Luxury Gift Boxes Illustration */}
        <div
          className={cn(
            "relative -mt-1 shrink-0 pointer-events-none flex items-center justify-center",
            isHubSurface
              ? "mr-9 sm:mr-10 h-[4.5rem] w-[5.5rem] sm:h-20 sm:w-28"
              : "mr-8 sm:mr-9 h-16 w-20 sm:h-18 sm:w-24",
          )}
        >
          <Image
            src="/assets/check-in/diamon3.avif"
            alt="Diamonds"
            fill
            sizes="120px"
            preload
            className="object-contain drop-shadow-[0_4px_16px_rgba(119,71,229,0.35)]"
          />
        </div>
      </div>

      {/* ── Weekly Streak Progress Bar ── */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-between gap-3",
          isHubSurface ? "mt-4 mb-3.5" : "mt-3 mb-2.5",
        )}
      >
        <div
          className={cn(
            "relative flex-1 overflow-hidden rounded-full bg-black/40 border border-white/8",
            isHubSurface ? "h-2.5 sm:h-3" : "h-2 sm:h-2.5",
          )}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7747e5] to-[#5b8cff] shadow-[0_0_10px_rgba(119,71,229,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span
          className={cn(
            "shrink-0 font-medium tabular-nums",
            isHubSurface ? "text-sm sm:text-base" : "text-xs sm:text-sm",
          )}
        >
          <span className="text-white">{checkedInCount}</span>
          <span className="text-[var(--text-muted)] font-medium"> {t("checkIn.progressTotal", { total: 7 })}</span>
        </span>
      </div>

      {/* ── 7-Day Grid — แถวบน 3 วัน · แถวล่าง 4 วัน ── */}
      <div className={cn("daily-check-in-week-grid relative z-10 flex flex-col", weekGridGap)}>
        <div className={cn("grid grid-cols-3", weekGridGap)}>
          {days.slice(0, 3).map((item) => renderDayCell(item))}
        </div>
        <div className={cn("grid grid-cols-4", weekGridGap)}>
          {days.slice(3, 7).map((item) => renderDayCell(item))}
        </div>
      </div>

      {/* ── Cumulative Rewards Box (รางวัลเช็คอินสะสม) ── */}
      <div
        className={cn(
          "hub-modal-card relative z-10 rounded-2xl border border-white/8 bg-gradient-to-b from-[#1a1824]/90 to-[#121018]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_28px_rgba(0,0,0,0.28)]",
          isHubSurface ? "my-4 p-4 sm:my-5 sm:p-5" : "my-3 p-3 sm:my-3.5 sm:p-3.5",
        )}
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[#7747e5] text-xs">✦</span>
            <span className="text-base">🎁</span>
            <h3
              className={cn(
                "font-medium text-[var(--text-primary)]",
                isHubSurface ? "text-base sm:text-lg" : "text-sm sm:text-base",
              )}
            >
              {t("checkIn.cumulativeTitle")}
            </h3>
            <span className="text-[#7747e5] text-xs">✦</span>
          </div>
          <p
            className={cn(
              "mt-1 text-[var(--text-secondary)]",
              isHubSurface ? "text-sm sm:text-base" : "mt-0.5 text-xs sm:text-[13px]",
            )}
          >
            {t("checkIn.cumulativeDesc")}
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

          {checkIn.milestones.map((m, idx) => {
            const isReached = checkedInCount >= m.milestoneDay || idx === 0;

            return (
              <div
                key={m.milestoneDay}
                className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5"
              >
                {/* Reward Badge */}
                <div
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs sm:text-sm font-medium tabular-nums transition-all whitespace-nowrap",
                    isReached
                      ? "border border-[#7747e5]/40 bg-[#7747e5]/20 text-[#e9d5ff] shadow-[0_0_8px_rgba(119,71,229,0.25)]"
                      : "border border-white/8 bg-[#14121a] text-[var(--text-muted)]",
                  )}
                >
                  {t("checkIn.milestoneGems", { amount: m.gemsReward })}
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
                        src="/assets/check-in/diamonds.avif"
                        alt="Gift Box"
                        fill
                        sizes="32px"
                        className="object-contain drop-shadow-[0_0_6px_rgba(119,71,229,0.5)]"
                      />
                    </div>
                  ) : (
                    <div className="relative h-5 w-5 sm:h-5.5 sm:w-5.5 opacity-40 grayscale flex items-center justify-center">
                      <Image
                        src="/assets/check-in/diamonds.avif"
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
                    "text-xs sm:text-sm font-medium whitespace-nowrap",
                    isReached ? "text-white" : "text-[var(--text-muted)]",
                  )}
                >
                  {t("checkIn.milestoneDays", { days: m.milestoneDay })}
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
          COSMIC_BTN_PRIMARY,
          isHubSurface ? "text-base sm:text-lg" : "text-sm sm:text-base",
          isTodayClaimed &&
            "!border-white/8 !bg-[var(--surface-elevated)] !text-[var(--text-muted)] !shadow-none",
        )}
      >
        {isTodayClaimed ? t("checkIn.claimedToday") : t("checkIn.claimToday")}
      </button>

      <DailyCheckInClaimSuccessDialog
        open={claimSuccessCredits !== null}
        credits={claimSuccessCredits ?? 0}
        onOpenChange={(open) => {
          if (!open) setClaimSuccessCredits(null);
        }}
      />
    </div>
  );
}
