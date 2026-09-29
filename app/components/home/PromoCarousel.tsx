"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoItem } from "../../types/lobby";

interface PromoCarouselProps {
  items: PromoItem[];
}

/**
 * PromoCarousel — รูป HomeProBanner เป็น background การ์ด + ข้อความทับด้านซ้าย
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function PromoCarousel({ items }: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getSlideStride = () => {
    const container = scrollContainerRef.current;
    if (!container?.firstElementChild) return 0;
    const first = container.firstElementChild as HTMLElement;
    const gap = 8;
    return first.offsetWidth + gap;
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
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / stride);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <section
      className="promo-carousel relative my-0 w-full min-w-0 overflow-hidden sm:my-3"
      aria-label="แบนเนอร์โปรโมชันและสิทธิพิเศษ"
    >
      <div className="relative min-w-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="promo-carousel__track flex gap-2 overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory py-0"
          tabIndex={0}
          aria-label="รายการโปรโมชัน"
        >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative aspect-[2.35/1] w-[85%] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-panel)] transition-all duration-150 hover:brightness-110 sm:w-[78%]"
            style={
              item.bannerSrc
                ? undefined
                : {
                    background: "linear-gradient(135deg, #161838 0%, #101128 100%)",
                  }
            }
          >
            {item.bannerSrc && (
              <>
                <Image
                  src={item.bannerSrc}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 85vw, 420px"
                  className="object-cover object-center"
                  priority={item.id === "promo-loyalty-v2"}
                />
                {/* ไล่ทับซ้ายให้อ่าน title/subtitle ชัด */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0c22]/92 via-[#0a0c22]/55 to-transparent"
                  aria-hidden="true"
                />
              </>
            )}

            {!item.bannerSrc && (
              <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-indigo-600/20 blur-2xl" />
            )}

            <div className="relative z-10 flex h-full min-h-[100px] items-center p-4 sm:p-5">
              <div className="max-w-[58%] min-w-0 sm:max-w-[55%]">
                <h3 className="mb-1 text-lg font-medium tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] transition-colors group-hover:text-blue-100 sm:text-xl">
                  {item.title}
                </h3>
                <p className="text-xs font-medium leading-relaxed text-[var(--text-secondary)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)] sm:text-sm">
                  {item.subtitle}
                </p>
              </div>

              {!item.bannerSrc && (
                <div className="ml-auto flex h-14 w-20 shrink-0 rotate-6 items-center justify-center rounded-[var(--radius-control)] bg-gradient-to-tr from-purple-700 to-indigo-500 text-xs font-medium text-white shadow-lg">
                  PROMO
                </div>
              )}
            </div>
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
