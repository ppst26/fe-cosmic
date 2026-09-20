"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/app/components/ui/Icons";
import type { PromoItem } from "@/app/types/lobby";

const MOCK_SHELL_SLIDE_COUNT = 6;

interface HomeDesktopPeekCarouselProps {
  items: PromoItem[];
  /** shellBand = แถบเต็มความกว้างใต้ header เหนือ 3 คอลัมน์ */
  placement?: "default" | "shellBand";
  /** ใช้พื้นเปล่า mock แทนรูป — ไล่ layout กว้างเต็ม 3 ใบ */
  usePlaceholderSlides?: boolean;
}

/**
 * แบนเนอร์ peek carousel บน desktop lobby — กลาง + ขอบซ้ายขวา · ปุ่มเลื่อน · dots
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (แถบ shellBand ใต้ header)
 */
export function HomeDesktopPeekCarousel({
  items,
  placement = "default",
  usePlaceholderSlides = false,
}: HomeDesktopPeekCarouselProps) {
  const imageSlides = useMemo(() => items.filter((item) => Boolean(item.bannerSrc)), [items]);

  const slides = useMemo(() => {
    if (!usePlaceholderSlides) {
      return imageSlides;
    }
    return Array.from({ length: MOCK_SHELL_SLIDE_COUNT }, (_, index) => ({
      id: `mock-peek-${index + 1}`,
      title: `Mock ${index + 1}`,
      subtitle: "",
      href: "#",
      bannerSrc: undefined,
    })) satisfies PromoItem[];
  }, [imageSlides, usePlaceholderSlides]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getSlideStride = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container?.firstElementChild) return 0;
    const first = container.firstElementChild as HTMLElement;
    const styles = getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 8;
    return first.offsetWidth + gap;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      const stride = getSlideStride();
      if (!container || stride <= 0) return;
      const clamped = Math.min(Math.max(index, 0), slides.length - 1);
      container.scrollTo({ left: clamped * stride, behavior: "smooth" });
      setActiveIndex(clamped);
    },
    [getSlideStride, slides.length],
  );

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || slides.length === 0) return;

    const stride = getSlideStride();
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanPrev(container.scrollLeft > 1);
    setCanNext(container.scrollLeft < maxScroll - 1);

    if (stride > 0) {
      const index = Math.round(container.scrollLeft / stride);
      const clamped = Math.min(Math.max(index, 0), slides.length - 1);
      setActiveIndex(clamped);
    }
  }, [getSlideStride, slides.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(container);
    return () => {
      container.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  if (slides.length === 0) {
    return null;
  }

  const isShellBand = placement === "shellBand";
  const showNav = isShellBand && slides.length > 1;
  const isMock = usePlaceholderSlides && isShellBand;

  return (
    <section
      className={cn(
        "home-desktop-peek-carousel w-full min-w-0",
        isShellBand && "home-desktop-peek-carousel--shell-band",
        isMock && "home-desktop-peek-carousel--mock",
      )}
      aria-label="แบนเนอร์โปรโมชันและกิจกรรม"
    >
      <div className="home-desktop-peek-carousel__viewport">
        {showNav ? (
          <>
            <button
              type="button"
              className="home-desktop-peek-carousel__nav home-desktop-peek-carousel__nav--prev"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={!canPrev}
              aria-label="สไลด์ก่อนหน้า"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="home-desktop-peek-carousel__nav home-desktop-peek-carousel__nav--next"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={!canNext}
              aria-label="สไลด์ถัดไป"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div
          ref={scrollContainerRef}
          className="home-desktop-peek-carousel__track"
          tabIndex={0}
          aria-label="เลื่อนดูแบนเนอร์"
        >
          {slides.map((item, index) => {
            const slideClass = cn(
              "home-desktop-peek-carousel__slide group",
              index === activeIndex && "is-active",
              isMock && "home-desktop-peek-carousel__slide--mock",
            );

            if (isMock) {
              return (
                <div
                  key={item.id}
                  className={slideClass}
                  aria-label={item.title}
                  role="img"
                >
                  <span className="home-desktop-peek-carousel__mock-label text-3xl font-medium tracking-wide text-white/35">
                    {index + 1}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={slideClass}
                aria-label={`${item.title}${item.subtitle ? `: ${item.subtitle}` : ""}`}
              >
                <Image
                  src={item.bannerSrc!}
                  alt=""
                  fill
                  sizes={
                    isShellBand
                      ? "(min-width: 1280px) 33vw, 40vw"
                      : "(min-width: 1280px) 72vw, 68vw"
                  }
                  className="object-cover object-center transition duration-200 group-hover:brightness-[1.04]"
                  priority={index === 0}
                />
              </Link>
            );
          })}
        </div>

        {slides.length > 1 ? (
          <div className="home-desktop-peek-carousel__dots" aria-hidden="true">
            {slides.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`home-desktop-peek-carousel__dot${isActive ? " is-active" : ""}`}
                  aria-label={`ไปยังสไลด์ที่ ${idx + 1}`}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
