"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLobbyMobileHeaderHeight } from "@/app/hooks/useLobbyMobileHeaderHeight";
import { usePathname } from "next/navigation";
import { Header } from "../layout/Header";
import { RightMenuDrawer } from "../layout/RightMenuDrawer";
import { useAuth, AuthGate } from "../auth/AuthProvider";
import { useLobbyShellSidebar } from "../layout/LobbyShellSidebarContext";
import { LobbyDesktopSidebarColumn } from "../layout/LobbyDesktopSidebarColumn";
import { HomeDesktopPeekCarousel } from "./HomeDesktopPeekCarousel";
import { WelcomeBanner } from "./WelcomeBanner";
import { PromoCarousel } from "./PromoCarousel";
import { HomeScreenShortcutPromo } from "./HomeScreenShortcutPromo";
import { CategoryNav } from "./CategoryNav";
import { LobbyAnnouncementMarquee } from "./LobbyAnnouncementMarquee";
import { LobbyDesktopQuickBanners } from "./LobbyDesktopQuickBanners";
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
import { cn } from "@/lib/utils";
import {
  CATEGORIES_DATA,
  LOBBY_TOURNAMENTS_SECTION_ITEMS,
  BOTTOM_NAV_DATA,
} from "@/app/data/lobbyMockData";
import type { LobbyContent } from "@/lib/api/lobby";

/**
 * หน้า lobby หลัก — หมวดซิงก์จาก URL (/slots, /casino ฯลฯ)
 * เนื้อหา (แบนเนอร์ · เกม · ทัวร์นาเมนต์ · ประกาศ · Hall of Fame) โหลดฝั่ง server ใน app/(lobby)/layout.tsx แล้วส่งมาเป็น props
 */
export function HomeLobbyPage({ content }: { content: LobbyContent }) {
  const homeBanners = content.banners;
  const homeGames = content.games;
  const homeTournaments = content.tournaments;
  const lobbyAnnouncements = content.announcements;

  const pathname = usePathname();
  const activeCategoryId = useMemo(
    () => resolveLobbyCategoryFromPath(pathname, CATEGORIES_DATA) ?? "home",
    [pathname],
  );

  const { isOpen: isMenuOpen, open: openMenu, close: closeMenu } = useOverlayLayer("menu");
  const { open: openSignUp } = useOverlayLayer("signup");
  const { open: openLogin } = useOverlayLayer("login");
  const { sidebarHidden: isSidebarCollapsed } = useLobbyShellSidebar();
  const { isAuthenticated } = useAuth();
  const { openVipModal } = useVipModal();
  const { openCouponRedeem } = useCouponRedeem();

  const handleSidebarMenuAction = (action: "vip-rank" | "coupon") => {
    if (action === "vip-rank") openVipModal();
    if (action === "coupon") openCouponRedeem();
  };

  const isHomeLobby = activeCategoryId === "home";
  /** ยอดนิยม + carousel หมวดอื่น + Providers — มือถือเฉพาะหมวด home (design.md §6) */
  const showMobileLobbySections = isHomeLobby ? "" : "hidden";

  const { headerMeasureRef, headerHeight, shellStyle } = useLobbyMobileHeaderHeight();
  const categoryStickySentinelRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const [categoryBarHeight, setCategoryBarHeight] = useState<number>(0);
  const [isCategoryNavStuck, setIsCategoryNavStuck] = useState(false);

  // CategoryNav ติด header — สลับพื้น solid → glass (IntersectionObserver ไม่ย้าย DOM)
  useEffect(() => {
    const sentinel = categoryStickySentinelRef.current;
    if (!sentinel) return;

    const topInset = headerHeight > 0 ? headerHeight : 68;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCategoryNavStuck(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: `-${topInset}px 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerHeight]);

  useEffect(() => {
    const el = categoryBarRef.current;
    if (!el) return;
    const updateHeight = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setCategoryBarHeight(Math.ceil(h));
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div
        className={`lobby-desktop-shell lg:flex lg:min-h-screen lg:w-full lg:flex-col lg:items-stretch${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
        style={shellStyle}
      >
        <div
          ref={headerMeasureRef}
          className="lobby-desktop-shell__header-band cosmic-mobile-chrome-surface lobby-mobile-header-band w-full shrink-0 lg:sticky lg:top-0 lg:z-50 lg:isolate lg:w-full lg:shrink-0 lg:pt-[env(safe-area-inset-top,0px)] lg:relative"
        >
          <Header
            onSignUpClick={openSignUp}
            onLoginClick={openLogin}
            onMenuClick={() => openMenu()}
            mobileSticky={false}
          />
        </div>
        <div className="lobby-mobile-header-band__spacer lg:hidden" aria-hidden="true" />

        <div className="lobby-desktop-shell__desk-body lg:relative lg:w-full lg:min-w-0 lg:flex-1">
          <div className="lobby-desktop-shell__sidebar-outside hidden shrink-0 lg:flex lg:flex-col lg:items-stretch lg:gap-2 lg:overflow-visible">
            <LobbyDesktopSidebarColumn
              categories={CATEGORIES_DATA}
              activeCategoryId={activeCategoryId}
              navigationMode="route"
              onMenuAction={handleSidebarMenuAction}
            />
          </div>

          <div className="lobby-desktop-shell__center-container min-w-0 flex-1 lg:flex lg:min-w-0 lg:w-full">
            <div className="lobby-desktop-shell__frame lobby-desktop-shell__frame--dex lg:flex lg:min-w-0 lg:w-full lg:max-w-none lg:flex-col lg:px-0">
            <div className="lobby-desktop-main min-w-0 w-full lg:flex lg:flex-col lg:items-stretch lg:flex-1">
              <div className="lobby-desktop-main__peek hidden lg:block lg:w-full lg:shrink-0 lg:mb-2">
                <HomeDesktopPeekCarousel
                  items={homeBanners.peek}
                  placement="shellBand"
                />
              </div>
              <div className="lobby-desktop-workspace lg:flex lg:w-full lg:min-w-0 lg:max-w-none lg:mx-0 lg:items-start lg:gap-4 lg:pt-(--lobby-workspace-pad-top) lg:px-0 lg:pb-5">
                <div className="lobby-desktop-center min-w-0 flex-1 lg:w-full lg:max-w-none lg:mx-0 lg:px-0">
                  <RightMenuDrawer
                    isOpen={isMenuOpen}
                    onClose={closeMenu}
                  />

                  <main className="page-shell page-shell--lobby mx-auto flex w-full min-h-0 min-w-0 max-w-[var(--content-max)] flex-col max-lg:px-2 pb-8 pt-0 sm:max-lg:px-2.5 lg:mx-0 lg:max-w-none lg:px-0 lg:pt-0">
                    {/* มือถือ: hero → ประกาศ → โปร — ระยะแนบให้คอนเทนต์ต่อเนื่อง (หน้าแรก) */}
                    <div className="flex flex-col gap-3 lg:hidden">
                      {/* hero carousel — ซ่อนไว้ก่อน (เปิดเมื่อมี asset พร้อม) */}
                      <div className="hidden" aria-hidden="true">
                        <WelcomeBanner items={homeBanners.welcomeSlides} />
                      </div>

                      <div className="-mx-2 sm:-mx-2.5">
                        <PromoCarousel items={homeBanners.promoCarousel} />
                      </div>

                      <div className="-mx-2 sm:-mx-2.5">
                        <LobbyAnnouncementMarquee
                          messages={lobbyAnnouncements}
                          variant="mobile"
                        />
                      </div>

                      {/* ปุ่มเข้าสู่ระบบ / สมัครสมาชิก (แสดงเมื่อยังไม่ได้ล็อกอิน) */}
                      {!isAuthenticated && (
                        <div className="auth-actions auth-actions--soft pt-1">
                          <button
                            type="button"
                            onClick={() => openLogin()}
                            className="auth-btn auth-btn--login"
                          >
                            เข้าสู่ระบบ
                          </button>
                          <button
                            type="button"
                            onClick={() => openSignUp()}
                            className="auth-btn auth-btn--register"
                          >
                            สมัครสมาชิก
                          </button>
                        </div>
                      )}
                    </div>

                    <div
                      ref={categoryStickySentinelRef}
                      className="pointer-events-none h-px w-full shrink-0 lg:hidden"
                      aria-hidden="true"
                    />

                    {/* มือถือ: host คงความสูงใน flow · แถบ fixed ตอนประกบ header จนสุดหน้า */}
                    <div
                      className="lobby-mobile-category-sticky-host -mx-2 mt-0.5 sm:-mx-2.5 lg:hidden"
                      style={
                        isCategoryNavStuck && categoryBarHeight > 0
                          ? { height: `${categoryBarHeight}px` }
                          : undefined
                      }
                    >
                      <div
                        ref={categoryBarRef}
                        className={cn(
                          "lobby-mobile-category-sticky w-full min-w-0 px-2 sm:px-2.5",
                          "py-1",
                          isCategoryNavStuck && "is-stuck",
                        )}
                      >
                        <CategoryNav
                          categories={CATEGORIES_DATA}
                          navigationMode="route"
                          variant="mobile"
                          className="!my-0"
                        />
                      </div>
                    </div>

                    <div
                      className={cn(
                        "relative flex min-w-0 flex-col rounded-none pb-6 max-lg:overflow-x-visible lg:gap-3 lg:overflow-hidden lg:overflow-x-clip lg:pb-0 lg:pt-0",
                        isHomeLobby ? "gap-1 pt-0 max-lg:gap-0 lg:gap-3 lg:pt-0" : "gap-4 pt-1 lg:gap-3",
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex min-w-0 flex-col max-lg:overflow-x-visible lg:gap-3",
                          isHomeLobby ? "gap-1 max-lg:gap-0" : "gap-4",
                        )}
                      >
                        <div className="lobby-category-stack flex flex-col gap-2 max-lg:gap-0 lg:gap-4">
                          <div className="hidden lg:block">
                            <LobbyAnnouncementMarquee
                              messages={lobbyAnnouncements}
                              variant="default"
                            />
                          </div>
                          <LobbyDesktopQuickBanners />
                          <div className="hidden lg:block">
                            <CategoryNav
                              categories={CATEGORIES_DATA}
                              navigationMode="route"
                              variant="desktop"
                            />
                          </div>
                          <LobbyCategoryProviders categoryId={activeCategoryId} />
                        </div>

                        <div className={cn(showMobileLobbySections, isHomeLobby && "lobby-mobile-home-sections")}>
                          {homeGames.sections.map((section, index) => (
                            <GameSection
                              key={section.id}
                              section={section}
                              className={
                                index === 0
                                  ? "mt-0 lg:mt-2"
                                  : "mt-4 sm:mt-5"
                              }
                            />
                          ))}
                          <ProvidersSection />
                          {isHomeLobby ? (
                            <AuthGate
                              fallback={
                                <section className="mt-5 w-full sm:mt-6 lg:hidden">
                                  <p className="rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
                                    เข้าสู่ระบบหรือสมัครสมาชิกเพื่อดูกิจกรรม
                                  </p>
                                </section>
                              }
                            >
                              <JackpotSection
                                items={homeTournaments}
                                className="mt-5 sm:mt-6 lg:hidden"
                              />
                            </AuthGate>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {isHomeLobby ? (
                      <>
                        <HallOfFame datasets={content.hallOfFame} />
                        <div className="hidden lg:block">
                          <TournamentsSection items={LOBBY_TOURNAMENTS_SECTION_ITEMS} />
                        </div>
                        <HomeScreenShortcutPromo className="mt-8 sm:mt-10" />
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

      <div className="lg:hidden">
        <FloatingBottomNav
          items={BOTTOM_NAV_DATA}
          isMenuOpen={isMenuOpen}
          onMenuClick={() => (isMenuOpen ? closeMenu() : openMenu())}
        />
      </div>
    </>
  );
}
