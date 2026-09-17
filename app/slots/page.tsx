"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../components/layout/Header";
import { RightMenuDrawer } from "../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../components/slots/SlotProvidersHeader";
import { ProviderCategoryToolbar } from "../components/slots/ProviderCategoryToolbar";
import { SlotProviderCards } from "../components/slots/SlotProviderCards";
import { FloatingBottomNav } from "../components/layout/FloatingBottomNav";
import {
  FEATURED_SLOT_PROVIDERS,
  GRID_SLOT_PROVIDERS,
  SLOT_FILTER_TABS,
  FeaturedSlotProviderItem,
  GridSlotProviderItem,
} from "../data/slotProvidersData";
import { BOTTOM_NAV_DATA } from "../data/lobbyMockData";

/**
 * ฟังก์ชันตรวจสอบความเข้ากันได้ของค่ายเกมกับแท็บตัวกรอง
 */
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
    return [
      "big-time-gaming",
      "blueprint",
      "red-tiger",
      "royal-slot-gaming",
    ].includes(provider.id);
  }
  return true;
}

function matchesFeaturedFilter(
  provider: FeaturedSlotProviderItem,
  filterId: string
): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (filterId === "drops-and-wins") return provider.id === "pragmatic";
  if (filterId === "buy-feature") return true;
  if (filterId === "jackpot") return provider.id === "jili";
  if (filterId === "megaways") return provider.id === "pragmatic";
  if (filterId === "chicken") return false;
  return true;
}

/**
 * หน้าค่ายเกมส์สล็อต (/slots)
 * แสดงรายการค่ายเกมสล็อตตาม Layout ใน Mockup:
 * - Header หลักด้านบนสุด (Cosmicbet Logo · Auth · Menu)
 * - Header ย่อยย้อนกลับ < และหัวข้อ "สล็อต"
 * - แถบตัวกรองสล็อต (SlotFilterTabs) ใช้สไตล์เดิม (Card Button ม่วงเข้มเรืองแสง) พร้อม mock ข้อมูลใหม่สำหรับสล็อต
 * - ช่องค้นหาเกมและค่ายเกม (GameSearchBar) "Game | Provider"
 * - 2 แบนเนอร์ใหญ่ (JILI 🔥 HOT และ PRAGMATIC PLAY)
 * - กริด 2 คอลัมน์ (YGR, KING MIDAS, Spadegaming, JOKER, FA CHAI, ฯลฯ)
 */
export default function SlotProvidersPage() {
  // สถานะเปิด-ปิดของ Menu Slide Over ด้านขวา
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // แท็บตัวกรองที่เลือก (ค่าเริ่มต้น: "all-in-one" ศูนย์รวม)
  const [activeFilterId, setActiveFilterId] = useState<string>("all-in-one");
  // ข้อความค้นหา
  const [searchQuery, setSearchQuery] = useState<string>("");

  // กรองค่ายเกมตามแท็บตัวกรองและคำค้นหา
  const filteredGridProviders = useMemo(() => {
    let list = GRID_SLOT_PROVIDERS.filter((p) =>
      matchesGridFilter(p, activeFilterId)
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return list;
  }, [activeFilterId, searchQuery]);

  // กรองแบนเนอร์เด่นตามแท็บตัวกรองและคำค้นหา
  const filteredFeaturedProviders = useMemo(() => {
    let list = FEATURED_SLOT_PROVIDERS.filter((p) =>
      matchesFeaturedFilter(p, activeFilterId)
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return list;
  }, [activeFilterId, searchQuery]);

  // จำนวนค่ายเกมทั้งหมดที่ตรงกับตัวกรอง
  const totalCount =
    activeFilterId === "all-in-one" && !searchQuery.trim()
      ? 42
      : filteredFeaturedProviders.length + filteredGridProviders.length;

  return (
    <div className="min-h-screen bg-[#090b18] text-[var(--text-primary)]">
      {/* 1. Header หลักด้านบน (Cosmicbet Logo · LOG IN / SIGN UP · Hamburger Menu) */}
      <Header />

      {/* Menu Slide Over ด้านขวา */}
      <RightMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 2. Header ย่อยย้อนกลับ < สล็อต */}
      <SlotProvidersHeader title="สล็อต" backHref="/" />

      {/* Main Content */}
      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-1">
        {/* 3. แถบตัวกรองสล็อต ใช้สไตล์เดิม (Card Button เรืองแสง) พร้อม mock ข้อมูลใหม่สำหรับสล็อต */}
        <ProviderCategoryToolbar
          tabs={SLOT_FILTER_TABS}
          activeTabId={activeFilterId}
          onSelectTab={setActiveFilterId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="ค้นหาเกม | ค่าย"
          categoryGroupLabel="ฟีเจอร์"
        />

        {/* 5. แบนเนอร์ใหญ่ 2 ค่าย และกริดค่ายเกม 2 คอลัมน์ */}
        <SlotProviderCards
          featuredProviders={filteredFeaturedProviders}
          gridProviders={filteredGridProviders}
          totalCount={totalCount}
        />
      </main>

      {/* 6. Floating Bottom Navigation */}
      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
