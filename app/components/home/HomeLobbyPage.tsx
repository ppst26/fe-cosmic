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
import { HomeDesktopPeekCarousel } from "./HomeDesktopPeekCarousel";
import { WelcomeBanner } from "./WelcomeBanner";
import { PromoCarousel } from "./PromoCarousel";
import { CosmicIntro } from "./CosmicIntro";
import { PopularHighlights } from "./PopularHighlights";
import { CategoryNav } from "./CategoryNav";
import { LobbyAnnouncementMarquee } from "./LobbyAnnouncementMarquee";
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
  HOME_DESKTOP_PEEK_CAROUSEL_DATA,
  PROMO_CAROUSEL_DATA,
  INTRO_STATS_DATA,
  POPULAR_HIGHLIGHTS_DATA,
  GAME_SECTIONS_DATA,
  HOME_LOBBY_TOURNAMENT_ITEMS,
  LOBBY_TOURNAMENTS_SECTION_ITEMS,
  HALL_OF_FAME_DATA,
  BOTTOM_NAV_DATA,
} from "@/app/data/lobbyMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";

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
        className={`lobby-desktop-shell lg:flex lg:min-h-screen lg:w-full lg:flex-col lg:items-center${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
      >
        <div className="lobby-desktop-shell__header-band lg:sticky lg:top-0 lg:z-50 lg:isolate lg:w-full lg:shrink-0 lg:pt-[env(safe-area-inset-top,0px)]">
          <Header onSignUpClick={openSignUp} onLoginClick={openLogin} />
        </div>

        <div className="lobby-desktop-shell__desk-body lg:relative lg:w-full lg:min-w-0 lg:flex-1">
          <div className="lobby-desktop-shell__sidebar-outside hidden shrink-0 lg:fixed lg:left-(--lobby-desktop-cluster-gutter) lg:top-(--lobby-sidebar-sticky-top) lg:z-[6] lg:flex lg:w-(--lobby-sidebar-card-width) lg:flex-col lg:items-stretch lg:gap-2 lg:max-h-[calc(100dvh-var(--lobby-sidebar-sticky-top)-var(--space-6))] lg:overflow-visible">
            <LobbyDesktopSidebarColumn
              categories={CATEGORIES_DATA}
              activeCategoryId={activeCategoryId}
              navigationMode="route"
              onMenuAction={handleSidebarMenuAction}
            />
          </div>

          <div className="lobby-desktop-shell__center-container min-w-0 flex-1 lg:flex lg:w-full lg:justify-center">
            <div className="lobby-desktop-shell__frame lobby-desktop-shell__frame--dex lg:flex lg:min-w-0 lg:w-(--lobby-desktop-center-width) lg:max-w-none lg:flex-col lg:mx-auto lg:px-0 lg:flex-[0_1_var(--lobby-desktop-center-width)]">
            <div className="lobby-desktop-main min-w-0 w-full lg:flex lg:flex-col lg:items-stretch lg:flex-1">
              {isHomeLobby ? (
                <div className="lobby-desktop-main__peek hidden lg:block lg:w-full lg:shrink-0 lg:mb-2">
                  <HomeDesktopPeekCarousel
                    items={HOME_DESKTOP_PEEK_CAROUSEL_DATA}
                    placement="shellBand"
                  />
                </div>
              ) : null}
              <div className="lobby-desktop-workspace lg:flex lg:w-full lg:min-w-0 lg:max-w-none lg:mx-0 lg:items-start lg:gap-4 lg:pt-(--lobby-workspace-pad-top) lg:px-0 lg:pb-5">
                <div className="lobby-desktop-center min-w-0 flex-1 lg:w-full lg:max-w-none lg:mx-0 lg:px-0">
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

                  <main className="page-shell page-shell--lobby mx-auto flex w-full min-h-0 min-w-0 max-w-[var(--content-max)] flex-col overflow-x-clip px-3 pb-8 lg:mx-0 lg:max-w-none lg:px-0">
                    <div className="lg:hidden">
                      <WelcomeBanner onCtaClick={openSignUp} />
                      <PromoCarousel items={PROMO_CAROUSEL_DATA} />
                      <div className="mt-3">
                        <LobbyAnnouncementMarquee messages={LOBBY_ANNOUNCEMENT_MESSAGES} />
                      </div>
                    </div>

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

                        <div className="lobby-category-stack flex flex-col gap-3 lg:gap-4">
                          <div className="hidden lg:block">
                            <LobbyAnnouncementMarquee messages={LOBBY_ANNOUNCEMENT_MESSAGES} />
                          </div>
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
