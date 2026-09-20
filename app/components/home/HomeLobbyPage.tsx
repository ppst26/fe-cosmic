"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "../layout/Header";
import { RightMenuDrawer } from "../layout/RightMenuDrawer";
import { SignUpBottomDrawer } from "../auth/SignUpBottomDrawer";
import { LoginBottomDrawer } from "../auth/LoginBottomDrawer";
import { AuthGate } from "../auth/AuthProvider";
import { useLobbyShellSidebar } from "../layout/LobbyShellSidebarContext";
import { LobbyDesktopSidebarColumn } from "../layout/LobbyDesktopSidebarColumn";
import { HomeDesktopHeroRow } from "./HomeDesktopHeroRow";
import { HomeDesktopPeekCarousel } from "./HomeDesktopPeekCarousel";
import { WelcomeBanner } from "./WelcomeBanner";
import { PromoCarousel } from "./PromoCarousel";
import { CosmicIntro } from "./CosmicIntro";
import { PopularHighlights } from "./PopularHighlights";
import { CategoryNav } from "./CategoryNav";
import { LobbyCategoryProviders } from "./LobbyCategoryProviders";
import { GameSection } from "./GameSection";
import { ProvidersSection } from "./ProvidersSection";
import { JackpotSection } from "./JackpotSection";
import { HallOfFame } from "./HallOfFame";
import { TournamentsSection } from "./TournamentsSection";
import { FloatingBottomNav } from "../layout/FloatingBottomNav";
import { useVipModal } from "../vip/VipModalProvider";
import { useCouponRedeem } from "../coupon/CouponRedeemProvider";
import { resolveLobbyCategoryFromPath } from "@/app/lib/lobbyCategoryFromPath";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import {
  CATEGORIES_DATA,
  PROMO_CAROUSEL_DATA,
  INTRO_STATS_DATA,
  POPULAR_HIGHLIGHTS_DATA,
  GAME_SECTIONS_DATA,
  HOME_LOBBY_TOURNAMENT_ITEMS,
  LOBBY_TOURNAMENTS_SECTION_ITEMS,
  HALL_OF_FAME_DATA,
  BOTTOM_NAV_DATA,
} from "@/app/data/lobbyMockData";

/**
 * หน้า lobby หลัก — หมวดซิงก์จาก URL (/slots, /casino ฯลฯ)
 * ใช้ใน app/page.tsx และเส้นทางหมวดที่แชร์ layout เดียวกัน
 */
export function HomeLobbyPage() {
  const pathname = usePathname();
  const activeCategoryId = useMemo(
    () => resolveLobbyCategoryFromPath(pathname, CATEGORIES_DATA) ?? "home",
    [pathname],
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen: isSignUpOpen, open: openSignUp, close: closeSignUp } = useOverlayLayer("signup");
  const { isOpen: isLoginOpen, open: openLogin, close: closeLogin } = useOverlayLayer("login");
  const { sidebarHidden: isSidebarCollapsed } = useLobbyShellSidebar();
  const { openVipModal } = useVipModal();
  const { openCouponRedeem } = useCouponRedeem();

  const handleSidebarMenuAction = (action: "vip-rank" | "coupon") => {
    if (action === "vip-rank") openVipModal();
    if (action === "coupon") openCouponRedeem();
  };

  const isHomeLobby = activeCategoryId === "home";
  /** ยอดนิยม + carousel หมวดอื่น + Providers — มือถือเฉพาะหมวด home (design.md §6) */
  const showMobileLobbySections = isHomeLobby ? "" : "hidden";

  return (
    <>
      <div
        className={`lobby-desktop-shell${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
      >
        <div className="lobby-desktop-shell__header-band">
          <Header onSignUpClick={openSignUp} onLoginClick={openLogin} />
        </div>

        <div className="lobby-desktop-shell__desk-body">
          <div className="lobby-desktop-shell__sidebar-outside hidden shrink-0 lg:flex">
            <LobbyDesktopSidebarColumn
              categories={CATEGORIES_DATA}
              activeCategoryId={activeCategoryId}
              navigationMode="route"
              onMenuAction={handleSidebarMenuAction}
            />
          </div>

          <div className="lobby-desktop-shell__center-container min-w-0 flex-1">
            <div className="lobby-desktop-shell__frame lobby-desktop-shell__frame--dex">
            <div className="lobby-desktop-main min-w-0 w-full">
              {isHomeLobby ? (
                <div className="lobby-desktop-main__peek hidden lg:block">
                  <HomeDesktopPeekCarousel
                    items={PROMO_CAROUSEL_DATA}
                    placement="shellBand"
                    usePlaceholderSlides
                  />
                </div>
              ) : null}
              <div className="lobby-desktop-workspace">
                <div className="lobby-desktop-center min-w-0 flex-1">
                  <RightMenuDrawer
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                  />

                  <SignUpBottomDrawer
                    isOpen={isSignUpOpen}
                    onClose={closeSignUp}
                    onLoginClick={openLogin}
                  />

                  <LoginBottomDrawer
                    isOpen={isLoginOpen}
                    onClose={closeLogin}
                    onSignUpClick={openSignUp}
                  />

                  <main className="page-shell page-shell--lobby flex min-h-0 min-w-0 flex-col overflow-x-clip pb-0 lg:pb-4">
                    <div className="lg:hidden">
                      <WelcomeBanner onCtaClick={openSignUp} />
                      <PromoCarousel items={PROMO_CAROUSEL_DATA} />
                    </div>

                    <HomeDesktopHeroRow onCtaClick={openSignUp} />

                    <div className="relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-none pb-6 pt-1 lg:gap-3 lg:pb-0 lg:pt-0">
                      <div className="relative flex min-w-0 flex-col gap-4 lg:gap-3">
                        <div className={showMobileLobbySections}>
                          <div className="lg:hidden">
                            <CosmicIntro stats={INTRO_STATS_DATA} />
                          </div>
                          <div className="lg:hidden">
                            <PopularHighlights items={POPULAR_HIGHLIGHTS_DATA} />
                          </div>
                        </div>

                        <div className="lobby-category-stack">
                          <CategoryNav
                            categories={CATEGORIES_DATA}
                            navigationMode="route"
                          />
                          <LobbyCategoryProviders categoryId={activeCategoryId} />
                        </div>

                        <div className={showMobileLobbySections}>
                          {GAME_SECTIONS_DATA.map((section) => (
                            <GameSection key={section.id} section={section} />
                          ))}
                          <ProvidersSection />
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden">
                      <div className={showMobileLobbySections}>
                        <AuthGate
                          fallback={
                            <section className="mt-8 w-full sm:mt-10">
                              <p className="rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
                                เข้าสู่ระบบหรือสมัครสมาชิกเพื่อดูกิจกรรม
                              </p>
                            </section>
                          }
                        >
                          <JackpotSection items={HOME_LOBBY_TOURNAMENT_ITEMS} />
                        </AuthGate>
                      </div>

                      <FloatingBottomNav
                        items={BOTTOM_NAV_DATA}
                        isMenuOpen={isMenuOpen}
                        onMenuClick={() => setIsMenuOpen(true)}
                      />
                    </div>

                    {isHomeLobby ? (
                      <>
                        <HallOfFame datasets={HALL_OF_FAME_DATA} />
                        <TournamentsSection items={LOBBY_TOURNAMENTS_SECTION_ITEMS} />
                      </>
                    ) : null}
                  </main>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
