"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import Image from "next/image";
import { ChevronRightIcon, SwipeBetEmblem } from "../ui/Icons";
import { SectionIcon } from "../ui/SectionIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { HighlightItem } from "../../types/lobby";
import { gameCardEnterClassName, gameCardEnterStyle } from "@/app/lib/gameCardEnterMotion";

interface PopularHighlightsProps {
  items: HighlightItem[];
  viewAllHref?: string;
}

/**
 * PopularHighlights ส่วนแสดงรายการ "ยอดนิยม"
 * การ์ดคู่ grid 2 คอลัมn์ — รูปจาก public/HomeProBanner (left / right)
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function PopularHighlights({
  items,
}: PopularHighlightsProps) {
  if (items.length === 0) {
    return (
      <section className="mt-6 w-full sm:mt-8" aria-label="ยอดนิยม">
        <SectionHeader
          icon={<SectionIcon id="sparkle" className="h-6 w-6" />}
          title="ยอดนิยม"
        />
        <p className="py-6 text-center text-sm text-[var(--text-muted)]">ยังไม่มีรายการในหมวดนี้</p>
      </section>
    );
  }

  return (
    <section className="mt-6 w-full sm:mt-8" aria-label="ยอดนิยม">
      <SectionHeader
        icon={<SectionIcon id="sparkle" className="h-6 w-6" />}
        title="ยอดนิยม"
      />

      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => {
          if (item.imageSrc) {
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-label={item.title}
                style={gameCardEnterStyle(index)}
                className={gameCardEnterClassName(
                  "group relative aspect-[2.35/1] min-h-[56px] overflow-hidden rounded-[var(--radius-thumb)] bg-[var(--surface-mid)] transition-[filter] duration-[var(--motion-fast)] hover:brightness-110 active:scale-[0.98]",
                )}
              >
                <Image
                  src={item.imageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 240px, 46vw"
                  className="object-cover object-center"
                />
              </Link>
            );
          }

          if (item.type === "swipe_bet") {
            return (
              <Link
                key={item.id}
                href={item.href}
                style={gameCardEnterStyle(index)}
                className={gameCardEnterClassName(
                  "group flex items-center justify-between rounded-[var(--radius-panel)] bg-[var(--surface-gradient)] px-3.5 py-3 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-hover)]",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <SwipeBetEmblem className="h-10 w-10 shrink-0" />
                  <span className="truncate text-sm font-medium text-[var(--text-primary)] sm:text-base">
                    {item.title}
                  </span>
                </div>
                <span className="shrink-0 text-[var(--icon-default)] transition-colors group-hover:text-[var(--icon-active)]">
                  <ChevronRightIcon className="h-4 w-4" />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              style={gameCardEnterStyle(index)}
              className={gameCardEnterClassName(
                "group relative flex min-h-[56px] items-center justify-between overflow-hidden rounded-[var(--radius-panel)] bg-gradient-to-r from-[#181135] via-[#1b1540] to-[#25103a] px-4 py-2.5 transition-colors duration-[var(--motion-fast)] hover:brightness-105",
              )}
            >
              <div className="z-10 flex flex-col">
                <span className="font-mono text-lg font-medium italic tracking-tighter text-white drop-shadow sm:text-xl">
                  DEXY
                </span>
                <span className="-mt-1 font-mono text-xs font-medium italic tracking-widest text-slate-300 drop-shadow sm:text-sm">
                  RACE
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
