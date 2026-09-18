"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { YikiRound } from "@/app/types/yiki";
import { LotteryCountdown, LotteryFlagOrb } from "../LotteryFlagOrb";
import { formatCountdown } from "../lotteryUtils";

/**
 * รายการรอบแทงหวยยี่กี 15 นาที — งวดถัดไปเด่นด้านบน ตามด้วยงวดคิวหลัง
 * กดเข้ารอบไหนไปหน้าแทง /lottery/yiki-15/[roundId]
 */
export function YikiRoundList({ rounds, basePath }: { rounds: YikiRound[]; basePath: string }) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  // เริ่มนับหลัง mount เท่านั้น ให้ markup จาก server ตรงกับ client
  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const [nextRound, ...upcomingRounds] = rounds;

  return (
    <div className="flex flex-col gap-6">
      {nextRound ? (
        <Link href={`${basePath}/${nextRound.id}`} className="yiki-round-card yiki-round-card--next">
          <LotteryFlagOrb label="YK" tone="gold" size="lg" />
          <span className="yiki-round-card__body">
            <span className="yiki-round-card__eyebrow">รอบถัดไป</span>
            <span className="yiki-round-card__label">{nextRound.label}</span>
          </span>
          <LotteryCountdown
            label={
              nowMs === null
                ? "--:--"
                : formatCountdown(new Date(nextRound.closeAt).getTime() - nowMs)
            }
          />
        </Link>
      ) : null}

      {upcomingRounds.length > 0 ? (
        <section aria-label="งวดคิวถัดไป">
          <h2 className="mb-3 text-sm font-bold text-[var(--text-secondary)]">งวดคิวถัดไป</h2>
          <ul className="yiki-round-list">
            {upcomingRounds.map((round) => (
              <li key={round.id}>
                <Link href={`${basePath}/${round.id}`} className="yiki-round-card">
                  <LotteryFlagOrb label="YK" tone="gold" size="sm" />
                  <span className="yiki-round-card__body">
                    <span className="yiki-round-card__label">{round.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
