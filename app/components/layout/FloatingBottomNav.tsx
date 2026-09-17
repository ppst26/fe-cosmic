"use client";

import React, { useId } from "react";
import Link from "next/link";
import { BottomNavItem } from "../../types/lobby";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import {
  ContactNavIcon,
  DepositNavIcon,
  HamburgerMenuIcon,
  RefundIcon,
  WithdrawNavIcon,
} from "../ui/Icons";
import { cn } from "@/lib/utils";

interface FloatingBottomNavProps {
  items: BottomNavItem[];
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

const NAV_PLATE_PATH =
  "M 0 0 L 262 0 C 278 0 290 20 320 20 C 350 20 362 0 378 0 L 640 0 L 640 80 L 0 80 Z";

/**
 * แมปไอคอนเมนูล่าง
 */
function BottomNavIcon({ icon, className }: { icon: BottomNavItem["icon"]; className?: string }) {
  switch (icon) {
    case "menu":
      return <HamburgerMenuIcon className={className} />;
    case "deposit":
      return <DepositNavIcon className={className} />;
    case "withdraw":
      return <WithdrawNavIcon className={className} />;
    case "cashback":
      return <RefundIcon className={className} />;
    case "contact":
      return <ContactNavIcon className={className} />;
    default:
      return null;
  }
}

/**
 * พื้น nav โค้ง concave กลาง — วางใน .bottom-nav__surface
 */
function BottomNavSurface({ gradientId }: { gradientId: string }) {
  return (
    <svg
      className="bottom-nav__surface"
      viewBox="0 0 640 80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#19183b" />
          <stop offset="58%" stopColor="#121127" />
          <stop offset="100%" stopColor="#090810" />
        </linearGradient>
      </defs>
      <path d={NAV_PLATE_PATH} fill={`url(#${gradientId})`} />
    </svg>
  );
}

/**
 * FloatingBottomNav — เมนูล่าง .bottom-nav (ฝาก/ถอน = sheet · อื่น ๆ = ลิงก์)
 * บน desktop หน้า lobby ความกว้างจำกัดตาม .lobby-desktop-center — ดู globals.css
 */
export function FloatingBottomNav({
  items,
  onMenuClick,
  isMenuOpen = false,
}: FloatingBottomNavProps) {
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();
  const surfaceGradientId = useId().replace(/:/g, "");

  const renderItem = (item: BottomNavItem) => {
    if (item.icon === "menu") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={onMenuClick}
          className={cn("bottom-nav__item bottom-nav__item--center", isMenuOpen && "is-active")}
          aria-label="เปิดเมนูหลัก"
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
        >
          <span className="bottom-nav__orb">
            <HamburgerMenuIcon />
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      );
    }

    if (item.icon === "deposit") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={openDeposit}
          className="bottom-nav__item"
          aria-label="เปิดหน้าฝากเงิน"
          aria-haspopup="dialog"
        >
          <BottomNavIcon icon={item.icon} />
          {item.label}
        </button>
      );
    }

    if (item.icon === "withdraw") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={openWithdraw}
          className="bottom-nav__item"
          aria-label="เปิดหน้าถอนเงิน"
          aria-haspopup="dialog"
        >
          <BottomNavIcon icon={item.icon} />
          {item.label}
        </button>
      );
    }

    return (
      <Link key={item.id} href={item.href} className="bottom-nav__item">
        <BottomNavIcon icon={item.icon} />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="bottom-nav-shell">
      <nav className="bottom-nav" aria-label="เมนูหลักด้านล่าง">
        <BottomNavSurface gradientId={surfaceGradientId} />
        {items.map(renderItem)}
      </nav>
    </div>
  );
}
