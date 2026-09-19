"use client";

import React from "react";
import type { VipRankId } from "@/app/types/vip";
import {
  formatVipAmount,
  getVipRankViewStatus,
  getVipTurnoverTarget,
  VIP_RANK_TIERS,
} from "@/app/data/vipMockData";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";
import { VipRankEmblem } from "./VipRankEmblem";

interface VipRankCarouselProps {
  focusIndex: number;
  onFocusChange: (index: number) => void;
  playerRankId: VipRankId;
}

/**
 * แถวแรงค์กลาง + แรงค์ข้างซ้าย/ขวา (มืดๆ โผล่ขอบ) — แท็บแร็งค์
 */
export function VipRankCarousel({
  focusIndex,
  onFocusChange,
  playerRankId,
}: VipRankCarouselProps) {
  const safeIndex = Math.max(0, Math.min(focusIndex, VIP_RANK_TIERS.length - 1));
  const focused = VIP_RANK_TIERS[safeIndex];
  const prevTier = safeIndex > 0 ? VIP_RANK_TIERS[safeIndex - 1] : null;
  const nextTier = safeIndex < VIP_RANK_TIERS.length - 1 ? VIP_RANK_TIERS[safeIndex + 1] : null;
  const focusStatus = getVipRankViewStatus(focused.id, playerRankId);
  const isLocked = focusStatus === "locked";
  const isCleared = focusStatus === "cleared";
  const isActive = focusStatus === "active";

  const goPrev = () => {
    if (safeIndex > 0) onFocusChange(safeIndex - 1);
  };

  const goNext = () => {
    if (safeIndex < VIP_RANK_TIERS.length - 1) onFocusChange(safeIndex + 1);
  };

  const statusLabel = isActive
    ? "ระดับปัจจุบัน"
    : isCleared
      ? "ผ่านแล้ว"
      : "ยังไม่ถึง";

  return (
    <div className="relative w-full">
      {prevTier && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)]/80 hover:text-[var(--icon-active)]"
          aria-label="แรงค์ก่อนหน้า"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}
      {nextTier && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)]/80 hover:text-[var(--icon-active)]"
          aria-label="แรงค์ถัดไป"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}

      <div className="relative mx-8 overflow-hidden py-1">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--surface-mid)] via-[var(--surface-mid)]/90 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--surface-mid)] via-[var(--surface-mid)]/90 to-transparent"
          aria-hidden="true"
        />

        <div className="flex items-end justify-center gap-0">
          <div
            className={`flex w-[72px] shrink-0 flex-col items-center pb-2 transition-all ${
              prevTier
                ? "translate-x-3 scale-[0.72] opacity-[0.28] saturate-50"
                : "invisible"
            }`}
          >
            {prevTier && (
              <button
                type="button"
                onClick={goPrev}
                className="flex flex-col items-center gap-1"
                aria-label={`ดู ${prevTier.label}`}
              >
                <VipRankEmblem
                  rankId={prevTier.id}
                  size="sm"
                  inactive={getVipRankViewStatus(prevTier.id, playerRankId) === "locked"}
                  playing={false}
                />
                <span className="text-[9px] font-medium tracking-wide text-[var(--text-muted)]">
                  {prevTier.label}
                </span>
              </button>
            )}
          </div>

          <div
            className={`relative z-[5] flex min-w-[120px] flex-col items-center gap-1 px-2 ${
              isLocked ? "opacity-90" : ""
            }`}
          >
            <VipRankEmblem
              rankId={focused.id}
              size="lg"
              inactive={isLocked}
              playing={!isLocked}
            />
            <p
              className={`text-xl font-medium tracking-[0.15em] ${
                isLocked ? "text-[var(--text-muted)]" : ""
              }`}
              style={isLocked ? undefined : { color: focused.accent }}
            >
              {focused.label}
            </p>
            <p
              className={`text-[11px] font-medium ${
                isActive
                  ? "text-[var(--text-secondary)]"
                  : isCleared
                    ? "text-[var(--success)]"
                    : "text-[var(--text-muted)]"
              }`}
            >
              {statusLabel}
            </p>
            {!isActive && focused.id !== "silver" && (
              <p className="text-[10px] text-[var(--text-muted)]">
                เทิร์น {formatVipAmount(getVipTurnoverTarget(focused.id))}
              </p>
            )}
          </div>

          <div
            className={`flex w-[72px] shrink-0 flex-col items-center pb-2 transition-all ${
              nextTier
                ? "-translate-x-3 scale-[0.72] opacity-[0.28] saturate-50"
                : "invisible"
            }`}
          >
            {nextTier && (
              <button
                type="button"
                onClick={goNext}
                className="flex flex-col items-center gap-1"
                aria-label={`ดู ${nextTier.label}`}
              >
                <VipRankEmblem
                  rankId={nextTier.id}
                  size="sm"
                  inactive={getVipRankViewStatus(nextTier.id, playerRankId) === "locked"}
                  playing={false}
                />
                <span className="text-[9px] font-medium tracking-wide text-[var(--text-muted)]">
                  {nextTier.label}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
