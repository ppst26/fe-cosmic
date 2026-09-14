import React from "react";
import Link from "next/link";
import { BottomNavItem } from "../../types/lobby";
import {
  BonusNavIcon,
  ContactNavIcon,
  DepositNavIcon,
  ProfileNavIcon,
  WithdrawNavIcon,
} from "../ui/Icons";

interface FloatingBottomNavProps {
  items: BottomNavItem[];
}

/**
 * แมปไอคอนเมนูล่าง
 */
function BottomNavIcon({ icon, className }: { icon: BottomNavItem["icon"]; className?: string }) {
  switch (icon) {
    case "profile":
      return <ProfileNavIcon className={className} />;
    case "deposit":
      return <DepositNavIcon className={className} />;
    case "withdraw":
      return <WithdrawNavIcon className={className} />;
    case "bonus":
      return <BonusNavIcon className={className} />;
    case "contact":
      return <ContactNavIcon className={className} />;
    default:
      return null;
  }
}

/**
 * FloatingBottomNav — เมนูล่าง 5 ช่อง fixed ตาม design.md
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function FloatingBottomNav({ items }: FloatingBottomNavProps) {
  return (
    <nav className="floating-nav" aria-label="เมนูหลักด้านล่าง">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="text-[var(--icon-default)] transition-colors hover:text-[var(--icon-active)]"
        >
          <BottomNavIcon icon={item.icon} className="h-6 w-6" />
          <span className="truncate text-[10px] font-semibold text-[var(--text-secondary)]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
