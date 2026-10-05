"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface CosmicLineTabItem<T extends string> {
  id: T;
  label: React.ReactNode;
}

interface CosmicLineTabsProps<T extends string> {
  tabs: CosmicLineTabItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  columns?: 2 | 3 | 4;
  scrollable?: boolean;
  withIcons?: boolean;
  className?: string;
}

/** useLayoutEffect บน client เท่านั้น — กัน warning ตอน SSR */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * แท็บเส้นใต้ — ใช้ในหน้า standalone และ hub sheet
 * เส้น neon เป็นองค์ประกอบเดียวที่เลื่อน/ยืดไปหาแท็บที่เลือก (translate + width)
 * ก่อนวัดตำแหน่งเสร็จ (SSR / ครั้งแรก) ใช้เส้นของแท็บเองแทนผ่าน CSS fallback
 */
export function CosmicLineTabs<T extends string>({
  tabs,
  activeId,
  onSelect,
  ariaLabel,
  columns,
  scrollable = false,
  withIcons = false,
  className,
}: CosmicLineTabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const firstPaintRef = useRef(true);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const [animate, setAnimate] = useState(false);

  const measure = useCallback(() => {
    const el = tabRefs.current.get(activeId);
    if (!el) return;
    setIndicator((prev) =>
      prev && prev.x === el.offsetLeft && prev.w === el.offsetWidth
        ? prev
        : { x: el.offsetLeft, w: el.offsetWidth },
    );
  }, [activeId]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure, tabs.length]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    tabRefs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [measure, tabs.length]);

  // เปิด transition หลังวัดครั้งแรก + เลื่อนแท็บที่เลือกเข้ากลางแถว (เฉพาะแถวเลื่อนได้)
  useEffect(() => {
    if (firstPaintRef.current) {
      firstPaintRef.current = false;
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
    if (scrollable) {
      tabRefs.current.get(activeId)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeId, scrollable]);

  const tablistClass = cn(
    "cosmic-line-tablist",
    columns === 2 && "cosmic-line-tablist--cols-2",
    columns === 3 && "cosmic-line-tablist--cols-3",
    columns === 4 && "cosmic-line-tablist--cols-4",
    scrollable && "cosmic-line-tablist--scroll",
    className,
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={tablistClass}
      data-indicator={indicator ? (animate ? "animated" : "ready") : undefined}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) tabRefs.current.set(tab.id, node);
              else tabRefs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "cosmic-line-tab",
              withIcons && "cosmic-line-tab--with-icon",
              isActive && "is-active",
            )}
          >
            {tab.label}
          </button>
        );
      })}
      {indicator ? (
        <span
          aria-hidden="true"
          className="cosmic-line-tab-indicator"
          style={{ transform: `translate3d(${indicator.x}px,0,0)`, width: indicator.w }}
        />
      ) : null}
    </div>
  );
}
