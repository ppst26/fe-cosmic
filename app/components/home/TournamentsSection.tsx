"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import type { LobbyTournamentSectionItem } from "@/app/types/lobby";
import { MenuItemIcon } from "../layout/MenuItemIcon";
import { SectionHeader } from "../ui/SectionHeader";
import { CarouselControls } from "../ui/CarouselControls";

interface TournamentsSectionProps {
  items: LobbyTournamentSectionItem[];
  title?: string;
}

/**
 * กิจกรรม — carousel การ์ดรูปเต็ม (หลัง Hall of Fame)
 * ข้อความอยู่ในไฟล์ภาพ public/tournament แล้ว ไม่ทับหัวข้อซ้ำ
 * ถูกเรียกใช้ใน HomeLobbyPage
 */
export function TournamentsSection({
  items,
  title = "กิจกรรม",
}: TournamentsSectionProps) {
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

  if (items.length === 0) return null;

  return (
    <section
      className="tournaments-section mt-10 w-full min-w-0 sm:mt-12"
      aria-labelledby="lobby-tournaments-section-title"
    >
      <SectionHeader
        icon={
          <MenuItemIcon
            iconId="activities"
            variant="asset"
            className="h-6 w-6 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          />
        }
        title={title}
        titleId="lobby-tournaments-section-title"
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

      <div ref={trackRef} className="carousel-track carousel-tournaments-feature">
        {items.map((item) => {
          const image = (
            <Image
              src={item.imageSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 88vw"
              className="tournament-feature-card__image object-cover object-center"
            />
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="tournament-feature-card tournament-feature-card__link relative block w-full aspect-[4/5] overflow-hidden rounded-[var(--radius-thumb)] lg:aspect-[3/4]"
                aria-label={`${item.brandLabel}: ${item.description}`}
              >
                {image}
              </Link>
            );
          }

          return (
            <article
              key={item.id}
              className="tournament-feature-card relative block w-full aspect-[4/5] overflow-hidden rounded-[var(--radius-thumb)] lg:aspect-[3/4]"
              aria-label={item.brandLabel}
            >
              {image}
            </article>
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
              aria-label={`ไปยัง${item.brandLabel}`}
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
