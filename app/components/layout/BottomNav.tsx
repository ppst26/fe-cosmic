"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";

import type { BottomNavItem } from "@/app/types/lobby";
import { cn } from "@/lib/utils";

import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import styles from "./BottomNav.module.css";

export type NavId = "withdraw" | "deposit" | "menu" | "cashback" | "contact";

export interface BottomNavProps {
  active?: NavId | null;
  onAction?: (id: NavId) => void;
  menuOpen?: boolean;
  menuDialogId?: string;
  showSpacer?: boolean;
  items?: BottomNavItem[];
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

const DEFAULT_ITEMS: ReadonlyArray<{ id: NavId; label: string }> = [
  { id: "withdraw", label: "ถอนเงิน" },
  { id: "deposit", label: "ฝากเงิน" },
  { id: "menu", label: "เมนู" },
  { id: "cashback", label: "คืนยอด" },
  { id: "contact", label: "ติดต่อ" },
];

const ICON_TO_NAV: Record<BottomNavItem["icon"], NavId> = {
  withdraw: "withdraw",
  deposit: "deposit",
  menu: "menu",
  cashback: "cashback",
  contact: "contact",
};

/** ไอคอนกลางแท็บเมนู — 3D asset เดิมของโปรเจกต์ */
const NAV_MENU_CREST_SRC = "/assets/3d/menuicon/diamond.avif";

/** พื้นหลังรอยบากกลาง (สอดคล้อง viewBox 390×86 ใน NavSurface) */
const NAV_SURFACE_PATH =
  "M0 24 H118 C132 24 142 24 150 36 C158 48 172 54 195 54 C218 54 232 48 240 36 C248 24 258 24 272 24 H390 V86 H0 Z";

const NAV_ICON_SHAPES: Record<NavId, ReactNode> = {
  withdraw: (
    <>
      <path d="M12 16V3m-5 5 5-5 5 5" />
      <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    </>
  ),
  deposit: (
    <>
      <path d="M12 3v13m-5-5 5 5 5-5" />
      <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    </>
  ),
  menu: <path d="M5 6h14M5 12h14M5 18h14" />,
  cashback: (
    <>
      <path d="M3 10a9 9 0 1 1 1.5 7" />
      <path d="M3 4v6h6" />
    </>
  ),
  contact: (
    <>
      <path d="M4 14v-3a8 8 0 0 1 16 0v6a4 4 0 0 1-4 4h-2" />
      <rect x="2" y="11" width="4" height="7" rx="2" />
      <rect x="18" y="11" width="4" height="7" rx="2" />
      <path d="M11 21h3" />
    </>
  ),
};

/** ไอคอน stroke สำหรับแท็บซ้าย–ขวา */
function BottomNavIcon({ id }: { id: NavId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {NAV_ICON_SHAPES[id]}
    </svg>
  );
}

/** พื้นหลัง SVG + notch กลาง */
function NavSurface() {
  return (
    <div className={styles.surface} aria-hidden="true">
      <svg
        className={styles.surfaceSvg}
        viewBox="0 0 390 86"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path className={styles.surfacePath} d={NAV_SURFACE_PATH} />
      </svg>
    </div>
  );
}

interface CenterMenuSlotProps {
  label: string;
  selected: boolean;
  menuDialogId?: string;
  menuOpen: boolean;
  onPress: () => void;
}

/** ช่องกลาง — crest เมนู + label */
function CenterMenuSlot({
  label,
  selected,
  menuDialogId,
  menuOpen,
  onPress,
}: CenterMenuSlotProps) {
  return (
    <div className={styles.centerSlot}>
      <button
        type="button"
        className={styles.crest}
        data-active={selected}
        onClick={onPress}
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        aria-controls={menuDialogId}
        aria-label={label}
      >
        <span className={styles.crestRing} aria-hidden="true" />
        <Image
          src={NAV_MENU_CREST_SRC}
          alt=""
          width={56}
          height={56}
          className={styles.crestImg}
          priority
        />
      </button>
      <span className={cn(styles.centerLabel, "cosmic-type-nav-label")}>{label}</span>
    </div>
  );
}

interface SideNavItemProps {
  id: NavId;
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** แท็บซ้าย–ขวา — ไอคอน + label */
function SideNavItem({ id, label, selected, onPress }: SideNavItemProps) {
  return (
    <button
      type="button"
      className={styles.item}
      data-active={selected}
      onClick={onPress}
      aria-current={selected ? "page" : undefined}
    >
      <span className={styles.itemInner}>
        <span className={styles.icon}>
          <BottomNavIcon id={id} />
        </span>
        <span className={cn(styles.label, "cosmic-type-nav-label")}>{label}</span>
      </span>
    </button>
  );
}

/** อนุมาน active จาก pathname เมื่อไม่ส่ง prop `active` */
function resolveActiveFromPath(pathname: string): NavId | null {
  if (pathname.startsWith("/cashback")) return "cashback";
  if (pathname.startsWith("/support")) return "contact";
  return null;
}

/**
 * Bottom nav มือถือ — รอยบากกลาง + crest เมนู (layout อ้างอิง reference, สี/ลำดับจากธีมเดิม)
 */
export function BottomNav({
  active,
  onAction,
  menuOpen,
  menuDialogId,
  showSpacer = false,
  items,
  onMenuClick,
  isMenuOpen,
}: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();

  const navItems = useMemo(() => {
    if (!items?.length) return [...DEFAULT_ITEMS];
    return items.map((item) => ({
      id: ICON_TO_NAV[item.icon],
      label: item.label,
    }));
  }, [items]);

  const menuOpenResolved = menuOpen ?? isMenuOpen ?? false;
  const resolvedActive =
    active !== undefined ? active : resolveActiveFromPath(pathname);

  const handleAction = (id: NavId) => {
    onAction?.(id);

    switch (id) {
      case "withdraw":
        openWithdraw();
        break;
      case "deposit":
        openDeposit();
        break;
      case "menu":
        onMenuClick?.();
        break;
      case "cashback":
        if (pathname !== "/cashback") router.push("/cashback");
        break;
      case "contact":
        if (pathname !== "/support") router.push("/support");
        break;
      default:
        break;
    }
  };

  return (
    <>
      {showSpacer ? <div className={styles.spacer} aria-hidden="true" /> : null}
      <nav className={styles.nav} aria-label="เมนูหลัก">
        <NavSurface />
        <div className={styles.items}>
          {navItems.map(({ id, label }) => {
            const isMenu = id === "menu";
            const selected = isMenu
              ? menuOpenResolved || resolvedActive === id
              : resolvedActive === id;

            if (isMenu) {
              return (
                <CenterMenuSlot
                  key={id}
                  label={label}
                  selected={selected}
                  menuDialogId={menuDialogId}
                  menuOpen={menuOpenResolved}
                  onPress={() => handleAction(id)}
                />
              );
            }

            return (
              <SideNavItem
                key={id}
                id={id}
                label={label}
                selected={selected}
                onPress={() => handleAction(id)}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
export { BottomNav as FloatingBottomNav };
