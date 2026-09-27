"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CategoryItem, CategoryId } from "../../types/lobby";
import { resolveLobbyCategoryFromPath } from "@/app/lib/lobbyCategoryFromPath";
import {
  CardsIcon,
  FishIcon,
  FootballIcon,
  GameShowsIcon,
  HomeNavIcon,
  LiveCasinoIcon,
  PromoTicketIcon,
  SlotsIcon,
} from "../ui/Icons";
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
 * ไอคอนหมวดหมู่เกม mock (คาสิโน / สล็อต / ยิงปลา / กีฬา / หวย / เกมส์)
 */
function getCategoryIcon(id: CategoryId, className = "w-6 h-6") {
  switch (id) {
    case "home":
      return <HomeNavIcon className={className} />;
    case "casino":
      return <LiveCasinoIcon className={className} />;
    case "slots":
      return <SlotsIcon className={className} />;
    case "fishing":
      return <FishIcon className={className} />;
    case "sports":
      return <FootballIcon className={className} />;
    case "lottery":
      return <PromoTicketIcon className={className} />;
    case "games":
      return <GameShowsIcon className={className} />;
    case "cards":
      return <CardsIcon className={className} />;
    default:
      return <LiveCasinoIcon className={className} />;
  }
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
    el.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      el.removeEventListener("scroll", updateScrollProgress);
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

  // เมื่อ activeId เปลี่ยนใน mobile ให้เลื่อนปุ่มที่ active เข้ามาในมุมมอง
  useEffect(() => {
    if (variant === "mobile" && trackRef.current) {
      const activeEl = trackRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
          block: "nearest",
        });
      }
    }
  }, [activeId, variant]);

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
    if (e?.currentTarget) {
      (e.currentTarget as HTMLElement).scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
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
        className={cn("category-nav relative w-full min-w-0 my-[0.875rem] overflow-visible", className)}
        aria-label="แถบเลือกหมวดหมู่เกม"
      >
        <div
          ref={trackRef}
          className="category-nav__track flex flex-nowrap items-stretch justify-center gap-2.5 w-full overflow-x-auto pt-1 pb-1 pr-[0.35rem] pl-0.5"
        >
          {categories.map((category) => {
            const isActive = category.id === activeId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={(e) => handleCategoryClick(category, e)}
                className={cn(
                  "category-nav__chip flex min-h-16 min-w-[76px] max-w-none flex-none flex-col items-center justify-center gap-1.5 px-1 py-2 text-center text-xs font-medium sm:text-sm",
                  isActive && "is-active",
                )}
                aria-pressed={isActive}
              >
                <span className="category-nav__icon flex items-center justify-center" aria-hidden="true">
                  {getCategoryIcon(category.id, "h-[24px] w-[24px] sm:h-8 sm:w-8")}
                </span>
                <span className="category-nav__label max-w-full truncate">{category.label}</span>
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
        className="category-nav__track flex flex-nowrap items-center justify-start gap-1.5 w-full overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth"
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
                "category-nav__pill flex h-9.5 flex-none flex-row items-center gap-2 px-3.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 cursor-pointer select-none outline-none active:scale-96",
                isActive
                  ? "is-active bg-[rgba(112,71,235,0.28)] text-white font-semibold"
                  : "bg-transparent text-[#bab5d6] hover:text-white hover:bg-white/5",
              )}
              aria-pressed={isActive}
              aria-label={category.label}
            >
              <span
                className={cn(
                  "category-nav__icon flex items-center justify-center shrink-0 transition-colors duration-150",
                  isActive ? "text-white" : "text-[#9d97c5] group-hover:text-white",
                )}
                aria-hidden="true"
              >
                {getCategoryIcon(category.id, "h-4.5 w-4.5")}
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
            transition: "left 75ms linear, width 150ms ease",
          }}
        />
      </div>
    </nav>
  );
}
