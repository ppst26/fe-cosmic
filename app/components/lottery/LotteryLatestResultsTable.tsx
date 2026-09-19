"use client";

import React from "react";
import Link from "next/link";
import type { LotteryResultRow } from "@/app/types/lottery";
import { LotteryFlagOrb } from "./LotteryFlagOrb";

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

interface LotteryLatestResultsTableProps {
  results: LotteryResultRow[];
  resultsPageHref?: string;
}

/**
 * ตารางผลหวยล่าสุด — แถว glass soft · ลำดับคอลัมน์ตาม mock ตัวอย่าง
 * ใช้ใน LotteryHubContent
 */
export function LotteryLatestResultsTable({
  results,
  resultsPageHref = "/lottery/results",
}: LotteryLatestResultsTableProps) {
  return (
    <section className="lottery-results-board w-full min-w-0" aria-labelledby="lottery-results-title">
      <div className="lottery-results-board__head mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <MegaphoneMiniIcon />
          <h3
            id="lottery-results-title"
            className="text-[18px] font-medium tracking-tight text-[var(--text-primary)] leading-[1.4] sm:text-[20px]"
          >
            ผลหวยล่าสุด
          </h3>
        </div>
        <Link
          href={resultsPageHref}
          className="lottery-results-board__more-link shrink-0 text-xs font-medium text-[var(--text-secondary)] sm:text-sm"
        >
          หน้าผลหวย &gt;&gt;
        </Link>
      </div>

      <div className="lottery-results-board__table" role="table" aria-label="รายการผลหวยล่าสุด">
        <div className="lottery-results-board__header" role="row">
          <span className="lottery-results-board__header-cell" role="columnheader">
            ประเภทหวย
          </span>
          <span
            className="lottery-results-board__header-cell lottery-results-board__header-cell--prize"
            role="columnheader"
          >
            3 ตัวบน
          </span>
          <span
            className="lottery-results-board__header-cell lottery-results-board__header-cell--prize"
            role="columnheader"
          >
            2 ตัวล่าง
          </span>
          <span
            className="lottery-results-board__header-cell lottery-results-board__header-cell--date"
            role="columnheader"
          >
            งวด / วันที่
          </span>
        </div>

        <ul className="lottery-results-board__body" role="rowgroup">
          {results.length === 0 ? (
            <li className="lottery-results-board__empty" role="row">
              <span role="cell">ยังไม่มีผลหวย</span>
            </li>
          ) : (
            results.map((row) => (
              <li
                key={row.id}
                className="lottery-results-board__row glass-card--soft"
                role="row"
              >
                <div className="lottery-results-board__market" role="cell">
                  <LotteryFlagOrb label={row.flagLabel} tone={row.flagTone} size="sm" />
                  <span className="lottery-results-board__market-name">{row.title}</span>
                </div>

                <div
                  className="lottery-results-board__prize"
                  role="cell"
                  aria-label={`3 ตัวบน ${row.top3}`}
                >
                  <span className="lottery-results-board__prize-label">3 ตัวบน</span>
                  <span className="lottery-results-board__prize-value tabular-nums">{row.top3}</span>
                </div>

                <div
                  className="lottery-results-board__prize"
                  role="cell"
                  aria-label={`2 ตัวล่าง ${row.bottom2}`}
                >
                  <span className="lottery-results-board__prize-label">2 ตัวล่าง</span>
                  <span className="lottery-results-board__prize-value tabular-nums">
                    {row.bottom2}
                  </span>
                </div>

                <div className="lottery-results-board__date" role="cell">
                  <span className="lottery-results-board__date-text tabular-nums">
                    {row.dateLabel}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
