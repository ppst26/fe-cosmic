"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../components/layout/Header";
import { RightMenuDrawer } from "../../components/layout/RightMenuDrawer";
import { ProviderBreadcrumb } from "../../components/slots/ProviderBreadcrumb";
import { GameSearchBar } from "../../components/home/GameSearchBar";
import { ProviderGameGrid } from "../../components/slots/ProviderGameGrid";
import { FloatingBottomNav } from "../../components/layout/FloatingBottomNav";
import { BOTTOM_NAV_DATA } from "../../data/lobbyMockData";
import {
  getGamesByProvider,
  PROVIDER_INFO_MAP,
} from "../../data/providerGamesData";

/**
 * หน้ารายการเกมของค่ายเกมสล็อต (/slots/[provider])
 * เช่น /slots/pragmatic, /slots/jili
 * องค์ประกอบตามภาพตัวอย่าง:
 * 1. Breadcrumb (< สล็อต / PRAGMATIC PLAY)
 * 2. Search Bar สไตล์มาตรฐาน (ค้นหาเกมในค่ายนี้)
 * 3. หัวข้อค่ายเกม (PRAGMATIC PLAY พร้อมตราสัญลักษณ์)
 * 4. ลิสต์เกมแบบกริด 4 คอลัมน์ (Thumbnail + Heart Wishlist + ชื่อเกม)
 * 5. Layout Header บนสุด และ FloatingBottomNav ล่างสุด
 */
export default function ProviderGamesPage() {
  const urlParams = useParams();
  const rawProvider = (urlParams?.provider as string) || "pragmatic";
  const providerId = rawProvider.toLowerCase();

  // สถานะเปิด-ปิดของ Menu Slide Over ด้านขวา
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ข้อความค้นหาเกมภายในค่าย
  const [searchQuery, setSearchQuery] = useState("");

  // ข้อมูลค่ายเกม
  const providerInfo = useMemo(() => {
    return (
      PROVIDER_INFO_MAP[providerId] || {
        id: providerId,
        name: providerId.replace(/-/g, " ").toUpperCase(),
        totalGames: 100,
      }
    );
  }, [providerId]);

  // รายการเกมทั้งหมดของค่ายนี้
  const allGames = useMemo(() => {
    return getGamesByProvider(providerId);
  }, [providerId]);

  // รายการเกมที่ผ่านการค้นหา
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return allGames;
    const q = searchQuery.toLowerCase().trim();
    return allGames.filter((game) => game.title.toLowerCase().includes(q));
  }, [allGames, searchQuery]);

  return (
    <div className="mobile-standalone-page">
      {/* 1. Global Header ด้านบนสุด */}
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      {/* Menu Slide Over ด้านขวา */}
      <RightMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 2. Breadcrumb (< สล็อต / PRAGMATIC PLAY) */}
      <ProviderBreadcrumb
        providerName={providerInfo.name}
        backHref="/slots"
      />

      {/* Main Content */}
      <main className="mobile-standalone-main pt-2">
        {/* 3. Search Bar สไตล์มาตรฐาน ไร้ ring/outline */}
        <GameSearchBar
          placeholder="ค้นหาเกมในค่ายนี้"
          onSearch={setSearchQuery}
        />

        {/* 4. หัวข้อค่ายเกม (Provider Heading) ตามภาพตัวอย่าง */}
        <div className="mt-3 mb-1 flex items-center gap-2">
          <h1 className="text-xl font-medium uppercase tracking-tight text-white drop-shadow sm:text-2xl">
            {providerInfo.name}
          </h1>

          {/* ตราสัญลักษณ์มงกุฎ PLAY สำหรับ Pragmatic Play ตามภาพ */}
          {providerId === "pragmatic" && (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 px-2 py-0.5 text-black shadow-md select-none">
              <span className="text-xs">👑</span>
              <span className="text-[10px] font-medium tracking-tight">PLAY™</span>
            </div>
          )}
        </div>

        {/* 5. กริดรายการเกม 4 คอลัมน์บนมือถือ */}
        <ProviderGameGrid
          games={filteredGames}
          onPlayGame={(game) => {
            console.log("Play game:", game.title);
          }}
        />
      </main>

      {/* 6. Floating Bottom Navigation ล่างสุด */}
      <FloatingBottomNav
        items={BOTTOM_NAV_DATA}
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen(true)}
      />
    </div>
  );
}
