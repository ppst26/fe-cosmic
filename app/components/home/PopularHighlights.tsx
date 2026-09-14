"use client";

import React from "react";
import Link from "next/link";
import { ChevronRightIcon, SwipeBetEmblem } from "../ui/Icons";
import { SectionIcon } from "../ui/SectionIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { CarouselControls } from "../ui/CarouselControls";
import { HighlightItem } from "../../types/lobby";

interface PopularHighlightsProps {
  items: HighlightItem[];
  viewAllHref?: string;
}

/**
 * PopularHighlights ส่วนแสดงรายการ "ยอดนิยม"
 * หัวข้อดาวทองคู่ + View All + arrows และ grid การ์ด Swipe Bet กับ DEXY RACE คู่กันบนมือถือ
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function PopularHighlights({
  items,
  viewAllHref = "/popular",
}: PopularHighlightsProps) {
  if (items.length === 0) {
    return (
      <section className="mt-6 w-full sm:mt-8" aria-label="ยอดนิยม">
        <SectionHeader
          icon={<SectionIcon id="sparkle" className="h-6 w-6" />}
          title="ยอดนิยม"
          actionContent={
            <CarouselControls
              viewAllHref={viewAllHref}
              sectionTitle="ยอดนิยม"
              canPrev={false}
              canNext={false}
              onPrev={() => {}}
              onNext={() => {}}
            />
          }
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
        actionContent={
          <CarouselControls
            viewAllHref={viewAllHref}
            sectionTitle="ยอดนิยม"
            canPrev={false}
            canNext={false}
            onPrev={() => {}}
            onNext={() => {}}
          />
        }
      />

      {/* สองการ์ดคู่กัน — grid 2 คอลัมน์เท่ากันบนมือถือ */}
      <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        if (item.type === "swipe_bet") {
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center justify-between rounded-[var(--radius-card)] bg-[var(--surface-gradient)] px-3.5 py-3 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-hover)]"
            >
              {/* ตราสีแดงและชื่อ Swipe Bet */}
              <div className="flex min-w-0 items-center gap-3">
                <SwipeBetEmblem className="w-10 h-10 shrink-0" />
                <span className="truncate text-sm font-bold text-[var(--text-primary)] sm:text-base">
                  {item.title}
                </span>
              </div>

              {/* ลูกศร > ทางขวา */}
              <span className="shrink-0 text-[var(--icon-default)] transition-colors group-hover:text-[var(--icon-active)]">
                <ChevronRightIcon className="w-4 h-4" />
              </span>
            </Link>
          );
        }

        // การ์ด DEXY RACE พร้อมอาร์ตเวิร์กสาวไซเบอร์พังก์
        return (
          <Link
            key={item.id}
            href={item.href}
            className="group relative flex min-h-[56px] items-center justify-between overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-r from-[#181135] via-[#1b1540] to-[#25103a] px-4 py-2.5 transition-colors duration-[var(--motion-fast)] hover:brightness-105"
          >
            {/* ตัวอักษรโลโก้ DEXY RACE */}
            <div className="z-10 flex flex-col">
              <span className="font-mono text-lg font-black italic tracking-tighter text-white drop-shadow sm:text-xl">
                DEXY
              </span>
              <span className="-mt-1 font-mono text-xs font-black italic tracking-widest text-slate-300 drop-shadow sm:text-sm">
                RACE
              </span>
            </div>

            {/* อาร์ตเวิร์กสาวไซเบอร์พังก์ด้านขวา */}
            <div
              className="pointer-events-none absolute bottom-0 right-0 top-0 w-36 select-none overflow-hidden"
              aria-hidden="true"
            >
              <svg viewBox="0 0 140 70" className="h-full w-full object-cover">
                <defs>
                  <linearGradient id="cyber-hair" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#701a75" />
                    <stop offset="50%" stopColor="#a21caf" />
                    <stop offset="100%" stopColor="#3b0764" />
                  </linearGradient>
                  <radialGradient id="cyan-eye" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </radialGradient>
                </defs>

                {/* ใบหน้าและผมสีม่วงชมพู */}
                <path d="M40 0 L140 0 L140 70 L60 70 Z" fill="url(#cyber-hair)" />
                <polygon points="65,10 95,20 85,55 55,45" fill="#fbcfe8" />
                {/* ดวงตาสีฟ้าเปล่งแสง */}
                <ellipse cx="75" cy="30" rx="8" ry="4" fill="#ffffff" />
                <circle cx="75" cy="30" r="3.5" fill="url(#cyan-eye)" />
                <circle cx="75" cy="30" r="1.5" fill="#ffffff" />
                {/* คิ้วเฉี่ยวคม */}
                <path d="M66 24 Q75 22 84 27" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
                {/* สายฟ้าสีชมพูข้างแก้ม */}
                <polygon points="98,35 94,45 100,45 96,55 106,42 100,42" fill="#ec4899" />
              </svg>
            </div>
          </Link>
        );
      })}
      </div>
    </section>
  );
}
