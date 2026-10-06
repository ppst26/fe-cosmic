"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoItem } from "../../types/lobby";

interface PromoCarouselProps {
  items: PromoItem[];
}

/**
 * PromoCarousel — รูป HomeProBanner เต็มการ์ด (ไม่มี overlay/ข้อความทับ)
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx
 */
export function PromoCarousel({ items }: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    if (scrollContainerRef.current) {
      const stride = getSlideStride();
      if (stride <= 0) return;
      scrollContainerRef.current.scrollTo({
        left: index * stride,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const stride = getSlideStride();
      if (stride <= 0) return;
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const atEnd = maxScroll > 0 && container.scrollLeft >= maxScroll - 2;
      const newIndex = atEnd ? items.length - 1 : Math.round(container.scrollLeft / stride);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <section
      className="promo-carousel relative my-0.5 w-full min-w-0 overflow-hidden sm:my-3"
      aria-label="แบนเนอร์โปรโมชันและสิทธิพิเศษ"
    >
      <div className="relative min-w-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="promo-carousel__track flex gap-2 overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory py-0 sm:gap-3"
          tabIndex={0}
          aria-label="รายการโปรโมชัน"
        >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-label={[item.title, item.subtitle].filter(Boolean).join(" — ")}
            className="promo-carousel__slide group relative aspect-[2.35/1] w-full max-w-none shrink-0 snap-start overflow-hidden rounded-[var(--radius-panel)] border border-white/8 bg-[var(--surface-mid)] motion-press transition-[filter,transform] duration-150 hover:brightness-110 max-lg:rounded-[var(--radius-card)] sm:w-[78%] sm:max-w-[420px]"
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
                sizes="(max-width: 640px) 85vw, 420px"
                className="object-cover object-center"
                preload={item.id === "promo-loyalty-v2"}
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
          </Link>
        ))}
        </div>

        {items.length > 1 ? (
          <div
            className="promo-carousel__dots pointer-events-none absolute inset-x-0 bottom-2.5 z-20 flex justify-center sm:bottom-3"
            aria-hidden="true"
          >
            <div className="welcome-banner__dots-pill pointer-events-auto">
              {items.slice(0, 5).map((item, idx) => {
                const isDotActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
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
