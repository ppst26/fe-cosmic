"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../components/layout/Header";
import { RightMenuDrawer } from "../components/layout/RightMenuDrawer";
import { SlotProvidersHeader } from "../components/slots/SlotProvidersHeader";
import { ProviderCategoryToolbar } from "../components/slots/ProviderCategoryToolbar";
import { SportProviderCards } from "../components/sport/SportProviderCards";
import { FloatingBottomNav } from "../components/layout/FloatingBottomNav";
import {
  SPORT_ITEMS,
  SPORT_FILTER_TABS,
  SportCardItem,
} from "../data/sportProvidersData";
import { BOTTOM_NAV_DATA } from "../data/lobbyMockData";

/**
 * ฟังก์ชันตรวจสอบว่ารายการกีฬาตรงกับแท็บตัวกรองที่เลือกหรือไม่
 */
function matchesSportFilter(item: SportCardItem, filterId: string): boolean {
  if (filterId === "all-in-one" || filterId === "all-providers") return true;
  if (item.tags && item.tags.includes(filterId)) return true;
  return false;
}

/**
 * หน้าค่ายเกมส์กีฬา (/sport)
 * จัดแสดงผลเป็น 3 คอลัมน์แนวตั้งตามแบบภาพอ้างอิง:
 * - Header หลักด้านบน (Cosmicbet Logo · Auth · Menu)
 * - Header ย่อยย้อนกลับ < และหัวข้อ "กีฬา"
 * - แถบตัวกรองกีฬา (SlotFilterTabs พร้อมหมวดหมู่กีฬา)
 * - ช่องค้นหาเกมและค่ายเกม (GameSearchBar) "Game | Provider" (ไม่มี ring/outline)
 * - กริด 3 คอลัมน์แนวตั้ง (EXCLUSIVE / LIVE Badges, Sports Artwork, Bold Title, Provider Name)
 * - Floating Bottom Navigation
 */
export default function SportProvidersPage() {
  // สถานะเปิด-ปิดของ Menu Slide Over ด้านขวา
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // แท็บตัวกรองที่เลือก (ค่าเริ่มต้น: "all-in-one" ศูนย์รวม)
  const [activeFilterId, setActiveFilterId] = useState<string>("all-in-one");
  // ข้อความค้นหา
  const [searchQuery, setSearchQuery] = useState<string>("");

  // กรองรายการเกมตามแท็บตัวกรองและคำค้นหา
  const filteredItems = useMemo(() => {
    let list = SPORT_ITEMS.filter((item) =>
      matchesSportFilter(item, activeFilterId)
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
      ? SPORT_ITEMS.length
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

      {/* 2. Header ย่อยย้อนกลับ < กีฬา */}
      <SlotProvidersHeader title="กีฬา" backHref="/" />

      {/* Main Content */}
      <main className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter)] pb-28 pt-1">
        {/* 3. แถบตัวกรองกีฬา */}
        <ProviderCategoryToolbar
          tabs={SPORT_FILTER_TABS}
          activeTabId={activeFilterId}
          onSelectTab={setActiveFilterId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="ค้นหากีฬา | ค่าย"
          categoryGroupLabel="ประเภทกีฬา"
        />

        {/* 5. กริดกีฬา 3 คอลัมน์ตามแบบภาพอ้างอิง */}
        <SportProviderCards
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
