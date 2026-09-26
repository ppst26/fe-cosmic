"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const handleCategoryClick = (category: CategoryItem) => {
    setPickedId(category.id);
    onSelectCategory?.(category.id);
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
                onClick={() => handleCategoryClick(category)}
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
        className="category-nav__track flex flex-nowrap items-stretch justify-start gap-2 w-full overflow-x-auto py-1 px-0.5"
      >
        {categories.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "category-nav__chip flex min-h-[66px] min-w-[76px] max-w-none flex-none flex-col items-center justify-center gap-1.5 px-2 py-2 text-center text-xs font-medium cursor-pointer select-none outline-none rounded-[14px] transition-transform duration-150 active:scale-95",
                isActive && "is-active",
              )}
              aria-pressed={isActive}
              aria-label={category.label}
            >
              <span className="category-nav__icon flex items-center justify-center" aria-hidden="true">
                {getCategoryIcon(category.id, "h-[22px] w-[22px]")}
              </span>
              <span className="category-nav__label max-w-full truncate text-[12px] font-medium">{category.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
