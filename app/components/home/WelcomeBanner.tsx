"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import type { WelcomeBannerSlide } from "@/app/types/lobby";
import { WELCOME_BANNER_SLIDES } from "@/app/data/lobbyMockData";

interface WelcomeBannerProps {
  items?: WelcomeBannerSlide[];
  onCtaClick?: () => void;
}

/**
 * WelcomeBanner — carousel แบนเนอร์ hero เต็มความกว้าง + dots ด้านใน
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function WelcomeBanner({
  items = WELCOME_BANNER_SLIDES,
  onCtaClick,
}: WelcomeBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getSlideStride = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    return container.clientWidth;
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    const container = scrollContainerRef.current;
    if (!container) return;
    const stride = getSlideStride();
    if (stride <= 0) return;
    container.scrollTo({ left: index * stride, behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const stride = getSlideStride();
    if (stride <= 0) return;
    const newIndex = Math.round(container.scrollLeft / stride);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
      setActiveIndex(newIndex);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="welcome-banner relative my-2 w-full min-w-0"
      aria-label="แบนเนอร์ต้อนรับและโปรโมชัน"
    >
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="welcome-banner__track flex overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory rounded-[var(--radius-panel)]"
          tabIndex={0}
          aria-label="สไลด์แบนเนอร์ต้อนรับ"
        >
          {items.map((slide, index) => (
            <article
              key={slide.id}
              className="welcome-banner__slide relative flex min-h-[300px] w-full shrink-0 snap-start items-center justify-center overflow-hidden sm:min-h-[320px]"
              aria-label={`${slide.title} — ${slide.subtitle}`}
            >
              <Image
                src={slide.bannerSrc}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#090b18]/20 via-transparent to-[#090b18]/55"
                aria-hidden="true"
              />

              <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center px-4 pb-10 text-center sm:pb-11">
                <h2 className="mb-1.5 text-2xl font-medium tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-3xl">
                  {slide.title}
                </h2>
                <p className="mb-4 text-sm font-medium text-[var(--text-secondary)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:mb-5 sm:text-base">
                  {slide.subtitle}
                </p>

                {slide.ctaText ? (
                  <button
                    type="button"
                    onClick={onCtaClick}
                    className="cosmic-action-btn cursor-pointer px-10 py-2.5 text-sm tracking-wide sm:px-12 sm:py-3 sm:text-base"
                  >
                    {slide.ctaText}
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {items.length > 1 ? (
          <div
            className="welcome-banner__dots pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center sm:bottom-6"
            aria-hidden="true"
          >
            <div className="welcome-banner__dots-pill pointer-events-auto">
              {items.map((slide, idx) => {
                const isDotActive = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    className={`welcome-banner__dot ${isDotActive ? "is-active" : ""}`}
                    aria-label={`ไปยังสไลด์ที่ ${idx + 1}`}
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
