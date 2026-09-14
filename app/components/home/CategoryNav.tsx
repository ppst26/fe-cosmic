"use client";

import React, { useState } from "react";
import { CategoryItem, CategoryId } from "../../types/lobby";
import {
  LobbyIcon,
  OriginalsIcon,
  SlotsIcon,
  LiveCasinoIcon,
  GameShowsIcon,
  TableGamesIcon,
} from "../ui/Icons";

interface CategoryNavProps {
  categories: CategoryItem[];
  defaultActiveId?: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
}

/**
 * แมปไอคอนสำหรับแต่ละหมวดหมู่ตาม category ID
 */
function getCategoryIcon(id: CategoryId, className = "w-6 h-6") {
  switch (id) {
    case "lobby":
      return <LobbyIcon className={className} />;
    case "originals":
      return <OriginalsIcon className={className} />;
    case "slots":
      return <SlotsIcon className={className} />;
    case "live-casino":
      return <LiveCasinoIcon className={className} />;
    case "game-shows":
      return <GameShowsIcon className={className} />;
    case "table-games":
      return <TableGamesIcon className={className} />;
    default:
      return <LobbyIcon className={className} />;
  }
}

/**
 * CategoryNav แถบหมวดหมู่เกม 6 รายการหลัก
 * (LOBBY, ORIGINALS, SLOTS, LIVE CASINO, GAME SHOWS, TABLE GAMES)
 * รองรับการเลื่อนแนวนอน + ช่องว่างระหว่างปุ่ม (กันกดผิด); touch target ≥ 44px
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function CategoryNav({
  categories,
  defaultActiveId = "lobby",
  onSelectCategory,
}: CategoryNavProps) {
  const [activeId, setActiveId] = useState<CategoryId>(defaultActiveId);

  const handleCategoryClick = (id: CategoryId) => {
    setActiveId(id);
    if (onSelectCategory) {
      onSelectCategory(id);
    }
  };

  return (
    <nav className="my-3.5 w-full min-w-0 overflow-hidden" aria-label="แถบเลือกหมวดหมู่เกม">
      <div className="flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth py-1 no-scrollbar sm:gap-3.5">
        {categories.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              className={`flex w-[76px] shrink-0 cursor-pointer select-none flex-col items-center justify-center rounded-[var(--radius-control)] px-1 py-2 transition-all duration-150 min-h-[64px] sm:min-h-[70px] sm:w-[84px] ${
                isActive
                  ? "text-white shadow-[0_4px_16px_rgba(32,45,101,0.5)] scale-[1.02]"
                  : "bg-[#121127] text-[var(--icon-default)] hover:text-white hover:bg-[#19183b]"
              }`}
              style={
                isActive
                  ? { background: "var(--category-active-gradient)" }
                  : undefined
              }
              aria-pressed={isActive}
            >
              {/* ไอคอนหมวดหมู่ */}
              <div
                className={`mb-1.5 transition-transform duration-150 ${
                  isActive ? "text-[#efedff] scale-105" : "text-[var(--icon-default)]"
                }`}
              >
                {getCategoryIcon(category.id, "w-5 h-5 sm:w-6 sm:h-6")}
              </div>

              {/* ข้อความชื่อหมวดหมู่ */}
              <span className="text-[9.5px] sm:text-[11px] font-bold tracking-tight text-center leading-tight">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
