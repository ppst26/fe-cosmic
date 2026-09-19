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

  return (
    <nav
      className={cn("category-nav w-full min-w-0", className)}
      aria-label="แถบเลือกหมวดหมู่เกม"
    >
      <div ref={trackRef} className="category-nav__track">
        {categories.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`category-nav__chip ${isActive ? "is-active" : ""}`}
              aria-pressed={isActive}
            >
              <span className="category-nav__icon" aria-hidden="true">
                {getCategoryIcon(category.id, "h-[22px] w-[22px] sm:h-6 sm:w-6")}
              </span>
              <span className="category-nav__label">{category.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
