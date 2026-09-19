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
import { FloatingBottomNav } from "./FloatingBottomNav";
import { Header } from "./Header";
import {
  LobbyDesktopSidebar,
  useLobbySidebarCollapsed,
} from "./LobbyDesktopSidebar";
import { LobbyDesktopRightRail } from "./LobbyDesktopRightRail";
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
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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

  return (
    <>
      <div
        className={`lobby-desktop-shell text-[var(--text-primary)]${isSidebarCollapsed ? " is-sidebar-collapsed" : ""}`}
      >
        <div className="lobby-desktop-shell__header-band">
          <Header onSignUpClick={openSignUp} onLoginClick={openLogin} />
        </div>

        <div className="lobby-desktop-shell__frame">
          <div className="lobby-desktop-shell__row">
            <LobbyDesktopSidebar
              categories={CATEGORIES_DATA}
              activeCategoryId={activeCategoryId}
              onSelectCategory={() => {}}
              navigationMode="route"
              collapsed={isSidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onMenuAction={handleSidebarMenuAction}
              onLogout={() => void logout()}
            />

            <div className="lobby-desktop-main min-w-0 flex-1">
              <div className="lobby-desktop-workspace lobby-desktop-workspace--over-right-rail">
                <div className="lobby-desktop-center lobby-desktop-center--over-rail min-w-0 flex-1">
                  <RightMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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
                      "page-shell page-shell--feature min-h-0 min-w-0 flex-col overflow-x-clip pb-28 lg:pb-4 lg:pt-0",
                      activeCategoryId === "lottery" ? "lottery-page-main pt-0" : "pt-4",
                      mainClassName,
                    )}
                  >
                    {children}
                  </main>
                </div>

                <LobbyDesktopRightRail onMenuAction={handleSidebarMenuAction} />
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
