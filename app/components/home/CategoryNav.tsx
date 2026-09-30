"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CategoryItem, CategoryId } from "../../types/lobby";
import { resolveLobbyCategoryFromPath } from "@/app/lib/lobbyCategoryFromPath";
import { Menu3DIcon } from "@/app/components/ui/Menu3DIcon";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: CategoryItem[];
  defaultActiveId?: CategoryId;
  /** ซิงก์ highlight กับ sidebar / state ภายนอก (หน้าแรก desktop) */
  activeId?: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  className?: string;
  /** route = ไปหน้า /casino ฯลฯ · none = สลับ state บนหน้าเดียว (หน้าแรก) */
  navigationMode?: "route" | "none";
  /** "desktop" = การ์ดชิปเต็มคอลัมน์เดิม · "mobile" = ไอคอนกล่องมน 44px + ข้อความนอก */
  variant?: "desktop" | "mobile";
}

/**
 * CategoryNav — แถบหมวดหมู่เกม ไอคอนบน + ข้อความไทยล่าง
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function CategoryNav({
  categories,
  defaultActiveId = "home",
  activeId: activeIdProp,
  onSelectCategory,
  navigationMode = "route",
  className = "",
  variant = "desktop",
}: CategoryNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routeActiveId = useMemo(
    () => resolveLobbyCategoryFromPath(pathname, categories),
    [pathname, categories],
  );
  const [pickedId, setPickedId] = useState<CategoryId>(defaultActiveId);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(28);

  /** เลื่อน pill เข้ากรอบเมื่อกดแล้วยังไม่เห็นครบ — ไม่รีเซ็ต scroll ทุกครั้งที่ active เปลี่ยน */
  const scrollPillIntoViewIfNeeded = useCallback((pill: HTMLElement) => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const edgeSlack = 8;
    if (pillRect.left >= trackRect.left + edgeSlack && pillRect.right <= trackRect.right - edgeSlack) {
      return;
    }
    const targetLeft =
      pill.offsetLeft - (track.clientWidth - pill.offsetWidth) / 2;
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({
      left: Math.max(0, Math.min(maxScroll, targetLeft)),
      behavior: "smooth",
    });
  }, []);

  const updateScrollProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.max(0, Math.min(1, el.scrollLeft / maxScroll)));
      setThumbWidthPercent(Math.max(20, Math.min(45, (el.clientWidth / el.scrollWidth) * 100)));
    } else {
      setScrollProgress(0);
      setThumbWidthPercent(100);
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollProgress();

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("scroll", updateScrollProgress, { passive: true });
    el.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      el.removeEventListener("scroll", updateScrollProgress);
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  useEffect(() => {
    if (activeIdProp) {
      setPickedId(activeIdProp);
    }
  }, [activeIdProp]);

  const activeId =
    navigationMode === "none"
      ? (activeIdProp ?? pickedId)
      : (routeActiveId ?? activeIdProp ?? pickedId);

  const pushCategoryRoute = (href: string) => {
    const scrollY = window.scrollY;
    router.push(href, { scroll: false });
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  const handleCategoryClick = (category: CategoryItem, e?: React.MouseEvent) => {
    setPickedId(category.id);
    onSelectCategory?.(category.id);
    if (variant === "mobile" && e?.currentTarget instanceof HTMLElement) {
      scrollPillIntoViewIfNeeded(e.currentTarget);
    }
    if (navigationMode !== "route") return;

    if (category.href.startsWith("#")) {
      pushCategoryRoute(`/${category.href}`);
      return;
    }

    if (category.href.startsWith("/")) {
      if (category.href === "/" && pathname === "/") return;
      pushCategoryRoute(category.href);
    }
  };

  if (variant === "desktop") {
    return (
      <nav
        className={cn("category-nav relative w-full min-w-0 my-1 overflow-hidden", className)}
        aria-label="แถบเลือกหมวดหมู่เกม"
      >
        <div
          ref={trackRef}
          className="category-nav__track flex flex-nowrap items-center justify-stretch gap-2 w-full overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth"
        >
          {categories.map((category) => {
            const isActive = category.id === activeId;

            return (
              <button
                key={category.id}
                type="button"
                data-active={isActive}
                onClick={(e) => handleCategoryClick(category, e)}
                className={cn(
                  "category-nav__chip flex h-[54px] min-h-[54px] min-w-[104px] flex-1 flex-row items-center justify-center gap-2 rounded-xl px-2.5 py-2 text-[16px] xl:text-[17px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none",
                  isActive && "is-active",
                )}
                aria-pressed={isActive}
                aria-label={category.label}
              >
                <span className="category-nav__icon flex items-center justify-center shrink-0" aria-hidden="true">
                  <Menu3DIcon
                    iconId={category.id}
                    className="h-9 w-9 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-transform duration-200 group-hover:scale-105 xl:h-10 xl:w-10"
                  />
                </span>
                <span className="category-nav__label whitespace-nowrap tracking-tight">{category.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn("category-nav category-nav--mobile relative w-full min-w-0 overflow-visible", className)}
      aria-label="แถบเลือกหมวดหมู่เกม"
    >
      <div
        ref={trackRef}
        className="category-nav__track flex flex-nowrap items-center justify-start gap-2 w-full overflow-x-auto py-1 px-0.5 no-scrollbar"
      >
        {categories.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              data-active={isActive}
              onClick={(e) => handleCategoryClick(category, e)}
              className={cn(
                "category-nav__pill flex h-11 flex-none flex-row items-center gap-2.5 px-3.5 rounded-xl text-[14px] font-medium transition-[color,background-color,box-shadow] duration-150 cursor-pointer select-none outline-none active:scale-[0.98]",
                isActive
                  ? "is-active"
                  : "bg-transparent text-[#bab5d6] hover:text-white hover:bg-white/5",
              )}
              aria-pressed={isActive}
              aria-label={category.label}
            >
              <span
                className={cn(
                  "category-nav__icon flex h-8 w-8 shrink-0 items-center justify-center",
                  isActive ? "opacity-100" : "opacity-90",
                )}
                aria-hidden="true"
              >
                <Menu3DIcon
                  iconId={category.id}
                  className="h-8 w-8 drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]"
                />
              </span>
              <span className="category-nav__label whitespace-nowrap tracking-tight">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar ที่เคลื่อนตามตำแหน่ง scroll แนวนอน เหมือนในตัวอย่าง */}
      <div className="category-nav__progress-track relative w-full h-[2.5px] bg-white/10 rounded-full mt-1.5 overflow-hidden">
        <div
          className="category-nav__progress-bar absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#6366f1] via-[#7047eb] to-[#a855f7] shadow-[0_0_8px_rgba(112,71,235,0.8)]"
          style={{
            width: `${thumbWidthPercent}%`,
            left: `${scrollProgress * (100 - thumbWidthPercent)}%`,
          }}
        />
      </div>
    </nav>
  );
}
