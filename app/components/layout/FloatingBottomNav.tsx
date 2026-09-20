"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNavItem } from "../../types/lobby";
import { useDeposit } from "../deposit/DepositProvider";
import { useWithdraw } from "../withdraw/WithdrawProvider";
import {
  BonusNavIcon,
  ContactNavIcon,
  DepositNavIcon,
  HamburgerMenuIcon,
  WithdrawNavIcon,
} from "../ui/Icons";
import { cn } from "@/lib/utils";

interface FloatingBottomNavProps {
  items: BottomNavItem[];
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

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
      return <BonusNavIcon className={className} />;
    case "contact":
      return <ContactNavIcon className={className} />;
    default:
      return null;
  }
}

/**
 * สถานะ active ตาม route หรือเมนูที่เปิดอยู่
 */
function isNavItemActive(
  item: BottomNavItem,
  pathname: string,
  isMenuOpen: boolean,
): boolean {
  if (item.icon === "menu") return isMenuOpen;
  if (item.icon === "cashback") {
    return pathname === "/cashback" || pathname.startsWith("/cashback/");
  }
  if (item.icon === "contact") {
    return pathname === "/support" || pathname.startsWith("/support/");
  }
  return false;
}

/**
 * FloatingBottomNav — แคปซูลลอยมือถือ (ฝาก/ถอน = sheet · อื่น ๆ = ลิงก์)
 * desktop (lg+) ซ่อน — ใช้ sidebar/header แทน
 */
export function FloatingBottomNav({
  items,
  onMenuClick,
  isMenuOpen = false,
}: FloatingBottomNavProps) {
  const pathname = usePathname();
  const { openDeposit } = useDeposit();
  const { openWithdraw } = useWithdraw();

  const itemClass = (item: BottomNavItem) =>
    cn("bottom-nav__item", isNavItemActive(item, pathname, isMenuOpen) && "is-active");

  const itemContent = (item: BottomNavItem) => (
    <>
      <span className="bottom-nav__icon" aria-hidden="true">
        <BottomNavIcon icon={item.icon} />
      </span>
      <span className="bottom-nav__label cosmic-type-nav-label">{item.label}</span>
    </>
  );

  const renderItem = (item: BottomNavItem) => {
    if (item.icon === "menu") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={onMenuClick}
          className={itemClass(item)}
          aria-label="เปิดเมนูหลัก"
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
        >
          {itemContent(item)}
        </button>
      );
    }

    if (item.icon === "deposit") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={openDeposit}
          className={itemClass(item)}
          aria-label="เปิดหน้าฝากเงิน"
          aria-haspopup="dialog"
        >
          {itemContent(item)}
        </button>
      );
    }

    if (item.icon === "withdraw") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={openWithdraw}
          className={itemClass(item)}
          aria-label="เปิดหน้าถอนเงิน"
          aria-haspopup="dialog"
        >
          {itemContent(item)}
        </button>
      );
    }

    return (
      <Link key={item.id} href={item.href} className={itemClass(item)}>
        {itemContent(item)}
      </Link>
    );
  };

  return (
    <div className="bottom-nav-shell lg:hidden">
      <nav className="bottom-nav" aria-label="เมนูหลักด้านล่าง">
        {items.map(renderItem)}
      </nav>
    </div>
  );
}
