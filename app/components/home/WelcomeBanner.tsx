"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { WelcomeBannerSlide } from "@/app/types/lobby";
import { useCarouselAutoplay } from "@/app/hooks/useCarouselAutoplay";

type TrackEntry = {
  slide: WelcomeBannerSlide;
  key: string;
  isClone: boolean;
};

interface WelcomeBannerProps {
  /** สไลด์จาก loadLobbyContent() (HomeLobbyPage) */
  items: WelcomeBannerSlide[];
}

/**
 * WelcomeBanner — carousel แบนเนอร์ hero เต็มความกว้าง · infinite loop · autoplay · dots
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (มือถือ — carousel บนสุด)
 */
export function WelcomeBanner({ items }: WelcomeBannerProps) {
  const loopEnabled = items.length > 1;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollJumpLockRef = useRef(false);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const scrollAnimRef = useRef<number | null>(null);

  const trackSlides = useMemo((): TrackEntry[] => {
    if (!loopEnabled) {
      return items.map((slide) => ({ slide, key: slide.id, isClone: false }));
    }
    const last = items[items.length - 1]!;
    const first = items[0]!;
    return [
      { slide: last, key: `${last.id}--clone-prev`, isClone: true },
      ...items.map((slide) => ({ slide, key: slide.id, isClone: false })),
      { slide: first, key: `${first.id}--clone-next`, isClone: true },
    ];
  }, [items, loopEnabled]);

  const [trackIndex, setTrackIndex] = useState(0);

  const logicalIndex = useMemo(() => {
    if (!loopEnabled) {
      return Math.min(Math.max(trackIndex, 0), items.length - 1);
    }
    if (trackIndex <= 0) return items.length - 1;
    if (trackIndex >= trackSlides.length - 1) return 0;
    return trackIndex - 1;
  }, [items.length, loopEnabled, trackIndex, trackSlides.length]);

  /** ระยะเลื่อนต่อ 1 สไลด์ = ความกว้างสไลด์ + gap */
  const getSlideStride = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container?.firstElementChild) return 0;
    const first = container.firstElementChild as HTMLElement;
    const second = container.children[1] as HTMLElement | undefined;
    if (second) return second.offsetLeft - first.offsetLeft;
    const styles = getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const getTrackIndexFromScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    const stride = getSlideStride();
    if (!container || stride <= 0) return 0;
    return Math.round(container.scrollLeft / stride);
  }, [getSlideStride]);

  const scrollToTrackIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      const stride = getSlideStride();
      if (!container || stride <= 0) return;
      const clamped = Math.min(Math.max(index, 0), trackSlides.length - 1);
      const left = clamped * stride;

      if (scrollAnimRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
      if (snapRestoreTimerRef.current !== null) {
        window.clearTimeout(snapRestoreTimerRef.current);
      }

      container.style.scrollSnapType = "none";
      container.style.scrollBehavior = "auto";

      const finish = () => {
        reconcileRef.current();
        snapRestoreTimerRef.current = window.setTimeout(() => {
          container.style.scrollSnapType = "";
          container.style.scrollBehavior = "";
          snapRestoreTimerRef.current = null;
        }, 40);
      };

      if (behavior === "auto" || Math.abs(container.scrollLeft - left) < 1) {
        container.scrollLeft = left;
        setTrackIndex(clamped);
        finish();
        return;
      }

      const start = container.scrollLeft;
      const delta = left - start;
      const duration = 420;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - t) * (1 - t);
        container.scrollLeft = start + delta * eased;
        if (t < 1) {
          scrollAnimRef.current = window.requestAnimationFrame(step);
          return;
        }
        scrollAnimRef.current = null;
        container.scrollLeft = left;
        finish();
      };
      setTrackIndex(clamped);
      scrollAnimRef.current = window.requestAnimationFrame(step);
    },
    [getSlideStride, trackSlides.length],
  );

  const scrollToLogicalIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const target = loopEnabled ? index + 1 : index;
      scrollToTrackIndex(target, behavior);
    },
    [loopEnabled, scrollToTrackIndex],
  );

  const reconcileLoopScroll = useCallback(() => {
    if (!loopEnabled) return;
    const container = scrollContainerRef.current;
    const stride = getSlideStride();
    if (!container || stride <= 0 || scrollJumpLockRef.current) return;

    const index = getTrackIndexFromScroll();

    if (index <= 0) {
      scrollJumpLockRef.current = true;
      const jumpTo = items.length;
      container.style.scrollSnapType = "none";
      container.scrollLeft = jumpTo * stride;
      setTrackIndex(jumpTo);
      window.requestAnimationFrame(() => {
        scrollJumpLockRef.current = false;
      });
      return;
    }

    if (index >= trackSlides.length - 1) {
      scrollJumpLockRef.current = true;
      container.style.scrollSnapType = "none";
      container.scrollLeft = stride;
      setTrackIndex(1);
      window.requestAnimationFrame(() => {
        scrollJumpLockRef.current = false;
      });
      return;
    }

    setTrackIndex(index);
  }, [getSlideStride, getTrackIndexFromScroll, items.length, loopEnabled, trackSlides.length]);

  const trackIndexRef = useRef(0);
  trackIndexRef.current = trackIndex;
  const reconcileRef = useRef(reconcileLoopScroll);
  reconcileRef.current = reconcileLoopScroll;

  const { pauseFor } = useCarouselAutoplay(loopEnabled, () => {
    scrollToTrackIndex(trackIndexRef.current + 1);
  });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || trackSlides.length === 0) return;

    const initialIndex = loopEnabled ? 1 : 0;
    scrollToTrackIndex(initialIndex, "auto");

    let settleTimer: number | undefined;
    const onScroll = () => {
      const stride = getSlideStride();
      if (stride > 0 && !scrollJumpLockRef.current) {
        const index = getTrackIndexFromScroll();
        const clamped = Math.min(Math.max(index, 0), trackSlides.length - 1);
        setTrackIndex(clamped);
      }
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        reconcileLoopScroll();
      }, 140);
    };

    const pauseFromUser = () => pauseFor(12_000);
    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("pointerdown", pauseFromUser);
    container.addEventListener("wheel", pauseFromUser, { passive: true });

    const observer = new ResizeObserver(() => {
      const index = loopEnabled
        ? Math.min(Math.max(getTrackIndexFromScroll(), 1), items.length)
        : getTrackIndexFromScroll();
      scrollToTrackIndex(index, "auto");
    });
    observer.observe(container);

    return () => {
      window.clearTimeout(settleTimer);
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointerdown", pauseFromUser);
      container.removeEventListener("wheel", pauseFromUser);
      observer.disconnect();
    };
  }, [
    getSlideStride,
    getTrackIndexFromScroll,
    items.length,
    loopEnabled,
    pauseFor,
    reconcileLoopScroll,
    scrollToTrackIndex,
    trackSlides.length,
  ]);

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
          className="welcome-banner__track lobby-carousel-bleed__track flex overflow-x-auto overscroll-x-contain no-scrollbar scroll-smooth snap-x snap-mandatory max-lg:gap-3 lg:gap-2 lg:px-0"
          tabIndex={0}
          aria-label="สไลด์แบนเนอร์ต้อนรับ"
        >
          {trackSlides.map((entry, index) => (
            <article
              key={entry.key}
              className="welcome-banner__slide lobby-carousel-bleed__slide relative flex aspect-[16/10] w-full shrink-0 snap-start items-center justify-center overflow-hidden rounded-none max-lg:rounded-none lg:rounded-[var(--radius-panel)]"
              aria-label={entry.slide.title}
              aria-hidden={entry.isClone ? true : undefined}
            >
              <Image
                src={entry.slide.bannerSrc}
                alt=""
                fill
                preload={!entry.isClone && index === (loopEnabled ? 1 : 0)}
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
