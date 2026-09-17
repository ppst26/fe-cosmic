"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CategoryId, CategoryItem } from "@/app/types/lobby";
import {
  ChevronRightIcon,
  ContactNavIcon,
  FishIcon,
  FootballIcon,
  GameShowsIcon,
  HomeNavIcon,
  LiveCasinoIcon,
  LogOutIcon,
  PromoTicketIcon,
  SlotsIcon,
} from "../ui/Icons";
import {
  MENU_DIALOG_SECTIONS,
  type MenuDialogAction,
  type MenuDialogTile,
} from "@/app/data/menuMockData";
import { MenuItemIcon } from "./MenuItemIcon";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "cosmicbet-lobby-sidebar-collapsed";

interface LobbyDesktopSidebarProps {
  categories: CategoryItem[];
  activeCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onMenuAction?: (action: MenuDialogAction) => void;
  onLogout?: () => void;
  /** route = ไปหน้า /casino ฯลฯ · none = สลับ state บนหน้าเดียว (หน้าแรก) */
  navigationMode?: "route" | "none";
}

/** ไอคอนหมวด — ใช้ชุดเดียวกับ CategoryNav */
function getCategoryIcon(id: CategoryId, className = "h-5 w-5") {
  switch (id) {
    case "home":
      return <HomeNavIcon className={className} />;
    case "casino":
      return <LiveCasinoIcon className={className} />;
    case "slots":
      return <SlotsIcon className={className} />;
    case "fishing":
      return <FishIcon className={className} />;
    case "sports":
      return <FootballIcon className={className} />;
    case "lottery":
      return <PromoTicketIcon className={className} />;
    case "games":
      return <GameShowsIcon className={className} />;
    default:
      return <LiveCasinoIcon className={className} />;
  }
}

function renderMenuTile(
  tile: MenuDialogTile,
  onMenuAction?: (action: MenuDialogAction) => void,
) {
  const inner = (
    <>
      <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
        <MenuItemIcon iconId={tile.iconId} />
      </span>
      <span className="lobby-desktop-sidebar__link-label">{tile.label}</span>
    </>
  );

  if (tile.action) {
    return (
      <button
        type="button"
        className="lobby-desktop-sidebar__link"
        title={tile.label}
        onClick={() => onMenuAction?.(tile.action!)}
      >
        {inner}
      </button>
    );
  }

  if (tile.href) {
    const linkClass = "lobby-desktop-sidebar__link";
    if (hrefToHubId(tile.href)) {
      return (
        <HubNavLink href={tile.href} className={linkClass} title={tile.label}>
          {inner}
        </HubNavLink>
      );
    }
    return (
      <Link href={tile.href} className={linkClass} title={tile.label}>
        {inner}
      </Link>
    );
  }

  return null;
}

const SIDEBAR_MENU_SECTIONS = MENU_DIALOG_SECTIONS.filter(
  (section) => section.id !== "personal" && section.id !== "rewards",
);

/** ป้ายหมวด sidebar ตาม mock desktop */
function sidebarSectionLabel(id: string, fallback: string) {
  if (id === "privileges") return "สิทธิพิเศษ";
  return fallback;
}

/**
 * แถบนำทางซ้ายแบบไร้ขอบ (borderless) — ไม่มีกรอบ/เงาการ์ด ใช้ไล่สีกลืนกับพื้นหน้า
 * collapse เป็นไอคอน+ชื่อใต้ไอคอน · expand แสดงเมนูเต็ม
 * ถูกเรียกใช้ใน app/page.tsx ภายใน lobby-desktop-shell
 */
export function LobbyDesktopSidebar({
  categories,
  activeCategoryId,
  onSelectCategory,
  collapsed,
  onCollapsedChange,
  onMenuAction,
  onLogout,
  navigationMode = "route",
}: LobbyDesktopSidebarProps) {
  const router = useRouter();

  const handleCategoryClick = (category: CategoryItem) => {
    onSelectCategory(category.id);
    if (navigationMode === "route" && category.href.startsWith("/")) {
      router.push(category.href);
    }
  };

  const toggleCollapsed = () => {
    onCollapsedChange(!collapsed);
  };

  return (
    <aside
      className="lobby-desktop-sidebar-rail hidden shrink-0 lg:flex"
      aria-label="เมนูหลักเดสก์ท็อป"
    >
      <div
        className={cn("lobby-desktop-sidebar", collapsed && "is-collapsed")}
        data-collapsed={collapsed ? "true" : "false"}
      >
      <nav
        className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--primary min-h-0 flex-1 overflow-y-auto"
        aria-label="หมวดเกม"
      >
        <p className="lobby-desktop-sidebar__section-label">เกม</p>
        <ul className="lobby-desktop-sidebar__list">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "lobby-desktop-sidebar__link",
                    isActive && "is-active",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={category.label}
                >
                  <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
                    {getCategoryIcon(category.id, "h-[18px] w-[18px]")}
                  </span>
                  <span className="lobby-desktop-sidebar__link-label">{category.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {SIDEBAR_MENU_SECTIONS.map((section) => (
        <nav
          key={section.id}
          className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services"
          aria-label={section.sectionLabel}
        >
          <p className="lobby-desktop-sidebar__section-label">
            {sidebarSectionLabel(section.id, section.sectionLabel)}
          </p>
          <ul className="lobby-desktop-sidebar__list">
            {section.items.map((tile) => (
              <li key={tile.id}>{renderMenuTile(tile, onMenuAction)}</li>
            ))}
          </ul>
        </nav>
      ))}

      <nav className="lobby-desktop-sidebar__nav lobby-desktop-sidebar__nav--services" aria-label="ระบบ">
        <p className="lobby-desktop-sidebar__section-label">ระบบ</p>
        <ul className="lobby-desktop-sidebar__list">
          <li>
            <Link href="/support" className="lobby-desktop-sidebar__link" title="ติดต่อเรา">
              <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
                <ContactNavIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="lobby-desktop-sidebar__link-label">ติดต่อเรา</span>
            </Link>
          </li>
          {onLogout ? (
            <li>
              <button
                type="button"
                className="lobby-desktop-sidebar__link"
                title="ออกจากระบบ"
                onClick={onLogout}
              >
                <span className="lobby-desktop-sidebar__link-icon-wrap" aria-hidden="true">
                  <LogOutIcon className="h-[18px] w-[18px]" />
                </span>
                <span className="lobby-desktop-sidebar__link-label">ออกจากระบบ</span>
              </button>
            </li>
          ) : null}
        </ul>
      </nav>

      <div className="lobby-desktop-sidebar__foot">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="lobby-desktop-sidebar__toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "ขยายเมนูด้านซ้าย" : "ย่อเมนูด้านซ้าย"}
        >
          <span className="lobby-desktop-sidebar__toggle-icon" aria-hidden="true">
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <SidebarDockIcon className="h-[18px] w-[18px]" />
            )}
          </span>
          <span className="lobby-desktop-sidebar__toggle-label">
            {collapsed ? "ขยาย" : "ย่อเมนู"}
          </span>
        </button>
      </div>
      </div>
    </aside>
  );
}

/** ไอคอนย่อ/ขยาย panel — มุมล่างแผงเมนู */
function SidebarDockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="3.5"
        width="15"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path d="M7.5 3.5v13" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

/**
 * โหลด/บันทึกสถานะย่อ sidebar — ใช้ใน app/page.tsx
 * ค่าเริ่มต้นต้องตรง SSR; อ่าน localStorage หลัง hydrate เท่านั้น
 */
function readSidebarCollapsedFromStorage(fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function useLobbySidebarCollapsed(defaultCollapsed = false) {
  const [collapsed, setCollapsedState] = useState(defaultCollapsed);

  React.useEffect(() => {
    setCollapsedState(readSidebarCollapsedFromStorage(defaultCollapsed));
  }, [defaultCollapsed]);

  const setCollapsed = (next: boolean) => {
    setCollapsedState(next);
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return { collapsed, setCollapsed };
}
