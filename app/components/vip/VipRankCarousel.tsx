"use client";

import React from "react";
import type { VipRankId } from "@/app/types/vip";
import {
  formatVipAmount,
  getVipRankViewStatus,
  getVipTurnoverTarget,
} from "@/app/data/vipMockData";
import { fetchVipRanks } from "@/lib/api/vip";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";
import { VipRankEmblem } from "./VipRankEmblem";

interface VipRankCarouselProps {
  focusIndex: number;
  onFocusChange: (index: number) => void;
  playerRankId: VipRankId;
}

/**
 * แรงค์กลาง + ปุ่มเลื่อน — แท็บแร็งค์ (ไม่โชว์ขอบแรงค์ข้างเพื่อไม่โดนตัดใน modal)
 */
export function VipRankCarousel({
  focusIndex,
  onFocusChange,
  playerRankId,
}: VipRankCarouselProps) {
  const vipRankTiers = fetchVipRanks().tiers;
  const safeIndex = Math.max(0, Math.min(focusIndex, vipRankTiers.length - 1));
  const focused = vipRankTiers[safeIndex];
  const focusStatus = getVipRankViewStatus(focused.id, playerRankId);
  const isLocked = focusStatus === "locked";
  const isCleared = focusStatus === "cleared";
  const isActive = focusStatus === "active";

  const goPrev = () => {
    if (safeIndex > 0) onFocusChange(safeIndex - 1);
  };

  const goNext = () => {
    if (safeIndex < vipRankTiers.length - 1) onFocusChange(safeIndex + 1);
  };

  const statusLabel = isActive
    ? "ระดับปัจจุบัน"
    : isCleared
      ? "ผ่านแล้ว"
      : "ยังไม่ถึง";

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < vipRankTiers.length - 1;

  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-xs">
      <button
        type="button"
        onClick={goPrev}
        disabled={!canPrev}
        className="absolute left-0 top-[42%] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)]/80 hover:text-[var(--icon-active)] disabled:pointer-events-none disabled:opacity-0"
        aria-label="แรงค์ก่อนหน้า"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={!canNext}
        className="absolute right-0 top-[42%] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)]/80 hover:text-[var(--icon-active)] disabled:pointer-events-none disabled:opacity-0"
        aria-label="แรงค์ถัดไป"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center gap-2 px-11 py-2 text-center">
        <VipRankEmblem
          rankId={focused.id}
          size="xl"
          inactive={isLocked}
          playing={!isLocked}
        />
        <p
          className={`text-2xl font-medium tracking-[0.15em] sm:text-[1.65rem] ${
            isLocked ? "text-[var(--text-muted)]" : ""
          }`}
          style={isLocked ? undefined : { color: focused.accent }}
        >
          {focused.label}
        </p>
        <p
          className={`text-xs font-medium sm:text-sm ${
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
          <p className="text-xs text-[var(--text-muted)]">
            เทิร์น {formatVipAmount(getVipTurnoverTarget(focused.id))}
          </p>
        )}
      </div>
    </div>
  );
}
