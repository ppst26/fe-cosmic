"use client";

import React, { useState } from "react";
import type { CategoryId } from "@/app/types/lobby";
import { BOTTOM_NAV_DATA, CATEGORIES_DATA } from "@/app/data/lobbyMockData";
import { SignUpBottomDrawer } from "@/app/components/auth/SignUpBottomDrawer";
import { LoginBottomDrawer } from "@/app/components/auth/LoginBottomDrawer";
import { useCouponRedeem } from "@/app/components/coupon/CouponRedeemProvider";
import { useVipModal } from "@/app/components/vip/VipModalProvider";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { cn } from "@/lib/utils";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { FloatingBottomNav } from "./FloatingBottomNav";
import { Header } from "./Header";
import { useLobbyShellSidebar } from "./LobbyShellSidebarContext";
import { LobbyDesktopSidebarColumn } from "./LobbyDesktopSidebarColumn";
import { RightMenuDrawer } from "./RightMenuDrawer";

interface LobbyDesktopPageShellProps {
  children: React.ReactNode;
  /** ไฮไลต์หมวดใน sidebar desktop */
  activeCategoryId?: CategoryId;
  /** แถบย่อยมือถือ — ซ่อนบน lg+ (desktop ใช้ sidebar + main) */
  subHeader?: { title: string; backHref?: string };
  mainClassName?: string;
  /** หน้าแทงที่ใช้ action bar ล่างแทน bottom nav */
  hideBottomNav?: boolean;
}

/**
 * กรอบ desktop lobby — header + sidebar + main + แถบเมนูขวา
 * ใช้ในหน้าหวย / วงล้อ · มือถือยังเป็น header + subHeader + bottom nav ตามเดิม
 * Desktop: main ขยายเต็มความกว้างทับพื้นที่แบนเนอร์ขวา (แบนเนอร์ซ่อนใต้ชั้น content)
 */
export function LobbyDesktopPageShell({
  children,
  activeCategoryId = "home",
  subHeader,
  mainClassName,
  hideBottomNav = false,
}: LobbyDesktopPageShellProps) {
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

  return (
    <>
      <div
        className={`lobby-desktop-shell text-[var(--text-primary)] lg:flex lg:min-h-screen lg:w-full lg:flex-col lg:items-center${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
      >
        <div className="lobby-desktop-shell__header-band lg:sticky lg:top-0 lg:z-50 lg:isolate lg:w-full lg:shrink-0 lg:pt-[env(safe-area-inset-top,0px)]">
          <Header onSignUpClick={openSignUp} onLoginClick={openLogin} />
        </div>

        <div className="lobby-desktop-shell__desk-body lg:relative lg:w-full lg:min-w-0 lg:flex-1">
          <div className="lobby-desktop-shell__sidebar-outside hidden shrink-0 lg:fixed lg:left-(--lobby-desktop-cluster-gutter) lg:top-(--lobby-sidebar-sticky-top) lg:z-[6] lg:flex lg:w-(--lobby-sidebar-card-width) lg:flex-col lg:items-stretch lg:gap-2 lg:max-h-[calc(100dvh-var(--lobby-sidebar-sticky-top)-var(--space-6))] lg:overflow-visible">
            <LobbyDesktopSidebarColumn
              categories={CATEGORIES_DATA}
              activeCategoryId={activeCategoryId}
              onSelectCategory={() => {}}
              navigationMode="route"
              onMenuAction={handleSidebarMenuAction}
            />
          </div>

          <div className="lobby-desktop-shell__center-container min-w-0 flex-1 lg:flex lg:w-full lg:justify-center">
            <div className="lobby-desktop-shell__frame lobby-desktop-shell__frame--dex lg:flex lg:min-w-0 lg:w-(--lobby-desktop-center-width) lg:max-w-none lg:flex-col lg:mx-auto lg:px-0 lg:flex-[0_1_var(--lobby-desktop-center-width)]">
            <div className="lobby-desktop-main min-w-0 w-full lg:flex lg:flex-col lg:items-stretch lg:flex-1">
              <div className="lobby-desktop-workspace lg:flex lg:w-full lg:min-w-0 lg:max-w-none lg:mx-0 lg:items-start lg:gap-4 lg:pt-(--lobby-workspace-pad-top) lg:px-0 lg:pb-5">
                <div className="lobby-desktop-center min-w-0 flex-1 lg:w-full lg:max-w-none lg:mx-0 lg:px-0">
                  <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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

                  {subHeader ? (
                    <div className="lg:hidden">
                      <SlotProvidersHeader
                        title={subHeader.title}
                        backHref={subHeader.backHref ?? "/"}
                      />
                    </div>
                  ) : null}

                  <main
                    className={cn(
                      "page-shell page-shell--feature mx-auto flex w-full min-h-0 min-w-0 max-w-[var(--content-max)] flex-col overflow-x-clip px-3 pb-6 lg:mx-0 lg:max-w-none lg:px-0",
                      activeCategoryId === "lottery" ? "lottery-page-main pt-0" : "pt-4",
                      mainClassName,
                    )}
                  >
                    {children}
                  </main>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {!hideBottomNav ? (
        <div className="lg:hidden">
          <FloatingBottomNav
            items={BOTTOM_NAV_DATA}
            isMenuOpen={isMenuOpen}
            onMenuClick={() => setIsMenuOpen(true)}
          />
        </div>
      ) : null}
    </>
  );
}
