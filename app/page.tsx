import React from "react";
import { Header } from "./components/layout/Header";
import { WelcomeBanner } from "./components/home/WelcomeBanner";
import { PromoCarousel } from "./components/home/PromoCarousel";
import { CosmicIntro } from "./components/home/CosmicIntro";
import { PopularHighlights } from "./components/home/PopularHighlights";
import { CategoryNav } from "./components/home/CategoryNav";
import { GameSearchBar } from "./components/home/GameSearchBar";
import { GameSection } from "./components/home/GameSection";
import { ProvidersSection } from "./components/home/ProvidersSection";
import { FeatureActionCards } from "./components/home/FeatureActionCards";
import { JackpotSection } from "./components/home/JackpotSection";
import { HallOfFame } from "./components/home/HallOfFame";
import { FloatingBottomNav } from "./components/layout/FloatingBottomNav";
import {
  CATEGORIES_DATA,
  PROMO_CAROUSEL_DATA,
  INTRO_STATS_DATA,
  POPULAR_HIGHLIGHTS_DATA,
  GAME_SECTIONS_DATA,
  PROVIDERS_DATA,
  FEATURE_ACTIONS_DATA,
  JACKPOT_WINNERS_DATA,
  HALL_OF_FAME_DATA,
  BOTTOM_NAV_DATA,
} from "./data/lobbyMockData";

/**
 * Cosmicbet Home Lobby Page
 * ประกอบ Components ตามลำดับหน้าใน design.md หมวด 5 (ข้อ 1–13 ตามภาพ mockup):
 * 1. Header (โลโก้ · Log in / Sign up กลาง · เมนูแฮมเบอร์ger)
 * 2. Welcome Banner (Welcome Pack, Rakeback Up to 100%, Sign Up CTA)
 * 3. Promotional Carousel (Loyalty v2.0, Dots Pagination)
 * 4. Cosmic Intro (อาณาจักรแห่งความมันส์)
 * 5. ยอดนิยม (Swipe Bet, DEXY RACE)
 * 6. หมวดหมู่เกม 6 หมวด (Lobby, Originals, Slots, Live Casino, Game Shows, Table Games)
 * 7. Game Searchbar (Game | Provider)
 * 8–12. หมวดเกม: เกมยอดฮิต / SLOTS / คาสิโน / ยิงปลา / กีฬา
 * 13. Providers
 * 14–17. Feature cards, Jackpot, Hall of Fame, Floating Bottom Nav
 */
export default function HomePage() {
  return (
    <>
      <Header />

      <main className="page-shell flex min-h-screen min-w-0 max-w-full flex-col justify-start overflow-x-clip">
      {/* 2. Welcome Hero Banner */}
      <WelcomeBanner />

      {/* 3. Promotional Carousel แบนเนอร์โปรโมชัน */}
      <PromoCarousel items={PROMO_CAROUSEL_DATA} />

      {/* 4. Cosmic Intro — ดาวซ้าย ดาวเสาร์ขวา และข้อความแนะนำ */}
      <CosmicIntro stats={INTRO_STATS_DATA} />

      {/* 5. รายการ "ยอดนิยม" (Swipe Bet & DEXY RACE) */}
      <PopularHighlights items={POPULAR_HIGHLIGHTS_DATA} />

      {/* 6. แถบหมวดหมู่เกม 6 หมวด */}
      <CategoryNav categories={CATEGORIES_DATA} defaultActiveId="lobby" />

      {/* 7. ช่องค้นหาเกมและค่ายเกม */}
      <GameSearchBar />

      {/* 8–12. แถวเกมแต่ละหมวด render จาก data array */}
      {GAME_SECTIONS_DATA.map((section) => (
        <GameSection key={section.id} section={section} />
      ))}

      {/* 13. Providers — เว้นด้านบนมากกว่า section ปกติ */}
      <ProvidersSection providers={PROVIDERS_DATA} />

      {/* 14. การ์ดฟีเจอร์ — หัวข้อซ้าย ไอคอนขวา */}
      <FeatureActionCards items={FEATURE_ACTIONS_DATA} />

      {/* 15. Jackpot — grid 3 คอลัมน์ */}
      <JackpotSection winners={JACKPOT_WINNERS_DATA} />

      {/* 16. Hall of Fame — tabs + ตาราง */}
      <HallOfFame datasets={HALL_OF_FAME_DATA} />

      {/* 17. เมนูล่าง fixed */}
      <FloatingBottomNav items={BOTTOM_NAV_DATA} />
      </main>
    </>
  );
}
