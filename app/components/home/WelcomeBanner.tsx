"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import type { WelcomeBannerSlide } from "@/app/types/lobby";
import { fetchHomeBanners } from "@/lib/api/lobby";

interface WelcomeBannerProps {
  items?: WelcomeBannerSlide[];
}

/**
 * WelcomeBanner — carousel แบนเนอร์ hero เต็มความกว้าง + dots ด้านใน
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (มือถือ — carousel บนสุด)
 */
export function WelcomeBanner({
  items = fetchHomeBanners().welcomeSlides,
}: WelcomeBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /** ระยะเลื่อนต่อ 1 สไลด์ = ความกว้างสไลด์ + gap (สไลด์ไม่เต็มกรอบ เพื่อโผล่รูปถัดไป) */
  const getSlideStride = () => {
    const container = scrollContainerRef.current;
    if (!container) return 0;
    const first = container.children[0] as HTMLElement | undefined;
    const second = container.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    if (second) return second.offsetLeft - first.offsetLeft;
    return first.offsetWidth;
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
    const maxScroll = container.scrollWidth - container.clientWidth;
    const atEnd = maxScroll > 0 && container.scrollLeft >= maxScroll - 2;
    const newIndex = atEnd ? items.length - 1 : Math.round(container.scrollLeft / stride);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
      setActiveIndex(newIndex);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="welcome-banner lobby-carousel-bleed relative my-0 w-full min-w-0 sm:my-2"
      aria-label="แบนเนอร์ต้อนรับและโปรโมชัน"
    >
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="welcome-banner__track lobby-carousel-bleed__track flex overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory max-lg:gap-3 lg:gap-2 lg:px-0"
          tabIndex={0}
          aria-label="สไลด์แบนเนอร์ต้อนรับ"
        >
          {items.map((slide, index) => (
            <article
              key={slide.id}
              className="welcome-banner__slide lobby-carousel-bleed__slide relative flex aspect-[16/10] w-full shrink-0 snap-start items-center justify-center overflow-hidden rounded-none max-lg:rounded-none lg:rounded-[var(--radius-panel)]"
              aria-label={slide.title}
            >
              <Image
                src={slide.bannerSrc}
                alt=""
                fill
                preload={index === 0}
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#090b18]/45 to-transparent"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {items.length > 1 ? (
          <div
            className="welcome-banner__dots pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center sm:bottom-2.5"
            role="tablist"
            aria-label="เลือกสไลด์แบนเนอร์"
          >
            <div className="welcome-banner__dots-pill pointer-events-auto">
              {items.map((slide, idx) => {
                const isDotActive = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isDotActive}
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
