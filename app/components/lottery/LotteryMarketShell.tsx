"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useContainedVerticalScroll } from "./useContainedVerticalScroll";
import type { LotteryCatalogEntry } from "@/app/types/lottery";
import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import { LotteryCountdown, LotteryFlagOrb } from "./LotteryFlagOrb";
import { cn } from "@/lib/utils";

interface LotteryMarketShellProps {
  activeEntry: LotteryCatalogEntry;
  roundCount: number;
  children: React.ReactNode;
}

/**
 * Step 2 หวย — sidebar เลือกประเภท + banner หัวตลาด + พื้นที่รายการรอบ
 * โครง layout มือถือ/เดสก์ท็อปใช้ Tailwind — สไตล์การ์ด/สถานะอยู่ใน lottery.css
 */
export function LotteryMarketShell({ activeEntry, roundCount, children }: LotteryMarketShellProps) {
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const roundsScrollRef = useRef<HTMLDivElement>(null);
  useContainedVerticalScroll(sidebarScrollRef);
  useContainedVerticalScroll(roundsScrollRef);

  return (
    <div
      className={cn(
        "lottery-market-shell surface-solid-outer",
        "grid min-h-0 items-stretch overflow-hidden border-0 bg-[var(--surface-solid-outer)]",
        "max-lg:h-full max-lg:max-h-full max-lg:min-h-0 max-lg:flex-1 max-lg:basis-auto",
        "max-lg:gap-2 max-lg:rounded-none max-lg:p-2 max-lg:shadow-none",
        "max-lg:grid-cols-[minmax(0,clamp(6.75rem,31vw,8.25rem))_minmax(0,1fr)] max-lg:grid-rows-[minmax(0,1fr)]",
        "max-lg:[&>*]:min-h-0",
        "lg:gap-4 lg:rounded-[var(--radius-panel)] lg:p-4 lg:shadow-[0_12px_40px_rgb(0_0_0/0.18)]",
        "lg:grid-cols-[minmax(0,248px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]",
        "lg:h-[min(calc(100dvh-7.5rem),50rem)] lg:max-h-[min(calc(100dvh-7.5rem),50rem)]",
        "lg:[&>*]:min-h-0",
      )}
    >
      <aside
        className={cn(
          "lottery-market-sidebar",
          "flex min-h-0 min-w-0 flex-col",
          "max-lg:h-full max-lg:max-h-full max-lg:overflow-hidden",
          "lg:h-full",
        )}
        aria-label="ประเภทหวย"
      >
        <div
          ref={sidebarScrollRef}
          className={cn(
            "lottery-market-sidebar__panel lottery-market-scroll",
            "min-h-0 flex-1 basis-auto rounded-[calc(var(--radius-panel)-2px)] border border-transparent bg-transparent",
            "max-lg:touch-pan-y max-lg:overflow-x-hidden max-lg:overflow-y-auto max-lg:p-0 max-lg:pb-3",
            "lg:overflow-x-hidden lg:overflow-y-auto lg:p-2 lg:pr-1",
          )}
        >
          <ul
            className={cn(
              "lottery-market-sidebar__list",
              "m-0 flex list-none flex-col gap-1 p-0 lg:gap-2",
            )}
          >
            {LOTTERY_CATALOG_ENTRIES.map((entry) => {
              const isActive = entry.slug === activeEntry.slug;
              return (
                <li key={entry.slug}>
                  <Link
                    href={entry.roundsHref}
                    className={cn(
                      "lottery-market-sidebar__item glass-card--soft",
                      "flex no-underline text-inherit transition-[background,box-shadow] duration-[var(--motion-fast)] ease-linear",
                      "max-lg:flex-col max-lg:items-center max-lg:gap-1 max-lg:px-1 max-lg:py-2 max-lg:text-center",
                      "lg:min-h-[3.25rem] lg:items-center lg:gap-2 lg:rounded-[var(--radius-panel)] lg:px-3 lg:py-2",
                      isActive && "is-active",
                      entry.status === "closed" && "is-closed",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <LotteryFlagOrb
                      label={entry.flagLabel}
                      tone={entry.flagTone}
                      size="sm"
                      className="max-lg:shrink-0"
                    />
                    <span
                      className={cn(
                        "lottery-market-sidebar__text min-w-0",
                        "flex flex-col gap-0.5",
                        "max-lg:w-full max-lg:items-center",
                      )}
                    >
                      <span
                        className={cn(
                          "lottery-market-sidebar__title text-[var(--text-primary)]",
                          "max-lg:line-clamp-2 max-lg:leading-tight",
                          "lg:leading-snug",
                        )}
                      >
                        {entry.title}
                      </span>
                      {entry.status === "closed" ? (
                        <span className="lottery-market-sidebar__meta text-[var(--text-secondary)]">
                          ปิดรับแทง
                        </span>
                      ) : (
                        <LotteryCountdown
                          label={entry.statusLabel}
                          className="max-lg:justify-center max-lg:gap-0.5 [&_svg]:max-lg:size-3"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div
        className={cn(
          "lottery-market-main min-h-0 min-w-0",
          "max-lg:grid max-lg:h-full max-lg:max-h-full max-lg:grid-cols-[minmax(0,1fr)] max-lg:grid-rows-[auto_minmax(0,1fr)] max-lg:overflow-hidden max-lg:p-0",
          "lg:flex lg:h-full lg:flex-col lg:overflow-hidden lg:px-1 lg:py-2",
        )}
      >
        <header
          className={cn(
            "lottery-market-banner",
            "flex shrink-0 flex-nowrap items-center border-0 bg-[var(--surface-solid-inner)]",
            "max-lg:relative max-lg:z-[2] max-lg:justify-center max-lg:gap-1 max-lg:rounded-[calc(var(--radius-panel)-4px)] max-lg:p-2",
            "max-lg:shadow-[0_1px_0_color-mix(in_srgb,var(--border-subtle)_55%,transparent)]",
            "lg:gap-2 lg:rounded-[var(--radius-panel)] lg:p-4",
            "[&>.lottery-flag]:max-lg:hidden",
          )}
        >
          <LotteryFlagOrb label={activeEntry.flagLabel} tone={activeEntry.flagTone} size="lg" />
          <div
            className={cn(
              "lottery-market-banner__body min-w-0 flex-1",
              "max-lg:w-full max-lg:text-center",
              "lg:text-left",
            )}
          >
            <h1
              className={cn(
                "lottery-market-banner__title m-0 font-medium text-[var(--text-primary)]",
                "max-lg:text-[0.6875rem] max-lg:leading-tight",
                "lg:text-base lg:leading-snug",
              )}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {activeEntry.title}
            </h1>
            <Link
              href="/promotions"
              className={cn(
                "lottery-market-banner__rules text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)] hover:underline",
                "max-lg:mt-0.5 max-lg:block max-lg:text-[0.625rem] max-lg:leading-tight",
                "lg:mt-1 lg:inline-block lg:text-xs",
              )}
            >
              กติกา / อัตราการจ่าย
            </Link>
          </div>
        </header>

        <p className="lottery-market-round-count mb-3 text-[var(--text-secondary)] max-lg:hidden">
          รอบที่เปิดให้เล่น{" "}
          <span className="lottery-market-round-count__n text-[var(--text-primary)]">{roundCount}</span>{" "}
          รอบ
        </p>

        <div
          ref={roundsScrollRef}
          className={cn(
            "lottery-market-rounds-scroll lottery-market-scroll",
            "min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-0.5 pb-1",
            "max-lg:row-start-2 max-lg:max-h-full max-lg:touch-pan-y max-lg:pb-3",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
