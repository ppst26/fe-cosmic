"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { GameItem } from "@/app/types/lobby";

interface CasinoFeaturedOverflowProps {
  items: GameItem[];
}

/**
 * แถบเลื่อนแนวนอนรูปค่ายคาสิโน — วางใต้ช่องค้นหาหน้า /casino
 * ถูกเรียกใช้ใน app/casino/page.tsx
 */
export function CasinoFeaturedOverflow({ items }: CasinoFeaturedOverflowProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-3 w-full min-w-0" aria-label="ค่ายคาสิโนแนะนำ">
      <div className="-mx-[var(--page-gutter)] flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] pb-1 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-label={`${item.title} — ${item.provider}`}
            className="group relative aspect-[3/4] w-[32%] max-w-[148px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface-mid)] transition-[filter] duration-[var(--motion-fast)] hover:brightness-110 sm:w-[28%] sm:max-w-[160px]"
          >
            {item.coverSrc ? (
              <Image
                src={item.coverSrc}
                alt=""
                fill
                sizes="(min-width: 768px) 160px, 32vw"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center px-2 text-center text-[10px] font-medium text-white">
                {item.title}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
