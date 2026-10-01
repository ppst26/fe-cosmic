"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** แบนเนอร์โปรในเมนู — อ้าง asset ใน public/promotions/catalog.json */
const MENU_DRAWER_PROMO_BANNER = {
  src: "/promotions/mock-pro1.avif",
  alt: "โปรโมชัน",
} as const;

interface MenuDrawerPromoBannerProps {
  className?: string;
  /** นำทางไปหน้าโปรแล้วปิดเมนู — ส่งจาก RightMenuDrawer */
  onPromoNavigate?: (href: string) => void;
}

/**
 * โปรสองรูป + ปุ่มดูเพิ่มเติม — ใช้ใน RightMenuDrawer.tsx
 */
export function MenuDrawerPromoBanner({ className, onPromoNavigate }: MenuDrawerPromoBannerProps) {
  const handlePromoClick = (event: React.MouseEvent, href: string) => {
    if (!onPromoNavigate) return;
    event.preventDefault();
    onPromoNavigate(href);
  };

  return (
    <div className={cn("menu-drawer-promos flex flex-col gap-2", className)}>
      <Link
        href="/promotions"
        className="menu-drawer-promo-card relative block aspect-[2.35/1] w-full overflow-hidden rounded-2xl"
        onClick={(event) => handlePromoClick(event, "/promotions")}
      >
        <Image
          src={MENU_DRAWER_PROMO_BANNER.src}
          alt={MENU_DRAWER_PROMO_BANNER.alt}
          fill
          sizes="(max-width: 1023px) 100vw, 360px"
          className="object-cover"
          loading="eager"
        />
      </Link>

      <Link
        href="/promotions"
        className="menu-drawer-promo-more inline-flex min-h-10 w-full items-center justify-center rounded-2xl border border-white/10 bg-[#17151a] text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[#1f1c22] active:scale-[0.99]"
        onClick={(event) => handlePromoClick(event, "/promotions")}
      >
        ดูโปรโมชันทั้งหมด
      </Link>
    </div>
  );
}
