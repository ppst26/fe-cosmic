"use client";

import React from "react";
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
import { lotteryHrefToSlug } from "@/app/data/lotteryIconAssets";
import { LotteryHubMarketLink } from "./LotteryHubMarketLink";
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
          <h2 className="text-lg font-medium tracking-tight text-[var(--text-primary)] sm:text-xl">
            แทงหวย
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            เลือกประเภทหวยที่ต้องการแทง
          </p>
        </header>
      ) : null}

      <section className="lottery-hub__featured" aria-label="หวยแนะนำ">
        <div className="lottery-feature-grid grid grid-cols-1 gap-3 sm:grid-cols-3">
          {featured.map((item) => (
            <LotteryHubMarketLink
              key={item.id}
              href={item.href}
              marketSlug={lotteryHrefToSlug(item.href)}
              variant="feature"
              title={item.title}
              countdownLabel={item.countdownLabel}
              fallbackLabel={item.visual === "thai-gov" ? "TH" : "YK"}
              fallbackTone={item.visual === "thai-gov" ? "th" : "gold"}
            />
          ))}
        </div>
      </section>

      <section className="lottery-hub__markets min-w-0" aria-label="ประเภทหวยทั้งหมด">
        <div className="lottery-type-grid grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {gridItems.map((item) => (
            <LotteryHubMarketLink
              key={item.id}
              href={item.href}
              marketSlug={lotteryHrefToSlug(item.href)}
              variant="type"
              title={item.title}
              countdownLabel={item.countdownLabel}
              isClosed={item.status === "closed"}
              fallbackLabel={item.flagLabel}
              fallbackTone={item.flagTone}
            />
          ))}
        </div>
      </section>

      <LotteryLatestResultsTable results={results} />
    </div>
  );
}
