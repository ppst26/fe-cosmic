"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../components/layout/Header";
import { RightMenuDrawer } from "../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../components/slots/SlotProvidersHeader";
import { ProviderCategoryToolbar } from "../components/slots/ProviderCategoryToolbar";
import { CasinoProviderCards } from "../components/casino/CasinoProviderCards";
import { FloatingBottomNav } from "../components/layout/FloatingBottomNav";
import {
  CASINO_ITEMS,
  CASINO_FILTER_TABS,
  CasinoCardItem,
} from "../data/casinoProvidersData";
import { BOTTOM_NAV_DATA } from "../data/lobbyMockData";

/**
 * ฟังก์ชันตรวจสอบว่ารายการคาสิโนสดตรงกับแท็บตัวกรองที่เลือกหรือไม่
 */
function matchesCasinoFilter(item: CasinoCardItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (item.tags && item.tags.includes(filterId)) return true;
  return false;
}

/**
 * หน้าค่ายเกมส์คาสิโนสด (/casino)
 * จัดแสดงผลเป็น 3 คอลัมน์แนวตั้งตามแบบภาพอ้างอิง:
 * - Header หลักด้านบน (Cosmicbet Logo · Auth · Menu)
 * - Header ย่อยย้อนกลับ < และหัวข้อ "คาสิโนสด"
 * - แถบตัวกรองคาสิโนสด (SlotFilterTabs พร้อมหมวดหมู่คาสิโน)
 * - ช่องค้นหาเกมและค่ายเกม (GameSearchBar) "Game | Provider" (ไม่มี ring/outline)
 * - กริด 3 คอลัมน์แนวตั้ง (EXCLUSIVE / LIVE Badges, Dealer Artwork, Bold Title, Provider Name)
 * - Floating Bottom Navigation
 */
export default function CasinoProvidersPage() {
  // สถานะเปิด-ปิดของ Menu Slide Over ด้านขวา
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // แท็บตัวกรองที่เลือก (ค่าเริ่มต้น: "all-in-one" ศูนย์รวม)
  const [activeFilterId, setActiveFilterId] = useState<string>("all-in-one");
  // ข้อความค้นหา
  const [searchQuery, setSearchQuery] = useState<string>("");

  // กรองรายการเกมตามแท็บตัวกรองและคำค้นหา
  const filteredItems = useMemo(() => {
    let list = CASINO_ITEMS.filter((item) =>
      matchesCasinoFilter(item, activeFilterId)
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.provider.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeFilterId, searchQuery]);

  // จำนวนรายการทั้งหมดที่ตรงกับตัวกรอง
  const totalCount =
    activeFilterId === "all-in-one" && !searchQuery.trim()
      ? CASINO_ITEMS.length
      : filteredItems.length;

  return (
    <div className="min-h-screen bg-[#090b18] text-[var(--text-primary)]">
      {/* 1. Header หลักด้านบน (Cosmicbet Logo · LOG IN / SIGN UP · Hamburger Menu) */}
      <Header />

      {/* Menu Slide Over ด้านขวา */}
      <RightMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 2. Header ย่อยย้อนกลับ < คาสิโนสด */}
      <SlotProvidersHeader title="คาสิโนสด" backHref="/" />

      {/* Main Content */}
      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-1">
        {/* 3. แถบตัวกรองคาสิโนสด */}
        <ProviderCategoryToolbar
          tabs={CASINO_FILTER_TABS}
          activeTabId={activeFilterId}
          onSelectTab={setActiveFilterId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="ค้นหาคาสิโนสด | ค่าย"
          categoryGroupLabel="ประเภทโต๊ะ"
        />

        {/* 5. กริดคาสิโนสด 3 คอลัมน์ตามแบบภาพอ้างอิง */}
        <CasinoProviderCards
          items={filteredItems}
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
