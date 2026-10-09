"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import Image from "next/image";
import type { WelcomeBannerSlide } from "@/app/types/lobby";
import { buildLoopedTrack, useInfiniteSnapCarousel } from "@/app/hooks/useInfiniteSnapCarousel";

interface WelcomeBannerProps {
  /** สไลด์จาก loadLobbyContent() (HomeLobbyPage) */
  items: WelcomeBannerSlide[];
}

/**
 * WelcomeBanner — carousel แบนเนอร์ hero เต็มความกว้าง · infinite loop · autoplay · dots
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (มือถือ — carousel บนสุด)
 */
export function WelcomeBanner({ items }: WelcomeBannerProps) {
  const t = useT("home");
  const trackSlides = buildLoopedTrack(items);
  const { scrollContainerRef, logicalIndex, loopEnabled, pauseFor, scrollToLogicalIndex } =
    useInfiniteSnapCarousel(items.length);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="welcome-banner lobby-carousel-bleed relative my-0 w-full min-w-0 sm:my-2"
      aria-label={t("welcomeBanner.ariaLabel")}
    >
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="welcome-banner__track lobby-carousel-bleed__track flex overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory max-lg:gap-3 lg:gap-2 lg:px-0"
          tabIndex={0}
          aria-label={t("welcomeBanner.slidesAriaLabel")}
        >
          {trackSlides.map((entry, index) => {
            /** สไลด์จริงใบแรก = LCP ของมือถือ — eager + fetchPriority high แทน preload (ดู next/image § preload) */
            const isLcpSlide = !entry.isClone && index === (loopEnabled ? 1 : 0);
            return (
              <article
                key={entry.key}
                className="welcome-banner__slide lobby-carousel-bleed__slide relative flex aspect-[16/10] w-full shrink-0 snap-start items-center justify-center overflow-hidden rounded-none max-lg:rounded-none lg:rounded-[var(--radius-panel)]"
                aria-label={entry.item.title}
                aria-hidden={entry.isClone ? true : undefined}
              >
                <Image
                  src={entry.item.bannerSrc}
                  alt=""
                  fill
                  loading={isLcpSlide ? "eager" : "lazy"}
                  fetchPriority={isLcpSlide ? "high" : "auto"}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-center"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#090b18]/45 to-transparent"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>

        {items.length > 1 ? (
          <div
            className="welcome-banner__dots pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center sm:bottom-2.5"
            role="tablist"
            aria-label={t("carousel.pickSlide")}
          >
            <div className="welcome-banner__dots-pill pointer-events-auto">
              {items.map((slide, idx) => {
                const isDotActive = idx === logicalIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isDotActive}
                    onClick={() => {
                      pauseFor(12_000);
                      scrollToLogicalIndex(idx);
                    }}
                    className={`welcome-banner__dot ${isDotActive ? "is-active" : ""}`}
                    aria-label={t("carousel.goToSlide", { index: idx + 1 })}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
