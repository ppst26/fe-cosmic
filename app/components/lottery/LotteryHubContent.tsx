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

      <section className="lottery-results w-full min-w-0" aria-labelledby="lottery-results-title">
        <div className="lottery-results__head mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <MegaphoneMiniIcon />
            <h3
              id="lottery-results-title"
              className="text-[18px] font-bold tracking-tight text-[var(--text-primary)] leading-[1.4] sm:text-[20px]"
            >
              ผลหวยล่าสุด
            </h3>
          </div>
          <Link
            href="/lottery/results"
            className="lottery-results__more-link shrink-0 text-xs font-semibold text-[var(--text-secondary)] sm:text-sm"
          >
            หน้าผลหวย &gt;&gt;
          </Link>
        </div>

        <div
          className="hall-of-fame__table-band hall-of-fame__table-band--borderless lottery-results__table-band relative -mx-[var(--page-gutter)] w-[calc(100%+2*var(--page-gutter))] max-w-none lg:mx-0 lg:w-full"
        >
          <div className="hall-of-fame-table-wrap px-[var(--page-gutter)] lg:px-0">
            <table className="hall-of-fame-table lottery-results-table w-full min-w-0 border-collapse text-left text-sm">
              <thead>
                <tr className="hall-of-fame-table__head-row lottery-results-table__head-row">
                  <th scope="col" className="hall-of-fame-table__th">ประเภทหวย</th>
                  <th
                    scope="col"
                    className="hall-of-fame-table__th lottery-results-table__th lottery-results-table__th--date"
                  >
                    งวด / วันที่
                  </th>
                  <th scope="col" className="hall-of-fame-table__th lottery-results-table__th--num">
                    3 ตัวบน
                  </th>
                  <th scope="col" className="hall-of-fame-table__th lottery-results-table__th--num">
                    2 ตัวล่าง
                  </th>
                </tr>
              </thead>
              <tbody className="hall-of-fame-table__body">
                {results.length === 0 ? (
                  <tr className="hall-of-fame-table__row hall-of-fame-table__row--empty">
                    <td
                      className="hall-of-fame-table__empty py-8 text-center text-sm text-[var(--text-muted)]"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      ยังไม่มีผลหวย
                    </td>
                  </tr>
                ) : (
                  results.map((row) => (
                    <tr
                      key={row.id}
                      className="hall-of-fame-table__row glass-card glass-card--hof-row lottery-results-table__row"
                    >
                      <td className="hall-of-fame-table__td lottery-results-table__td">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <LotteryFlagOrb label={row.flagLabel} tone={row.flagTone} size="sm" />
                          <span className="truncate text-xs font-semibold leading-none text-[var(--text-primary)] sm:text-sm">
                            {row.title}
                          </span>
                        </div>
                      </td>
                      <td className="hall-of-fame-table__td lottery-results-table__td lottery-results-table__td--date">
                        <span className="lottery-results-table__date tabular-nums">
                          {row.dateLabel}
                        </span>
                      </td>
                      <td className="hall-of-fame-table__td lottery-results-table__td lottery-results-table__td--num">
                        <span className="lottery-results-table__num tabular-nums">{row.top3}</span>
                      </td>
                      <td className="hall-of-fame-table__td lottery-results-table__td lottery-results-table__td--num">
                        <span className="lottery-results-table__num tabular-nums">{row.bottom2}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
