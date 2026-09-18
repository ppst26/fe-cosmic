"use client";

import React, { useState } from "react";
import { Header } from "./components/layout/Header";
import { LobbyDesktopRightRail } from "./components/layout/LobbyDesktopRightRail";
import { RightMenuDrawer } from "./components/layout/RightMenuDrawer";
import { SignUpBottomDrawer } from "./components/auth/SignUpBottomDrawer";
import { LoginBottomDrawer } from "./components/auth/LoginBottomDrawer";
import { AuthGate, useAuth } from "./components/auth/AuthProvider";
import {
  LobbyDesktopSidebar,
  useLobbySidebarCollapsed,
} from "./components/layout/LobbyDesktopSidebar";
import { HomeDesktopHeroRow } from "./components/home/HomeDesktopHeroRow";
import { HomeDesktopFeaturePromos } from "./components/home/HomeDesktopFeaturePromos";
import { WelcomeBanner } from "./components/home/WelcomeBanner";
import { PromoCarousel } from "./components/home/PromoCarousel";
import { CosmicIntro } from "./components/home/CosmicIntro";
import { PopularHighlights } from "./components/home/PopularHighlights";
import { CategoryNav } from "./components/home/CategoryNav";
import { LobbyCategoryProviders } from "./components/home/LobbyCategoryProviders";
import { GameSection } from "./components/home/GameSection";
import { ProvidersSection } from "./components/home/ProvidersSection";
import { FeatureActionCards } from "./components/home/FeatureActionCards";
import { JackpotSection } from "./components/home/JackpotSection";
import { HallOfFame } from "./components/home/HallOfFame";
import { FloatingBottomNav } from "./components/layout/FloatingBottomNav";
import { useVipModal } from "./components/vip/VipModalProvider";
import { useCouponRedeem } from "./components/coupon/CouponRedeemProvider";
import type { CategoryId } from "./types/lobby";
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
 * มือถือ: design.md หมวด 5 · Desktop (lg+): frame กลาง max 1680 — sidebar · main · แถบขวา
 */
export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("home");
  const { collapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useLobbySidebarCollapsed(false);
  const { logout } = useAuth();
  const { openVipModal } = useVipModal();
  const { openCouponRedeem } = useCouponRedeem();

  const openSignUp = () => setIsSignUpOpen(true);
  const openLogin = () => setIsLoginOpen(true);

  const handleSidebarMenuAction = (action: "vip-rank" | "coupon") => {
    if (action === "vip-rank") openVipModal();
    if (action === "coupon") openCouponRedeem();
  };

  const isHomeLobby = activeCategoryId === "home";
  const showMobileLobbySections = isHomeLobby ? "" : "lg:hidden";

  return (
    <>
      <div
        className={`lobby-desktop-shell${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
      >
        <div className="lobby-desktop-shell__header-band">
          <Header onSignUpClick={openSignUp} onLoginClick={openLogin} />
        </div>

        <div className="lobby-desktop-shell__frame">
        <div className="lobby-desktop-shell__row">
          <LobbyDesktopSidebar
            categories={CATEGORIES_DATA}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            navigationMode="none"
            collapsed={isSidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onMenuAction={handleSidebarMenuAction}
            onLogout={() => void logout()}
          />

          <div className="lobby-desktop-main min-w-0 flex-1">
            <div className="lobby-desktop-workspace">
              <div className="lobby-desktop-center min-w-0 flex-1">
                <RightMenuDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              />

              <SignUpBottomDrawer
                isOpen={isSignUpOpen}
                onClose={() => setIsSignUpOpen(false)}
                onLoginClick={openLogin}
              />

              <LoginBottomDrawer
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSignUpClick={openSignUp}
              />

              <main className="page-shell page-shell--lobby flex min-h-0 min-w-0 flex-col overflow-x-clip pb-0 lg:pb-4">
                <div className="lg:hidden">
                  <WelcomeBanner onCtaClick={openSignUp} />
                  <PromoCarousel items={PROMO_CAROUSEL_DATA} />
                </div>

                <HomeDesktopHeroRow onCtaClick={openSignUp} />

                <div className="relative -mx-[var(--page-gutter)] flex flex-col gap-4 overflow-hidden rounded-none px-[var(--page-gutter)] pb-6 pt-1 lg:mx-0 lg:gap-3 lg:px-0 lg:pb-0 lg:pt-0">
                  <div
                    className="lobby-zone-bg pointer-events-none absolute inset-0 lg:hidden"
                    aria-hidden="true"
                  />
                  <div className="relative flex min-w-0 flex-col gap-4 lg:gap-3">
                    <div className={showMobileLobbySections}>
                      <div className="lg:hidden">
                        <CosmicIntro stats={INTRO_STATS_DATA} />
                      </div>
                      {/* ยอดนิยม 2 การ์ด — โฮม: เฉพาะมือถือ · หมวดอื่น: มือถือ (ซ่อน lg ผ่าน showMobileLobbySections) */}
                      <div className={isHomeLobby ? "lg:hidden" : undefined}>
                        <PopularHighlights items={POPULAR_HIGHLIGHTS_DATA} />
                      </div>
                    </div>

                    <div className="lobby-category-stack">
                      <CategoryNav
                        categories={CATEGORIES_DATA}
                        activeId={activeCategoryId}
                        defaultActiveId={activeCategoryId}
                        navigationMode="none"
                        onSelectCategory={setActiveCategoryId}
                      />
                      <LobbyCategoryProviders categoryId={activeCategoryId} />
                    </div>

                    {!isHomeLobby ? <HomeDesktopFeaturePromos /> : null}

                    <div className={showMobileLobbySections}>
                      {GAME_SECTIONS_DATA.map((section) => (
                        <GameSection key={section.id} section={section} />
                      ))}
                      <ProvidersSection providers={PROVIDERS_DATA} />
                    </div>
                  </div>
                </div>

                <div className="lg:hidden">
                  <FeatureActionCards items={FEATURE_ACTIONS_DATA} />

                  <AuthGate
                    fallback={
                      <section className="mt-8 w-full px-[var(--page-gutter)] sm:mt-10">
                        <p className="rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
                          เข้าสู่ระบบหรือสมัครสมาชิกเพื่อดูรายชื่อผู้ชนะ Jackpot
                        </p>
                      </section>
                    }
                  >
                    <JackpotSection winners={JACKPOT_WINNERS_DATA} />
                  </AuthGate>

                  <FloatingBottomNav
                    items={BOTTOM_NAV_DATA}
                    isMenuOpen={isMenuOpen}
                    onMenuClick={() => setIsMenuOpen(true)}
                  />
                </div>

                <div className={isHomeLobby ? undefined : "lg:hidden"}>
                  <HallOfFame datasets={HALL_OF_FAME_DATA} />
                </div>
              </main>
              </div>

            <LobbyDesktopRightRail onMenuAction={handleSidebarMenuAction} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
