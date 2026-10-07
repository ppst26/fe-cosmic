"use client";

import React from "react";
import type {
  LotteryFeaturedItem,
  LotteryGridItem,
  LotteryResultRow,
} from "@/app/types/lottery";
import { useLotteryHub } from "@/app/hooks/api/lottery";
import { lotteryHrefToSlug } from "@/app/data/lotteryIconAssets";
import { gameCardEnterListKey, GameCardStaggerShell } from "@/app/lib/gameCardEnterMotion";
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
  featured,
  gridItems,
  results,
}: LotteryHubContentProps) {
  const hub = useLotteryHub();
  const resolvedFeatured = featured ?? hub.data?.featured ?? [];
  const resolvedGridItems = gridItems ?? hub.data?.grid ?? [];
  const resolvedResults = results ?? hub.data?.latest ?? [];

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
        <div
          key={gameCardEnterListKey(resolvedFeatured.map((item) => item.id))}
          className="lottery-feature-grid grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {resolvedFeatured.map((item, index) => (
            <GameCardStaggerShell key={item.id} index={index} className="min-w-0">
              <LotteryHubMarketLink
                href={item.href}
                marketSlug={lotteryHrefToSlug(item.href)}
                variant="feature"
                title={item.title}
                countdownLabel={item.countdownLabel}
                fallbackLabel={item.visual === "thai-gov" ? "TH" : "YK"}
                fallbackTone={item.visual === "thai-gov" ? "th" : "gold"}
              />
            </GameCardStaggerShell>
          ))}
        </div>
      </section>

      <section className="lottery-hub__markets min-w-0" aria-label="ประเภทหวยทั้งหมด">
        <div
          key={gameCardEnterListKey(resolvedGridItems.map((item) => item.id))}
          className="lottery-type-grid grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6"
        >
          {resolvedGridItems.map((item, index) => (
            <GameCardStaggerShell key={item.id} index={index} className="min-w-0">
              <LotteryHubMarketLink
                href={item.href}
                marketSlug={lotteryHrefToSlug(item.href)}
                variant="type"
                title={item.title}
                countdownLabel={item.countdownLabel}
                isClosed={item.status === "closed"}
                fallbackLabel={item.flagLabel}
                fallbackTone={item.flagTone}
              />
            </GameCardStaggerShell>
          ))}
        </div>
      </section>

      <LotteryLatestResultsTable results={resolvedResults} />
    </div>
  );
}
