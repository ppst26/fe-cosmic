"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { CarouselControls } from "./CarouselControls";

interface CarouselProps {
  title: string;
  icon?: React.ReactNode;
  viewAllHref: string;
  viewAllLabel?: string;
  /** preset ของ track: carousel-games | carousel-popular | carousel-providers (นิยามใน globals.css) */
  trackClassName: string;
  className?: string;
  /** แสดงเมื่อไม่มีรายการ — ห้ามเติมรายการซ้ำเพื่อให้แถวเต็ม */
  emptyMessage?: string;
  isEmpty?: boolean;
  children: React.ReactNode;
}

/**
 * Hook คุมสถานะเลื่อนของ track: รู้ว่าเลื่อนซ้าย/ขวาได้อีกไหม และเลื่อนทีละกลุ่ม (1 หน้าจอของ track)
 * ใช้เฉพาะภายใน Carousel.tsx
 */
function useCarouselScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    const observer = new ResizeObserver(updateState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateState);
      observer.disconnect();
    };
  }, [updateState]);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth });
  }, []);

  return { trackRef, canPrev, canNext, scrollByPage };
}

/**
 * Carousel แนวนอนแบบ native scroll + scroll-snap พร้อม SectionHeader และ CarouselControls
 * ใช้กับ ยอดนิยม, เกมยอดฮิต, Slots, คาสิโน, ยิงปลา, กีฬา และ Providers
 * ถูกเรียกใช้โดย GameSection.tsx, ProvidersSection.tsx และ PopularHighlights.tsx
 */
export function Carousel({
  title,
  icon,
  viewAllHref,
  viewAllLabel,
  trackClassName,
  className = "",
  emptyMessage = "ยังไม่มีรายการในหมวดนี้",
  isEmpty = false,
  children,
}: CarouselProps) {
  const { trackRef, canPrev, canNext, scrollByPage } = useCarouselScroll();

  return (
    <section className={`w-full min-w-0 max-w-full ${className}`} aria-label={title}>
      <SectionHeader
        icon={icon}
        title={title}
        actionContent={
          <CarouselControls
            viewAllHref={viewAllHref}
            viewAllLabel={viewAllLabel}
            sectionTitle={title}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={() => scrollByPage(-1)}
            onNext={() => scrollByPage(1)}
          />
        }
      />

      {isEmpty ? (
        <p className="py-6 text-center text-sm text-[var(--text-muted)]">{emptyMessage}</p>
      ) : (
        <div ref={trackRef} className={`carousel-track ${trackClassName}`}>
          {children}
        </div>
      )}
    </section>
  );
}
