"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LotteryPlayRound } from "@/app/types/lottery";
import {
  LOTTERY_LOW_FREQ_MAX_ROUNDS,
  lotteryMarketUsesRoundGrid,
} from "@/app/data/lotteryRoundsMockData";
import { formatBangkokTimeHHmm, formatCountdown } from "./lotteryUtils";

const GRID_INITIAL_VISIBLE = 24;

interface LotteryPlayRoundListProps {
  rounds: LotteryPlayRound[];
  marketSlug: string;
  /** path ก่อน round id เช่น /lottery/thai-government */
  basePath: string;
}

function formatRoundClock(iso: string): string {
  return formatBangkokTimeHHmm(iso);
}

/**
 * รายการรอบ step 2 — แบบการ์ด (รอบน้อย) หรือกริด + ขยาย (ยี่กี)
 */
export function LotteryPlayRoundList({ rounds, marketSlug, basePath }: LotteryPlayRoundListProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const useGridLayout = lotteryMarketUsesRoundGrid(marketSlug);

  const cardRounds = useMemo(() => {
    if (useGridLayout) return rounds;
    return rounds.slice(0, LOTTERY_LOW_FREQ_MAX_ROUNDS);
  }, [rounds, useGridLayout]);

  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleGridRounds = useMemo(() => {
    if (!useGridLayout) return rounds;
    if (showAllGrid) return rounds;
    return rounds.slice(0, GRID_INITIAL_VISIBLE);
  }, [rounds, showAllGrid, useGridLayout]);

  const hiddenGridCount = useGridLayout ? Math.max(0, rounds.length - GRID_INITIAL_VISIBLE) : 0;

  if (cardRounds.length === 0 && !useGridLayout) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ยังไม่มีรอบที่เปิดรับแทง</p>
    );
  }

  if (rounds.length === 0 && useGridLayout) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ยังไม่มีรอบที่เปิดรับแทง</p>
    );
  }

  if (useGridLayout) {
    return (
      <div className="lottery-play-rounds lottery-play-rounds--grid-mode gap-2">
        <ul
          className="lottery-play-round-grid grid grid-cols-2 gap-2 m-0 p-0 list-none min-[480px]:grid-cols-3 md:grid-cols-4 md:gap-3"
          aria-label="รายการรอบ"
        >
          {visibleGridRounds.map((round, index) => {
            const playable = round.status === "open";
            const countdown =
              nowMs === null
                ? "--:--"
                : formatCountdown(new Date(round.closeAt).getTime() - nowMs);
            const className = `lottery-play-round-grid__cell flex flex-col items-center justify-center gap-[0.35rem] min-h-[5.5rem] px-1 py-2 text-center${
              playable ? " is-playable" : ""
            }${round.status === "open" ? " is-open" : ""}`;

            const inner = (
              <>
                <span className="lottery-play-round-grid__round">
                  {round.drawLabel.replace(/^รอบ\s*/, "รอบ ") || `รอบ ${index + 1}`}
                </span>
                <span className="lottery-play-round-grid__time">{formatRoundClock(round.closeAt)}</span>
                <span className="lottery-play-round-grid__countdown inline-flex min-w-[4.5rem] justify-center px-[0.45rem] py-[0.2rem] tabular-nums">
                  {countdown}
                </span>
              </>
            );

            return (
              <li key={round.id}>
                {playable ? (
                  <Link href={`${basePath}/${round.id}`} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <div className={className} aria-disabled="true">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {!showAllGrid && hiddenGridCount > 0 ? (
          <button
            type="button"
            className="lottery-play-rounds__expand glass-control glass-pill flex w-full min-h-11 items-center justify-center gap-[0.35rem] mt-3"
            onClick={() => setShowAllGrid(true)}
          >
            แสดงรอบทั้งหมด ({rounds.length} รอบ)
            <span className="lottery-play-rounds__expand-chevron" aria-hidden="true">▼</span>
          </button>
        ) : null}
      </div>
    );
  }

  const openRounds = cardRounds.filter((round) => round.status === "open");
  const otherRounds = cardRounds.filter((round) => round.status !== "open");

  return (
    <div className="lottery-play-rounds flex flex-col gap-4">
      {openRounds.map((round) => (
        <article
          key={round.id}
          className="lottery-play-round-card lottery-play-round-card--open flex flex-col gap-3 p-3"
        >
          <div className="lottery-play-round-card__content">
            <p className="lottery-play-round-card__title">{round.drawLabel}</p>
            <p className="lottery-play-round-card__schedule">{round.scheduleLabel}</p>
            {nowMs !== null ? (
              <p className="lottery-play-round-card__countdown">
                ปิดรับใน {formatCountdown(new Date(round.closeAt).getTime() - nowMs)}
              </p>
            ) : null}
          </div>
          <Link
            href={`${basePath}/${round.id}`}
            className="cosmic-btn-nav cosmic-btn-nav--lg lottery-play-round-card__cta w-full max-w-[12rem]"
          >
            แทงหวย
          </Link>
        </article>
      ))}

      {otherRounds.length > 0 ? (
        <section className="lottery-play-rounds__upcoming" aria-label="รอบถัดไป">
          <ul className="lottery-play-rounds__queue">
            {otherRounds.map((round) => (
              <li key={round.id}>
                <article
                  className={`lottery-play-round-card flex flex-col gap-3 p-3${
                    round.status === "upcoming" ? " lottery-play-round-card--upcoming" : ""
                  }`}
                >
                  <div className="lottery-play-round-card__content">
                    <p className="lottery-play-round-card__title">{round.drawLabel}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
