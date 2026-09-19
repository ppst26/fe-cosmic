"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeLobbyTournamentItem } from "../../types/lobby";
import { MenuItemIcon } from "../layout/MenuItemIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { CarouselControls } from "../ui/CarouselControls";

interface JackpotSectionProps {
  title?: string;
  items: HomeLobbyTournamentItem[];
}

/**
 * JackpotSection — carousel กิจกรรม/ทัวร์นาเมนต์ (การ์ดแนวตั้ง + dots ด้านล่าง)
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx
 */
export function JackpotSection({
  title = "กิจกรรม",
  items,
}: JackpotSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const getSlideStride = useCallback(() => {
    const track = trackRef.current;
    if (!track?.firstElementChild) return 0;
    const first = track.firstElementChild as HTMLElement;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "8");
    return first.offsetWidth + gap;
  }, []);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const stride = getSlideStride();
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft < maxScroll - 1);

    if (stride > 0) {
      const index = Math.round(track.scrollLeft / stride);
      const clamped = Math.min(Math.max(index, 0), items.length - 1);
      setActiveIndex(clamped);
    }
  }, [getSlideStride, items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const stride = getSlideStride();
      if (!track || stride <= 0) return;
      const clamped = Math.min(Math.max(index, 0), items.length - 1);
      track.scrollTo({ left: clamped * stride, behavior: "smooth" });
      setActiveIndex(clamped);
    },
    [getSlideStride, items.length],
  );

  const scrollByStep = useCallback(
    (direction: 1 | -1) => {
      scrollToIndex(activeIndex + direction);
    },
    [activeIndex, scrollToIndex],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 w-full min-w-0 sm:mt-12" aria-labelledby="lobby-activities-section-title">
      <SectionHeader
        icon={<MenuItemIcon iconId="activities" className="h-6 w-6 text-[var(--icon-default)]" />}
        title={title}
        titleId="lobby-activities-section-title"
        actionContent={
          <CarouselControls
            showViewAll={false}
            sectionTitle={title}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={() => scrollByStep(-1)}
            onNext={() => scrollByStep(1)}
          />
        }
      />

      <div ref={trackRef} className="carousel-track carousel-tournaments">
        {items.map((item) => {
          const card = (
            <article className="carousel-tournament-card transition-[filter] duration-[var(--motion-fast)] hover:brightness-110 active:scale-[0.99]">
              <Image
                src={item.imageSrc}
                alt=""
                fill
                sizes="(min-width: 768px) 220px, 42vw"
                className="object-cover object-center"
              />
            </article>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} aria-label={item.title} className="block min-w-0">
                {card}
              </Link>
            );
          }

          return (
            <div key={item.id} className="min-w-0" aria-label={item.title}>
              {card}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label={`สไลด์${title}`}>
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`ไปยัง${item.title}`}
              onClick={() => scrollToIndex(idx)}
              className={`rounded-full transition-all duration-200 ${
                isActive
                  ? "h-2 w-2 bg-[var(--text-primary)]"
                  : "h-2 w-2 bg-[var(--surface-hover)] hover:bg-[var(--text-muted)]"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
