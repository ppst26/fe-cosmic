"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import type { MessageKey } from "@/lib/i18n/messages";

interface QuickBannerItem {
  id: string;
  titleKey: MessageKey<"home">;
  subtitleKey: MessageKey<"home">;
  href: string;
  visualSrc: string;
  isModel?: boolean;
}

const DESKTOP_QUICK_BANNERS: QuickBannerItem[] = [
  {
    id: "quick-promo",
    titleKey: "quickBanners.promo.title",
    subtitleKey: "quickBanners.promo.subtitle",
    href: "/promotions",
    visualSrc: "/assets/3d/โปรโมชั่น.webp",
  },
  {
    id: "quick-event",
    titleKey: "quickBanners.event.title",
    subtitleKey: "quickBanners.event.subtitle",
    href: "/event",
    visualSrc: "/assets/3d/event.webp",
  },
  {
    id: "quick-news",
    titleKey: "quickBanners.news.title",
    subtitleKey: "quickBanners.news.subtitle",
    href: "/promotions",
    visualSrc: "/assets/model/girl2.webp",
    isModel: true,
  },
];

/**
 * แบนเนอร์ 3 การ์ดแนวนอนใต้ marquee announcement บน Desktop
 * สไตล์ Cosmic glass theme เชื่อมต่อ Hub modal เมื่อคลิก
 */
export function LobbyDesktopQuickBanners() {
  const t = useT("home");
  return (
    <nav
      aria-label={t("quickBanners.ariaLabel")}
      className="hidden lg:grid grid-cols-3 gap-3 w-full min-w-0"
    >
      {DESKTOP_QUICK_BANNERS.map((banner) => (
        <HubNavLink
          key={banner.id}
          href={banner.href}
          className="group relative flex h-[84px] w-full min-w-0 items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#17112c]/95 via-[#1b1433]/85 to-[#241a45]/75 p-0 text-left shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_32px_rgba(112,71,235,0.28)] active:translate-y-0"
        >
          {/* Background banner visual */}
          {banner.isModel ? (
            <div className="absolute right-0 bottom-0 top-0 w-[42%] pointer-events-none flex items-end justify-end overflow-hidden">
              <img
                src={banner.visualSrc}
                alt=""
                className="h-[135%] w-auto max-w-none object-contain object-bottom-right drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <img
              src={banner.visualSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-right pointer-events-none transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Dark gradient overlay ฝั่งซ้าย เพื่อให้อ่านข้อความชัดเจนทุกสภาพแสง */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#120d24] via-[#120d24]/90 to-transparent pointer-events-none w-[68%]"
            aria-hidden="true"
          />

          {/* Text block */}
          <div className="relative z-10 flex min-w-0 max-w-[62%] flex-col justify-center px-4 py-2">
            <span className="truncate text-[16px] xl:text-[17px] font-medium tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              {t(banner.titleKey)}
            </span>
            <span className="mt-0.5 truncate text-[12px] xl:text-[13px] font-normal text-[var(--text-secondary)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {t(banner.subtitleKey)}
            </span>
          </div>
        </HubNavLink>
      ))}
    </nav>
  );
}
