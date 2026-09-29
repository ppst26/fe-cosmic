"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** โหมด shell แบบเบา — ใช้แทน LobbyDesktopPageShell เมื่อย้ายชุดหวยไปโปรเจกต์ที่ไม่มี lobby เต็ม */
export interface LotteryRouteShellProps {
  children: React.ReactNode;
  activeCategoryId?: string;
  subHeader?: { title: string; backHref?: string };
  mainClassName?: string;
  hideBottomNav?: boolean;
}

/**
 * กรอบหน้าหวยแบบ standalone — header ย่อย + main
 * API เดียวกับ LobbyDesktopPageShell ที่หน้า lottery ใช้
 */
export function LotteryRouteShell({
  children,
  subHeader,
  mainClassName,
  hideBottomNav = false,
}: LotteryRouteShellProps) {
  return (
    <div className="lobby-desktop-shell min-h-dvh bg-[var(--bg-base)] text-[var(--text-primary)]">
      {subHeader ? (
        <header
          className="sticky top-0 z-40 flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--cosmic-chrome-surface-bg,var(--surface-solid-outer))] px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
        >
          {subHeader.backHref ? (
            <Link
              href={subHeader.backHref}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="กลับ"
            >
              ← กลับ
            </Link>
          ) : null}
          <h1 className="m-0 flex-1 truncate text-base font-semibold">{subHeader.title}</h1>
        </header>
      ) : null}
      <main
        className={cn(
          "page-shell lottery-page-main mx-auto w-full max-w-[var(--content-max,1200px)] px-[var(--lottery-mobile-inset,var(--space-2))]",
          hideBottomNav ? "pb-4" : "pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}
