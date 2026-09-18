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

interface LotteryHubContentProps {
  /** ซ่อนหัวข้อเมื่อหน้ามี SlotProvidersHeader แล้ว */
  showPageHeading?: boolean;
  featured?: LotteryFeaturedItem[];
  gridItems?: LotteryGridItem[];
  results?: LotteryResultRow[];
}

function MegaphoneMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
      <path
        d="M3 8.5 11 5v10L3 11.5V8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13 7.5c1.2.8 2 2.2 2 3.5s-.8 2.7-2 3.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
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
              className={`lottery-feature-card lottery-feature-card--${item.visual}`}
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
            <Link key={item.id} href={item.href} className="lottery-type-card">
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

      <section className="lottery-results" aria-labelledby="lottery-results-title">
        <div className="lottery-results__banner">
          <h3 id="lottery-results-title" className="lottery-results__banner-title">
            <MegaphoneMiniIcon />
            <span>ผลหวยล่าสุด</span>
          </h3>
          <Link href="/lottery/results" className="lottery-results__banner-link">
            หน้าผลหวย &gt;&gt;
          </Link>
        </div>

        <ul className="lottery-results__list">
          {results.map((row, index) => (
            <li
              key={row.id}
              className={`lottery-results__row${index % 2 === 0 ? " lottery-results__row--framed" : ""}`}
            >
              <div className="lottery-results__market min-w-0">
                <LotteryFlagOrb label={row.flagLabel} tone={row.flagTone} size="sm" />
                <span className="lottery-results__market-name">{row.title}</span>
              </div>
              <div className="lottery-results__nums">
                <div className="lottery-results__num-block">
                  <span className="lottery-results__num-label">3 ตัวบน</span>
                  <span className="lottery-results__num-value">{row.top3}</span>
                </div>
                <div className="lottery-results__num-block">
                  <span className="lottery-results__num-label">2 ตัวล่าง</span>
                  <span className="lottery-results__num-value">{row.bottom2}</span>
                </div>
              </div>
              <span className="lottery-results__date">{row.dateLabel}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
