"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/app/components/ui/Icons";
import type { PromoItem } from "@/app/types/lobby";
import { HOME_DESKTOP_PEEK_BANNER_SIZE } from "@/app/data/lobbyMockData";
import { HERO_CAROUSEL_AUTOPLAY_MS, useCarouselAutoplay } from "@/app/hooks/useCarouselAutoplay";

const MOCK_SHELL_SLIDE_COUNT = 6;

type TrackSlide = {
  slide: PromoItem;
  key: string;
  isClone: boolean;
};

interface HomeDesktopPeekCarouselProps {
  items: PromoItem[];
  /** shellBand = แถบเต็มความกว้างใต้ header เหนือ 3 คอลัมน์ */
  placement?: "default" | "shellBand";
  /** ใช้พื้นเปล่า mock แทนรูป — ไล่ layout กว้างเต็ม 3 ใบ */
  usePlaceholderSlides?: boolean;
}

/**
 * แบนเนอร์ peek carousel บน desktop lobby — กลาง + peek ข้าง · infinite · dots
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (แถบ shellBand ใต้ header)
 */
export function HomeDesktopPeekCarousel({
  items,
  placement = "default",
  usePlaceholderSlides = false,
}: HomeDesktopPeekCarouselProps) {
  const t = useT("home");
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

  const isShellBand = placement === "shellBand";
  const isMock = usePlaceholderSlides && isShellBand;
  const loopEnabled = isShellBand && !isMock && slides.length > 1;

  const trackSlides = useMemo((): TrackSlide[] => {
    if (!loopEnabled) {
      return slides.map((slide) => ({ slide, key: slide.id, isClone: false }));
    }
    const last = slides[slides.length - 1]!;
    const first = slides[0]!;
    return [
      { slide: last, key: `${last.id}--peek-clone-prev`, isClone: true },
      ...slides.map((slide) => ({ slide, key: slide.id, isClone: false })),
      { slide: first, key: `${first.id}--peek-clone-next`, isClone: true },
    ];
  }, [loopEnabled, slides]);

  const [trackIndex, setTrackIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollJumpLockRef = useRef(false);
  const trackIndexRef = useRef(0);
  const logicalIndexRef = useRef(0);
  const advanceFromAutoplayRef = useRef(false);

  const getSlideStride = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container?.firstElementChild) return 0;
    const first = container.firstElementChild as HTMLElement;
    const styles = getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 8;
    return first.offsetWidth + gap;
  }, []);

  const getTrackIndexFromScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    const stride = getSlideStride();
    if (!container || stride <= 0) return 0;
    return Math.round(container.scrollLeft / stride);
  }, [getSlideStride]);

  const logicalIndex = useMemo(() => {
    if (!loopEnabled) {
      return Math.min(Math.max(trackIndex, 0), slides.length - 1);
    }
    if (trackIndex <= 0) return slides.length - 1;
    if (trackIndex >= trackSlides.length - 1) return 0;
    return trackIndex - 1;
  }, [loopEnabled, slides.length, trackIndex, trackSlides.length]);

  const scrollToTrackIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      const stride = getSlideStride();
      if (!container || stride <= 0) return;
      const clamped = Math.min(Math.max(index, 0), trackSlides.length - 1);
      container.scrollTo({ left: clamped * stride, behavior });
      setTrackIndex(clamped);
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
      const jumpTo = slides.length;
      container.scrollTo({ left: jumpTo * stride, behavior: "auto" });
      setTrackIndex(jumpTo);
      window.requestAnimationFrame(() => {
        scrollJumpLockRef.current = false;
      });
      return;
    }

    if (index >= trackSlides.length - 1) {
      scrollJumpLockRef.current = true;
      container.scrollTo({ left: stride, behavior: "auto" });
      setTrackIndex(1);
      window.requestAnimationFrame(() => {
        scrollJumpLockRef.current = false;
      });
      return;
    }

    setTrackIndex(index);
  }, [getSlideStride, getTrackIndexFromScroll, loopEnabled, slides.length, trackSlides.length]);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || trackSlides.length === 0) return;

    const stride = getSlideStride();
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (loopEnabled) {
      setCanPrev(true);
      setCanNext(true);
    } else {
      setCanPrev(container.scrollLeft > 1);
      setCanNext(container.scrollLeft < maxScroll - 1);
    }

    if (stride > 0 && !scrollJumpLockRef.current) {
      const index = getTrackIndexFromScroll();
      const clamped = Math.min(Math.max(index, 0), trackSlides.length - 1);
      setTrackIndex(clamped);
    }
  }, [getSlideStride, getTrackIndexFromScroll, loopEnabled, trackSlides.length]);

  trackIndexRef.current = trackIndex;
  logicalIndexRef.current = logicalIndex;

  const autoplayEnabled = slides.length > 1 && !isMock;
  const { pauseFor } = useCarouselAutoplay(
    autoplayEnabled,
    () => {
      advanceFromAutoplayRef.current = true;
      if (loopEnabled) {
        scrollToTrackIndex(trackIndexRef.current + 1);
        return;
      }
      const nextLogical = (logicalIndexRef.current + 1) % slides.length;
      scrollToLogicalIndex(nextLogical);
    },
    { intervalMs: HERO_CAROUSEL_AUTOPLAY_MS, rootRef: viewportRef },
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const initialIndex = loopEnabled ? 1 : 0;
    scrollToTrackIndex(initialIndex, "auto");
    updateScrollState();

    const onScroll = () => {
      if (!scrollJumpLockRef.current && !advanceFromAutoplayRef.current) {
        pauseFor(12_000);
      }
      advanceFromAutoplayRef.current = false;
      updateScrollState();
    };
    const onScrollEnd = () => {
      reconcileLoopScroll();
      updateScrollState();
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("scrollend", onScrollEnd);

    const observer = new ResizeObserver(() => {
      const index = loopEnabled
        ? Math.min(Math.max(getTrackIndexFromScroll(), 1), slides.length)
        : getTrackIndexFromScroll();
      scrollToTrackIndex(index, "auto");
      updateScrollState();
    });
    observer.observe(container);

    return () => {
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("scrollend", onScrollEnd);
      observer.disconnect();
    };
  }, [
    getTrackIndexFromScroll,
    loopEnabled,
    pauseFor,
    reconcileLoopScroll,
    scrollToTrackIndex,
    slides.length,
    trackSlides.length,
    updateScrollState,
  ]);

  if (slides.length === 0) {
    return null;
  }

  const showNav = isShellBand && slides.length > 1;

  return (
    <section
      className={cn(
        "home-desktop-peek-carousel w-full min-w-0",
        isShellBand && "home-desktop-peek-carousel--shell-band",
        isMock && "home-desktop-peek-carousel--mock",
      )}
      aria-label={t("peekCarousel.ariaLabel")}
    >
      <div ref={viewportRef} className="home-desktop-peek-carousel__viewport">
        {showNav ? (
          <>
            <button
              type="button"
              className="home-desktop-peek-carousel__nav home-desktop-peek-carousel__nav--prev"
              onClick={() => {
                pauseFor(12_000);
                scrollToTrackIndex(trackIndex - 1);
              }}
              disabled={!loopEnabled && !canPrev}
              aria-label={t("carousel.prev")}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="home-desktop-peek-carousel__nav home-desktop-peek-carousel__nav--next"
              onClick={() => {
                pauseFor(12_000);
                scrollToTrackIndex(trackIndex + 1);
              }}
              disabled={!loopEnabled && !canNext}
              aria-label={t("carousel.next")}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div
          ref={scrollContainerRef}
          className="home-desktop-peek-carousel__track"
          tabIndex={0}
          aria-label={t("carousel.scroll")}
        >
          {trackSlides.map((entry, index) => {
            const item = entry.slide;
            const slideClass = cn(
              "home-desktop-peek-carousel__slide group",
              index === trackIndex && "is-active",
              isMock && "home-desktop-peek-carousel__slide--mock",
            );

            if (isMock) {
              return (
                <div
                  key={entry.key}
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

            const bannerIntrinsic = isShellBand ? HOME_DESKTOP_PEEK_BANNER_SIZE : null;
            /** แบนเนอร์ใบแรก = LCP ของ desktop — ใช้ fetchPriority ไม่ใช่ preload เพราะมือถือมี WelcomeBanner เป็น LCP คนละใบ */
            const isLcpBanner = !entry.isClone && logicalIndex === 0;

            return (
              <Link
                key={entry.key}
                href={item.href}
                className={slideClass}
                aria-label={`${item.title}${item.subtitle ? `: ${item.subtitle}` : ""}`}
                aria-hidden={entry.isClone ? true : undefined}
                tabIndex={entry.isClone ? -1 : undefined}
              >
                {bannerIntrinsic ? (
                  <Image
                    src={item.bannerSrc!}
                    alt=""
                    width={bannerIntrinsic.width}
                    height={bannerIntrinsic.height}
                    sizes="(min-width: 1536px) 52rem, (min-width: 1280px) 90vw, 86vw"
                    className="block h-auto w-full max-w-full object-contain transition duration-200 group-hover:brightness-[1.04]"
                    fetchPriority={isLcpBanner ? "high" : "auto"}
                  />
                ) : (
                  <Image
                    src={item.bannerSrc!}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 72vw, 68vw"
                    className="object-cover object-center transition duration-200 group-hover:brightness-[1.04]"
                    fetchPriority={isLcpBanner ? "high" : "auto"}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {slides.length > 1 ? (
          <div
            className="home-desktop-peek-carousel__dots"
            role="tablist"
            aria-label={t("carousel.pickSlide")}
          >
            <div className="home-desktop-peek-carousel__dots-pill">
              {slides.map((item, idx) => {
                const isActive = idx === logicalIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      pauseFor(12_000);
                      scrollToLogicalIndex(idx);
                    }}
                    className={`home-desktop-peek-carousel__dot${isActive ? " is-active" : ""}`}
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
