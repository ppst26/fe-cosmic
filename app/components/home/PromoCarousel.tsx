"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import Image from "next/image";
import { PromoItem } from "../../types/lobby";
import { buildLoopedTrack, useInfiniteSnapCarousel } from "@/app/hooks/useInfiniteSnapCarousel";

interface PromoCarouselProps {
  items: PromoItem[];
}

/**
 * PromoCarousel — รูป HomeProBanner เต็มการ์ด · infinite autoplay (มือถือ hero)
 * inset ซ้าย-ขวาตาม gutter ของหน้า (ไม่ชิดขอบจอ) · แบนเนอร์ไม่เป็นลิงก์
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx
 */
export function PromoCarousel({ items }: PromoCarouselProps) {
  const t = useT("home");
  const trackSlides = buildLoopedTrack(items);
  const { scrollContainerRef, logicalIndex, loopEnabled, pauseFor, scrollToLogicalIndex } =
    useInfiniteSnapCarousel(items.length);

  const dotCount = Math.min(items.length, 5);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="promo-carousel relative w-full min-w-0 overflow-hidden py-2.5 sm:py-3"
      aria-label={t("promoCarousel.ariaLabel")}
    >
      <div className="relative min-w-0">
        <div
          ref={scrollContainerRef}
          className="promo-carousel__track flex gap-0 overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory py-0 sm:gap-3"
          tabIndex={0}
          aria-label={t("promoCarousel.listAriaLabel")}
        >
          {trackSlides.map((entry, index) => {
            const item = entry.item;
            /** สไลด์จริงใบแรก = LCP มือถือ (WelcomeBanner ถูกซ่อน) */
            const isLcpSlide = !entry.isClone && index === (loopEnabled ? 1 : 0);
            return (
              <div
                key={entry.key}
                role="group"
                aria-label={[item.title, item.subtitle].filter(Boolean).join(" — ")}
                aria-hidden={entry.isClone ? true : undefined}
                className="promo-carousel__slide relative aspect-[2.35/1] w-full max-w-none shrink-0 snap-center snap-always overflow-hidden rounded-[var(--radius-panel)] border border-white/8 bg-[var(--surface-mid)] max-lg:rounded-[var(--radius-card)] sm:w-[78%] sm:snap-start sm:max-w-[420px]"
                style={
                  item.bannerSrc
                    ? undefined
                    : {
                        background: "linear-gradient(135deg, #161838 0%, #101128 100%)",
                      }
                }
              >
                {item.bannerSrc ? (
                  <Image
                    src={item.bannerSrc}
                    alt=""
                    fill
                    loading={isLcpSlide ? "eager" : "lazy"}
                    fetchPriority={isLcpSlide ? "high" : "auto"}
                    sizes="(max-width: 640px) 85vw, 420px"
                    className="object-cover object-center"
                  />
                ) : (
                  <>
                    <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-indigo-600/20 blur-2xl" />
                    <div className="relative z-10 flex h-full min-h-[100px] items-center p-4.5 sm:p-5">
                      <div className="max-w-[58%] min-w-0 sm:max-w-[55%]">
                        <h3 className="mb-1 text-lg font-medium tracking-tight text-white sm:text-xl">
                          {item.title}
                        </h3>
                        <p className="text-xs font-medium leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="ml-auto flex h-14 w-20 shrink-0 rotate-6 items-center justify-center rounded-[var(--radius-control)] bg-gradient-to-tr from-purple-700 to-indigo-500 text-xs font-medium text-white shadow-lg">
                        PROMO
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {items.length > 1 ? (
          <div
            className="promo-carousel__dots pointer-events-none absolute inset-x-0 bottom-2.5 z-20 flex justify-center sm:bottom-3"
            aria-hidden="true"
          >
            <div className="welcome-banner__dots-pill pointer-events-auto">
              {items.slice(0, dotCount).map((item, idx) => {
                const isDotActive = idx === logicalIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
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
