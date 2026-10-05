"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

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
  menu: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1.25" />
      <rect x="14" y="4" width="6" height="6" rx="1.25" />
      <rect x="4" y="14" width="6" height="6" rx="1.25" />
      <rect x="14" y="14" width="6" height="6" rx="1.25" />
    </>
  ),
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

/** ไอคอน stroke แท็บล่าง */
function BottomNavIcon({ id }: { id: NavId }) {
  const isGridMenu = id === "menu";
  return (
    <svg
      viewBox="0 0 24 24"
      fill={isGridMenu ? "currentColor" : "none"}
      stroke={isGridMenu ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {NAV_ICON_SHAPES[id]}
    </svg>
  );
}

interface NavTabButtonProps {
  id: NavId;
  label: string;
  selected: boolean;
  menuDialogId?: string;
  menuOpen?: boolean;
  onPress: () => void;
}

/** แท็บล่าง — ไอคอน + label เรียงเท่ากัน 5 ช่อง */
function NavTabButton({
  id,
  label,
  selected,
  menuDialogId,
  menuOpen,
  onPress,
}: NavTabButtonProps) {
  const isMenu = id === "menu";

  return (
    <button
      type="button"
      className={styles.item}
      data-active={selected}
      onClick={onPress}
      aria-haspopup={isMenu ? "dialog" : undefined}
      aria-expanded={isMenu ? menuOpen : undefined}
      aria-controls={isMenu ? menuDialogId : undefined}
      aria-current={selected && !isMenu ? "page" : undefined}
      aria-label={isMenu ? label : undefined}
    >
      <span className={styles.icon}>
        <BottomNavIcon id={id} />
      </span>
      <span className={cn(styles.label, "cosmic-type-nav-label")}>{label}</span>
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
 * Bottom nav มือถือ — แถบโค้งบนเรียบ 5 แท็บเท่ากัน · portal ไป body (fixed ล่างจอ)
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const navTree = (
    <>
      {showSpacer ? <div className={styles.spacer} aria-hidden="true" /> : null}
      <nav className={styles.nav} aria-label="เมนูหลัก">
        <div className={styles.surface} aria-hidden="true" />
        <div className={styles.items}>
          {navItems.map(({ id, label }) => {
            const isMenu = id === "menu";
            const selected = isMenu
              ? menuOpenResolved || resolvedActive === id
              : resolvedActive === id;

            return (
              <NavTabButton
                key={id}
                id={id}
                label={label}
                selected={selected}
                menuDialogId={menuDialogId}
                menuOpen={isMenu ? menuOpenResolved : undefined}
                onPress={() => handleAction(id)}
              />
            );
          })}
        </div>
      </nav>
    </>
  );

  if (!mounted) return null;

  return createPortal(navTree, document.body);
}

export default BottomNav;
export { BottomNav as FloatingBottomNav };
