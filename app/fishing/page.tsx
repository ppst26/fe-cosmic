"use client";

import React, { useMemo, useState } from "react";
import { Header } from "../components/layout/Header";
import { RightMenuDrawer } from "../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../components/slots/SlotProvidersHeader";
import { ProviderCategoryToolbar } from "../components/slots/ProviderCategoryToolbar";
import { SportProviderCards } from "../components/sport/SportProviderCards";
import { FloatingBottomNav } from "../components/layout/FloatingBottomNav";
import {
  FISHING_FILTER_TABS,
  FISHING_ITEMS,
  type FishingCardItem,
} from "../data/fishingProvidersData";
import { BOTTOM_NAV_DATA } from "../data/lobbyMockData";

/**
 * ตรวจว่ารายการยิงปลาตรงกับแท็บตัวกรองที่เลือกหรือไม่
 */
function matchesFishingFilter(item: FishingCardItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (item.tags && item.tags.includes(filterId)) return true;
  return false;
}

/**
 * หน้ารวมค่ายยิงปลา (/fishing) — กริด 3 คอลัมน์ + รูปจาก public/fishing
 */
export default function FishingProvidersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState<string>("all-in-one");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    let list = FISHING_ITEMS.filter((item) => matchesFishingFilter(item, activeFilterId));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.provider.toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeFilterId, searchQuery]);

  const totalCount =
    activeFilterId === "all-in-one" && !searchQuery.trim()
      ? FISHING_ITEMS.length
      : filteredItems.length;

  return (
    <div className="min-h-screen bg-[#090b18] text-[var(--text-primary)]">
      <Header />
      <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <SlotProvidersHeader title="ยิงปลา" backHref="/" />

      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-1">
        <ProviderCategoryToolbar
          tabs={FISHING_FILTER_TABS}
          activeTabId={activeFilterId}
          onSelectTab={setActiveFilterId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="ค้นหายิงปลา | ค่าย"
          categoryGroupLabel="ประเภทยิงปลา"
        />

        <SportProviderCards items={filteredItems} totalCount={totalCount} />
      </main>

      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
