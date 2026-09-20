"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useContainedVerticalScroll } from "./useContainedVerticalScroll";
import type { LotteryCatalogEntry } from "@/app/types/lottery";
import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import { LotteryCountdown, LotteryFlagOrb } from "./LotteryFlagOrb";

interface LotteryMarketShellProps {
  activeEntry: LotteryCatalogEntry;
  roundCount: number;
  children: React.ReactNode;
}

/**
 * Step 2 หวย — sidebar เลือกประเภท + banner หัวตลาด + พื้นที่รายการรอบ
 */
export function LotteryMarketShell({ activeEntry, roundCount, children }: LotteryMarketShellProps) {
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const roundsScrollRef = useRef<HTMLDivElement>(null);
  useContainedVerticalScroll(sidebarScrollRef);
  useContainedVerticalScroll(roundsScrollRef);

  return (
    <div className="lottery-market-shell surface-solid-outer">
      <aside className="lottery-market-sidebar" aria-label="ประเภทหวย">
        <div
          ref={sidebarScrollRef}
          className="lottery-market-sidebar__panel lottery-market-scroll"
        >
        <ul className="lottery-market-sidebar__list">
          {LOTTERY_CATALOG_ENTRIES.map((entry) => {
            const isActive = entry.slug === activeEntry.slug;
            return (
              <li key={entry.slug}>
                <Link
                  href={entry.roundsHref}
                  className={`lottery-market-sidebar__item glass-card--soft${
                    isActive ? " is-active" : ""
                  }${entry.status === "closed" ? " is-closed" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <LotteryFlagOrb label={entry.flagLabel} tone={entry.flagTone} size="sm" />
                  <span className="lottery-market-sidebar__text min-w-0">
                    <span className="lottery-market-sidebar__title">{entry.title}</span>
                    {entry.status === "closed" ? (
                      <span className="lottery-market-sidebar__meta">ปิดรับแทง</span>
                    ) : (
                      <LotteryCountdown label={entry.statusLabel} />
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
      </aside>

      <div className="lottery-market-main min-w-0">
        <header className="lottery-market-banner">
          <LotteryFlagOrb label={activeEntry.flagLabel} tone={activeEntry.flagTone} size="lg" />
          <div className="lottery-market-banner__body min-w-0">
            <h1 className="lottery-market-banner__title">{activeEntry.title}</h1>
            <Link href="/promotions" className="lottery-market-banner__rules">
              กติกา / อัตราการจ่าย
            </Link>
          </div>
        </header>

        <p className="lottery-market-round-count max-lg:hidden">
          รอบที่เปิดให้เล่น <span className="lottery-market-round-count__n">{roundCount}</span> รอบ
        </p>

        <div
          ref={roundsScrollRef}
          className="lottery-market-rounds-scroll lottery-market-scroll"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
