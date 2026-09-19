"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { CategoryId } from "../../types/lobby";
import { CategorySectionHead } from "./CategorySectionHead";
import { ProviderCategoryToolbar } from "../slots/ProviderCategoryToolbar";
import { SlotProviderCards, type SlotProviderPick } from "../slots/SlotProviderCards";
import { LobbySlotProviderView } from "../slots/LobbySlotProviderView";
import { CasinoProviderCards } from "../casino/CasinoProviderCards";
import { SportProviderCards } from "../sport/SportProviderCards";
import {
  FEATURED_SLOT_PROVIDERS,
  GRID_SLOT_PROVIDERS,
  SLOT_FILTER_TABS,
  type FeaturedSlotProviderItem,
  type GridSlotProviderItem,
} from "../../data/slotProvidersData";
import {
  CASINO_FILTER_TABS,
  CASINO_ITEMS,
  type CasinoCardItem,
} from "../../data/casinoProvidersData";
import {
  SPORT_FILTER_TABS,
  SPORT_ITEMS,
  type SportCardItem,
} from "../../data/sportProvidersData";
import {
  FISHING_FILTER_TABS,
  FISHING_ITEMS,
  type FishingCardItem,
} from "../../data/fishingProvidersData";
import { LotteryHubContent } from "../lottery/LotteryHubContent";

interface LobbyCategoryProvidersProps {
  categoryId: CategoryId;
}

function matchesGridFilter(provider: GridSlotProviderItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (filterId === "drops-and-wins") {
    return ["yggdrasil", "red-tiger", "netent"].includes(provider.id);
  }
  if (filterId === "chicken") {
    return provider.category === "chicken" || provider.id === "chicken-cockfight";
  }
  if (filterId === "buy-feature") {
    return [
      "pg-soft",
      "hacksaw",
      "nolimit-city",
      "relax-gaming",
      "spadegaming",
      "fa-chai",
      "blueprint",
      "push-gaming",
      "spinomenal",
    ].includes(provider.id);
  }
  if (filterId === "jackpot") {
    return [
      "king-midas",
      "joker",
      "ka-gaming",
      "microgaming",
      "playtech",
      "betsoft",
      "ygr",
    ].includes(provider.id);
  }
  if (filterId === "megaways") {
    return ["big-time-gaming", "blueprint", "red-tiger", "royal-slot-gaming"].includes(
      provider.id,
    );
  }
  return true;
}

function matchesFeaturedFilter(provider: FeaturedSlotProviderItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (filterId === "drops-and-wins") return provider.id === "pragmatic";
  if (filterId === "buy-feature") return true;
  if (filterId === "jackpot") return provider.id === "jili";
  if (filterId === "megaways") return provider.id === "pragmatic";
  if (filterId === "chicken") return false;
  return true;
}

function matchesCasinoFilter(item: CasinoCardItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (item.tags && item.tags.includes(filterId)) return true;
  return false;
}

function matchesSportFilter(item: SportCardItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (item.tags && item.tags.includes(filterId)) return true;
  return false;
}

function matchesFishingFilter(item: FishingCardItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (item.tags && item.tags.includes(filterId)) return true;
  return false;
}

/**
 * กริดค่ายเกมใต้ CategoryNav หน้าแรก — ใช้ layout เดียวกับ /slots, /casino, /sport
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function LobbyCategoryProviders({ categoryId }: LobbyCategoryProvidersProps) {
  if (categoryId === "home") {
    return null;
  }
  return <LobbyCategoryProvidersContent categoryId={categoryId} />;
}

function LobbyCategoryProvidersContent({ categoryId }: LobbyCategoryProvidersProps) {
  const [activeFilterId, setActiveFilterId] = useState("all-in-one");
  const [searchQuery, setSearchQuery] = useState("");
  const [slotProviderId, setSlotProviderId] = useState<string | null>(null);

  useEffect(() => {
    setSlotProviderId(null);
    setActiveFilterId("all-in-one");
    setSearchQuery("");
  }, [categoryId]);

  const slotsContent = useMemo(() => {
    let grid = GRID_SLOT_PROVIDERS.filter((p) => matchesGridFilter(p, activeFilterId));
    let featured = FEATURED_SLOT_PROVIDERS.filter((p) =>
      matchesFeaturedFilter(p, activeFilterId),
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      grid = grid.filter((p) => p.name.toLowerCase().includes(q));
      featured = featured.filter((p) => p.name.toLowerCase().includes(q));
    }

    const totalCount =
      activeFilterId === "all-in-one" && !searchQuery.trim()
        ? 42
        : featured.length + grid.length;

    return { grid, featured, totalCount };
  }, [activeFilterId, searchQuery]);

  const casinoContent = useMemo(() => {
    let list = CASINO_ITEMS.filter((item) => matchesCasinoFilter(item, activeFilterId));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.provider.toLowerCase().includes(q),
      );
    }
    const totalCount =
      activeFilterId === "all-in-one" && !searchQuery.trim()
        ? CASINO_ITEMS.length
        : list.length;
    return { list, totalCount };
  }, [activeFilterId, searchQuery]);

  const sportContent = useMemo(() => {
    let list = SPORT_ITEMS.filter((item) => matchesSportFilter(item, activeFilterId));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.provider.toLowerCase().includes(q),
      );
    }
    const totalCount =
      activeFilterId === "all-in-one" && !searchQuery.trim()
        ? SPORT_ITEMS.length
        : list.length;
    return { list, totalCount };
  }, [activeFilterId, searchQuery]);

  const fishingContent = useMemo(() => {
    let list = FISHING_ITEMS.filter((item) => matchesFishingFilter(item, activeFilterId));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.provider.toLowerCase().includes(q),
      );
    }
    const totalCount =
      activeFilterId === "all-in-one" && !searchQuery.trim()
        ? FISHING_ITEMS.length
        : list.length;
    return { list, totalCount };
  }, [activeFilterId, searchQuery]);

  if (categoryId === "lottery") {
    return (
      <section className="lobby-category-providers mt-1 min-w-0" aria-label="หวย">
        <div key={categoryId} className="lobby-category-providers__swap min-w-0">
          <LotteryHubContent />
        </div>
      </section>
    );
  }

  const hasProviderGrid =
    categoryId === "casino" ||
    categoryId === "slots" ||
    categoryId === "sports" ||
    categoryId === "fishing";

  if (!hasProviderGrid) {
    return (
      <section
        className="lobby-category-providers mt-1 rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]"
        aria-live="polite"
      >
        กำลังเตรียมค่ายเกมในหมวดนี้ — ลองเลือกคาสิโน สล็อต ยิงปลา หรือกีฬาก่อนนะ
      </section>
    );
  }

  const filterTabs =
    categoryId === "slots"
      ? SLOT_FILTER_TABS
      : categoryId === "casino"
        ? CASINO_FILTER_TABS
        : categoryId === "fishing"
          ? FISHING_FILTER_TABS
          : SPORT_FILTER_TABS;

  const sectionTitle =
    categoryId === "casino"
      ? "ไลฟ์คาสิโน"
      : categoryId === "slots"
        ? "สล็อต"
        : categoryId === "fishing"
          ? "ยิงปลา"
          : categoryId === "sports"
            ? "กีฬา"
            : "ค่ายเกม";

  const providerTotal =
    categoryId === "slots"
      ? slotsContent.totalCount
      : categoryId === "casino"
        ? casinoContent.totalCount
        : categoryId === "fishing"
          ? fishingContent.totalCount
          : categoryId === "sports"
            ? sportContent.totalCount
            : 0;

  const handleSlotProviderSelect = (provider: SlotProviderPick) => {
    setSlotProviderId(provider.id);
  };

  if (categoryId === "slots" && slotProviderId) {
    return (
      <section
        className="lobby-category-providers flex min-w-0 flex-col gap-3"
        aria-label="รายการเกมสล็อตตามค่ายที่เลือก"
      >
        <LobbySlotProviderView
          providerId={slotProviderId}
          onBack={() => setSlotProviderId(null)}
        />
      </section>
    );
  }

  return (
    <section
      className="lobby-category-providers flex min-w-0 flex-col gap-3"
      aria-label="รายการค่ายเกมตามหมวดที่เลือก"
    >
      <ProviderCategoryToolbar
        scopeKey={categoryId}
        tabs={filterTabs}
        activeTabId={activeFilterId}
        onSelectTab={setActiveFilterId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder={
          categoryId === "casino"
            ? "ค้นหาคาสิโนสด | ค่าย"
            : categoryId === "fishing"
              ? "ค้นหายิงปลา | ค่าย"
              : categoryId === "sports"
                ? "ค้นหากีฬา | ค่าย"
                : "ค้นหาเกม | ค่าย"
        }
        categoryGroupLabel={
          categoryId === "casino"
            ? "ประเภทโต๊ะ"
            : categoryId === "fishing"
              ? "ประเภทยิงปลา"
              : categoryId === "sports"
                ? "ประเภทกีฬา"
                : "ฟีเจอร์"
        }
      />

      <div
        key={categoryId}
        className="lobby-category-providers__swap flex min-w-0 flex-col gap-3"
      >
        <CategorySectionHead
          start={
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] sm:text-xl">
              {sectionTitle}
            </h2>
          }
          meta={
            <span className="text-xs font-semibold text-[var(--text-muted)] sm:text-sm">
              ({providerTotal} ค่ายเกม)
            </span>
          }
        />

        {categoryId === "slots" ? (
          <SlotProviderCards
            featuredProviders={slotsContent.featured}
            gridProviders={slotsContent.grid}
            totalCount={slotsContent.totalCount}
            hideTitleRow
            onProviderSelect={handleSlotProviderSelect}
          />
        ) : null}

        {categoryId === "casino" ? (
          <CasinoProviderCards
            items={casinoContent.list}
            totalCount={casinoContent.totalCount}
            hideTitleRow
          />
        ) : null}

        {categoryId === "sports" ? (
          <SportProviderCards
            items={sportContent.list}
            totalCount={sportContent.totalCount}
            hideTitleRow
          />
        ) : null}

        {categoryId === "fishing" ? (
          <SportProviderCards
            items={fishingContent.list}
            totalCount={fishingContent.totalCount}
            hideTitleRow
            sectionTitle="ยิงปลา"
          />
        ) : null}
      </div>
    </section>
  );
}
