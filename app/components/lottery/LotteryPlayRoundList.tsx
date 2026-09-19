"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LotteryPlayRound } from "@/app/types/lottery";
import { lotteryMarketUsesRoundGrid } from "@/app/data/lotteryRoundsMockData";
import { formatCountdown } from "./lotteryUtils";

const GRID_INITIAL_VISIBLE = 24;
const GRID_LAYOUT_MIN_ROUNDS = 8;

interface LotteryPlayRoundListProps {
  rounds: LotteryPlayRound[];
  marketSlug: string;
  /** path ก่อน round id เช่น /lottery/thai-government */
  basePath: string;
}

function formatRoundClock(iso: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

/**
 * รายการรอบ step 2 — แบบการ์ด (รอบน้อย) หรือกริด + ขยาย (ยี่กี)
 */
export function LotteryPlayRoundList({ rounds, marketSlug, basePath }: LotteryPlayRoundListProps) {
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const useGridLayout =
    lotteryMarketUsesRoundGrid(marketSlug) || rounds.length >= GRID_LAYOUT_MIN_ROUNDS;

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

  if (rounds.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-secondary)]">ยังไม่มีรอบที่เปิดรับแทง</p>
    );
  }

  if (useGridLayout) {
    return (
      <div className="lottery-play-rounds lottery-play-rounds--grid-mode">
        <ul className="lottery-play-round-grid" aria-label="รายการรอบ">
          {visibleGridRounds.map((round, index) => {
            const playable = round.status === "open";
            const countdown =
              nowMs === null
                ? "--:--"
                : formatCountdown(new Date(round.closeAt).getTime() - nowMs);
            const className = `lottery-play-round-grid__cell${
              playable ? " is-playable" : ""
            }${round.status === "open" ? " is-open" : ""}`;

            const inner = (
              <>
                <span className="lottery-play-round-grid__round">
                  {round.drawLabel.replace(/^รอบ\s*/, "รอบ ") || `รอบ ${index + 1}`}
                </span>
                <span className="lottery-play-round-grid__time">{formatRoundClock(round.closeAt)}</span>
                <span className="lottery-play-round-grid__countdown tabular-nums">{countdown}</span>
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
            className="lottery-play-rounds__expand glass-control glass-pill"
            onClick={() => setShowAllGrid(true)}
          >
            แสดงรอบทั้งหมด ({rounds.length} รอบ)
            <span className="lottery-play-rounds__expand-chevron" aria-hidden="true">▼</span>
          </button>
        ) : null}
      </div>
    );
  }

  const openRounds = rounds.filter((round) => round.status === "open");
  const otherRounds = rounds.filter((round) => round.status !== "open");

  return (
    <div className="lottery-play-rounds flex flex-col gap-4">
      {openRounds.map((round) => (
        <article key={round.id} className="lottery-play-round-card lottery-play-round-card--open">
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
            className="cosmic-btn-nav cosmic-btn-nav--lg lottery-play-round-card__cta"
          >
            แทงหวย
          </Link>
        </article>
      ))}

      {otherRounds.length > 0 ? (
        <section aria-label="รอบถัดไป">
          <h2 className="mb-3 text-sm font-bold text-[var(--text-secondary)]">รอบถัดไป</h2>
          <ul className="lottery-play-rounds__queue">
            {otherRounds.map((round) => (
              <li key={round.id}>
                <article
                  className={`lottery-play-round-card${
                    round.status === "upcoming" ? " lottery-play-round-card--upcoming" : ""
                  }`}
                >
                  <div className="lottery-play-round-card__content">
                    <p className="lottery-play-round-card__title">{round.drawLabel}</p>
                    <p className="lottery-play-round-card__schedule">{round.scheduleLabel}</p>
                    {round.status === "upcoming" ? (
                      <p className="lottery-play-round-card__opens">
                        เปิดแทง{" "}
                        {new Intl.DateTimeFormat("th-TH", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Bangkok",
                        }).format(new Date(round.openAt))}
                      </p>
                    ) : (
                      <p className="lottery-play-round-card__opens">ปิดรับแทงแล้ว</p>
                    )}
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
