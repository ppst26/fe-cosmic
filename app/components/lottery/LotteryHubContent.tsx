"use client";

import React from "react";
import Link from "next/link";
import type {
  LotteryFeaturedItem,
  LotteryGridItem,
  LotteryResultRow,
} from "@/app/types/lottery";
import {
  LOTTERY_FEATURED_ITEMS,
  LOTTERY_GRID_ITEMS,
  LOTTERY_LATEST_RESULTS,
} from "@/app/data/lotteryHubMockData";
import { LotteryCountdown, LotteryFlagOrb } from "./LotteryFlagOrb";
import { LotteryLatestResultsTable } from "./LotteryLatestResultsTable";

interface LotteryHubContentProps {
  /** ซ่อนหัวข้อเมื่อหน้ามี SlotProvidersHeader แล้ว */
  showPageHeading?: boolean;
  featured?: LotteryFeaturedItem[];
  gridItems?: LotteryGridItem[];
  results?: LotteryResultRow[];
}

/**
 * หน้าแรกแทงหวย — feature cards · กริดประเภท · ผลหวยล่าสุด
 * ใช้ใน app/lottery/page.tsx และ LobbyCategoryProviders (หมวดหวยบนโฮม)
 */
export function LotteryHubContent({
  showPageHeading = true,
  featured = LOTTERY_FEATURED_ITEMS,
  gridItems = LOTTERY_GRID_ITEMS,
  results = LOTTERY_LATEST_RESULTS,
}: LotteryHubContentProps) {
  return (
    <div className="lottery-hub flex min-w-0 flex-col gap-6 sm:gap-8">
      {showPageHeading ? (
        <header className="lottery-hub__head min-w-0">
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--text-primary)] sm:text-xl">
            แทงหวย
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            เลือกประเภทหวยที่ต้องการแทง
          </p>
        </header>
      ) : null}

      <section className="lottery-hub__featured" aria-label="หวยแนะนำ">
        <div className="lottery-feature-grid">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`lottery-feature-card glass-card--soft lottery-feature-card--${item.visual}`}
            >
              {item.visual === "thai-gov" ? (
                <LotteryFlagOrb label="TH" tone="th" size="lg" />
              ) : (
                <span className="lottery-feature-card__yiki" aria-hidden="true">
                  <span className="lottery-feature-card__yiki-ball">YK</span>
                  <span className="lottery-feature-card__yiki-coin" />
                </span>
              )}
              <span className="lottery-feature-card__text min-w-0">
                <span className="lottery-feature-card__title">{item.title}</span>
                <LotteryCountdown label={item.countdownLabel} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lottery-hub__markets min-w-0" aria-label="ประเภทหวยทั้งหมด">
        <div className="lottery-type-grid">
          {gridItems.map((item) => (
            <Link key={item.id} href={item.href} className="lottery-type-card glass-card--soft">
              <LotteryFlagOrb label={item.flagLabel} tone={item.flagTone} size="sm" />
              <span className="lottery-type-card__body min-w-0">
                <span className="lottery-type-card__title">{item.title}</span>
                {item.status === "closed" ? (
                  <span className="lottery-type-card__closed">ปิดรับแทง</span>
                ) : (
                  <LotteryCountdown label={item.countdownLabel ?? "—"} />
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <LotteryLatestResultsTable results={results} />
    </div>
  );
}
