"use client";

import React, { useState } from "react";
import type { CategoryId } from "@/app/types/lobby";
import { BOTTOM_NAV_DATA, CATEGORIES_DATA } from "@/app/data/lobbyMockData";
import { SignUpBottomDrawer } from "@/app/components/auth/SignUpBottomDrawer";
import { LoginBottomDrawer } from "@/app/components/auth/LoginBottomDrawer";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useCouponRedeem } from "@/app/components/coupon/CouponRedeemProvider";
import { useVipModal } from "@/app/components/vip/VipModalProvider";
import { SlotProvidersHeader } from "@/app/components/slots/SlotProvidersHeader";
import { cn } from "@/lib/utils";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { FloatingBottomNav } from "./FloatingBottomNav";
import { Header } from "./Header";
import { useLobbySidebarCollapsed } from "./LobbyDesktopSidebar";
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
  const { collapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } =
    useLobbySidebarCollapsed(false);
  const { logout } = useAuth();
  const { openVipModal } = useVipModal();
  const { openCouponRedeem } = useCouponRedeem();

  const handleSidebarMenuAction = (action: "vip-rank" | "coupon") => {
    if (action === "vip-rank") openVipModal();
    if (action === "coupon") openCouponRedeem();
  };

  return (
    <>
      <div
        className={`lobby-desktop-shell text-[var(--text-primary)]${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
      >
        <div className="lobby-desktop-shell__header-band">
          <Header onSignUpClick={openSignUp} onLoginClick={openLogin} />
        </div>

        <div className="lobby-desktop-shell__desk-body">
          <div className="lobby-desktop-shell__sidebar-outside hidden shrink-0 lg:flex">
            <LobbyDesktopSidebarColumn
              categories={CATEGORIES_DATA}
              activeCategoryId={activeCategoryId}
              onSelectCategory={() => {}}
              navigationMode="route"
              collapsed={isSidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onMenuAction={handleSidebarMenuAction}
              onLogout={() => void logout()}
            />
          </div>

          <div className="lobby-desktop-shell__center-container min-w-0 flex-1">
            <div className="lobby-desktop-shell__frame lobby-desktop-shell__frame--dex">
            <div className="lobby-desktop-main min-w-0 w-full">
              <div className="lobby-desktop-workspace">
                <div className="lobby-desktop-center min-w-0 flex-1">
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
                      "page-shell page-shell--feature min-h-0 min-w-0 flex-col overflow-x-clip lg:pb-4 lg:pt-0",
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
