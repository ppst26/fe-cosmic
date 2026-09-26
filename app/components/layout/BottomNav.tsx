"use client";

import React, { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import type { BottomNavItem } from "../../types/lobby";
import styles from "./BottomNav.module.css";

export type NavId = "withdraw" | "deposit" | "menu" | "cashback" | "contact";

export interface BottomNavProps {
  active?: NavId | null;
  onAction?: (id: NavId) => void;
  menuOpen?: boolean;
  menuDialogId?: string;
  showSpacer?: boolean;
  /* Compatibility with existing FloatingBottomNavProps */
  items?: BottomNavItem[];
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

const defaultItems: { id: NavId; label: string }[] = [
  { id: "withdraw", label: "ถอนเงิน" },
  { id: "deposit", label: "ฝากเงิน" },
  { id: "menu", label: "เมนู" },
  { id: "cashback", label: "คืนยอด" },
  { id: "contact", label: "ติดต่อ" },
];

function Icon({ id }: { id: NavId }) {
  const shapes: Record<NavId, ReactNode> = {
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
      {shapes[id]}
    </svg>
  );
}

/** Action-based navigation: connect onAction to your existing dialogs/routes. */
export function BottomNav({
  active,
  onAction,
  menuOpen,
  menuDialogId,
  showSpacer = false,
  onMenuClick,
  isMenuOpen,
}: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();

  const isMenuOpenResolved = menuOpen ?? isMenuOpen ?? false;

  const resolvedActive =
    active !== undefined
      ? active
      : pathname.startsWith("/cashback")
        ? "cashback"
        : pathname.startsWith("/support")
          ? "contact"
          : null;

  const handleAction = (id: NavId) => {
    onAction?.(id);

    if (id === "withdraw") {
      openWithdraw();
      return;
    }
    if (id === "deposit") {
      openDeposit();
      return;
    }
    if (id === "menu") {
      onMenuClick?.();
      return;
    }
    if (id === "cashback") {
      if (pathname !== "/cashback") {
        router.push("/cashback");
      }
      return;
    }
    if (id === "contact") {
      if (pathname !== "/support") {
        router.push("/support");
      }
      return;
    }
  };

  return (
    <>
      {showSpacer ? <div className={styles.spacer} aria-hidden="true" /> : null}
      <nav className={styles.nav} aria-label="เมนูหลัก">
        {/* Fixed-width crest keeps its curve circular at every viewport width. */}
        <svg className={styles.crest} viewBox="0 0 144 44" aria-hidden="true">
          <path d="M0 44C17 44 24 39 32 23C40 7 52 0 72 0C92 0 104 7 112 23C120 39 127 44 144 44Z" />
        </svg>
        <div className={styles.surface} aria-hidden="true" />
        <div className={styles.items}>
          {defaultItems.map(({ id, label }) => {
            const isMenu = id === "menu";
            const selected = isMenu ? isMenuOpenResolved || resolvedActive === id : resolvedActive === id;
            return (
              <button
                type="button"
                key={id}
                className={`${styles.item} ${isMenu ? styles.menu : ""}`}
                data-active={selected}
                onClick={() => handleAction(id)}
                aria-haspopup={isMenu ? "dialog" : undefined}
                aria-expanded={isMenu ? isMenuOpenResolved : undefined}
                aria-controls={isMenu ? menuDialogId : undefined}
                aria-current={selected && !isMenu ? "page" : undefined}
              >
                <span className={styles.icon}>
                  <Icon id={id} />
                </span>
                <span className={styles.label}>{label}</span>
                <span className={styles.dot} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
export { BottomNav as FloatingBottomNav };
