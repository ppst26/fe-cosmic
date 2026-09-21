"use client";

import React from "react";
import { SlotFilterTabItem } from "../../data/slotProvidersData";
import {
  GiftIcon,
  GamepadIcon,
  WaterDropIcon,
  ChickenIcon,
  FlameIcon,
  TrophyIcon,
  SparkleSlotIcon,
  CardsIcon,
  GameShowsIcon,
  TableGamesIcon,
  FootballIcon,
  BasketballIcon,
  BoxingIcon,
  TennisIcon,
} from "../ui/Icons";

export interface GenericFilterTabItem {
  id: string;
  label: string;
  iconId: string;
}

interface SlotFilterTabsProps {
  tabs: GenericFilterTabItem[] | SlotFilterTabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  ariaLabel?: string;
}

/**
 * แมปไอคอนสำหรับแต่ละแท็บตัวกรอง (สล็อต, คาสิโนสด, กีฬา)
 */
export function getTabIcon(iconId: string, className = "w-5 h-5 sm:w-6 sm:h-6") {
  switch (iconId) {
    case "gift":
      return <GiftIcon className={className} />;
    case "gamepad":
    case "esports":
      return <GamepadIcon className={className} />;
    case "water-drop":
      return <WaterDropIcon className={className} />;
    case "chicken":
      return <ChickenIcon className={className} />;
    case "flame":
      return <FlameIcon className={className} />;
    case "trophy":
      return <TrophyIcon className={className} />;
    case "sparkle":
      return <SparkleSlotIcon className={className} />;
    case "cards":
      return <CardsIcon className={className} />;
    case "roulette":
    case "game-shows":
      return <GameShowsIcon className={className} />;
    case "dice":
      return <TableGamesIcon className={className} />;
    case "football":
      return <FootballIcon className={className} />;
    case "basketball":
      return <BasketballIcon className={className} />;
    case "boxing":
      return <BoxingIcon className={className} />;
    case "tennis":
      return <TennisIcon className={className} />;
    default:
      return <GiftIcon className={className} />;
  }
}

/**
 * แถบตัวกรองค่ายเกม — ใช้ .page-subnav__* เดียวกับ CategoryNav (มุม --radius-panel)
 * ใช้ในหน้า /slots, /casino, /sport
 */
export function SlotFilterTabs({
  tabs,
  activeTabId,
  onSelectTab,
  ariaLabel = "แถบตัวกรองหมวดเกม",
}: SlotFilterTabsProps) {
  return (
    <nav className="my-3 w-full min-w-0 overflow-hidden" aria-label={ariaLabel}>
      <div
        role="tablist"
        className="page-subnav__track no-scrollbar flex gap-2.5 overflow-x-auto py-1 sm:gap-3"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-selected={isActive}
              className={`page-subnav__chip page-subnav__chip--filter flex min-h-16 flex-none flex-col items-center justify-center gap-1.5 shrink-0 w-[84px] min-w-[84px] px-[6px] py-2 text-center ${isActive ? "is-active" : ""}`}
            >
              <span
                className={`page-subnav__icon flex items-center justify-center mb-0.5 ${isActive ? "is-active" : ""}`}
                aria-hidden="true"
              >
                {getTabIcon(tab.iconId)}
              </span>
              <span className="page-subnav__label max-w-full truncate text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
