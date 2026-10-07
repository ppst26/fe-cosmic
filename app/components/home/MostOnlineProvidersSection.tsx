"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { MostOnlineLobbyItem } from "@/app/types/lobby";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionIcon } from "../ui/SectionIcon";
import { MostOnlineProviderCard } from "./MostOnlineProviderCard";
import { HERO_CAROUSEL_AUTOPLAY_MS, useCarouselAutoplay } from "@/app/hooks/useCarouselAutoplay";
import { cn } from "@/lib/utils";

interface MostOnlineProvidersSectionProps {
  items: MostOnlineLobbyItem[];
  className?: string;
}

/**
 * แถบออนไลน์มากที่สุด — มือถือ grid 3 คอลัมน์ · desktop แถวเลื่อน autoplay
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (หมวด home)
 */
export function MostOnlineProvidersSection({ items, className }: MostOnlineProvidersSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const advanceDesktop = useCallback(() => {
    const track = trackRef.current;
    if (!track?.firstElementChild) return;
    const first = track.firstElementChild as HTMLElement;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const stride = first.offsetWidth + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextLeft = track.scrollLeft + stride;
    if (maxScroll <= 0) return;
    if (nextLeft >= maxScroll - 2) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    track.scrollTo({ left: nextLeft, behavior: "smooth" });
  }, []);

  const { pauseFor } = useCarouselAutoplay(
    isLg && items.length > 1,
    advanceDesktop,
    { intervalMs: HERO_CAROUSEL_AUTOPLAY_MS },
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("most-online-section w-full min-w-0", className)}
      aria-labelledby="most-online-section-title"
    >
      <SectionHeader
        titleId="most-online-section-title"
        icon={<SectionIcon id="flame" className="h-[1.35rem] w-[1.35rem] text-[var(--icon-active)] sm:h-6 sm:w-6" />}
        title="ออนไลน์มากที่สุดในขณะนี้"
        className="mb-3 sm:mb-3.5"
      />

      <div
        ref={trackRef}
        className="most-online-section__track grid grid-cols-4 gap-2 max-lg:min-w-0 lg:flex lg:snap-x lg:snap-mandatory lg:gap-3 lg:overflow-x-auto lg:overscroll-x-contain lg:pb-1 no-scrollbar"
        onPointerDown={() => pauseFor(12_000)}
      >
        {items.map((item) => (
          <MostOnlineProviderCard
            key={item.id}
            item={item}
            className="min-w-0 max-lg:w-full lg:w-[calc((100%-3*0.75rem)/4)] lg:max-w-[220px] lg:shrink-0 lg:snap-start xl:w-[calc((100%-5*0.75rem)/6)] xl:max-w-none"
          />
        ))}
      </div>
    </section>
  );
}
