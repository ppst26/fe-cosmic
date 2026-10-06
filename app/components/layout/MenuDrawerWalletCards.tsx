"use client";

import Image from "next/image";
import { fetchGemsStore } from "@/lib/api/gemsStore";
import { fetchMenuTicketCount, fetchWalletBalance } from "@/lib/api/profile";
import { HeaderWalletAssetIcon } from "./HeaderWalletAssetIcon";
import { cn } from "@/lib/utils";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { formatGemsBalance, formatHeaderWalletBalance } from "@/lib/format";

const MENU_TICKET_ICON_SRC = getMenuIconSrc("ticket") ?? "/assets/3d/menuicon/lottery.avif";

interface MenuDrawerWalletCardsProps {
  className?: string;
}

/**
 * ยอดเครดิต · เพชร · ตั๋วบนเมนูมือถือ — ไอคอน · ชื่อ · ตัวเลข (RightMenuDrawer)
 */
export function MenuDrawerWalletCards({ className }: MenuDrawerWalletCardsProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const showAmounts = isAuthenticated && !isLoading;
  const wallet = fetchWalletBalance();
  const gemsStore = fetchGemsStore();
  const ticketCount = fetchMenuTicketCount();

  const balanceLabel = showAmounts ? formatHeaderWalletBalance(wallet.amount) : "—";
  const gemsLabel = showAmounts ? formatGemsBalance(gemsStore.balance) : "—";
  const ticketLabel = showAmounts
    ? new Intl.NumberFormat("th-TH").format(ticketCount)
    : "—";

  return (
    <div className={cn("menu-drawer-balances grid grid-cols-3", className)}>
      <div className="menu-drawer-balance flex flex-col items-center justify-center px-1 text-center">
        <HeaderWalletAssetIcon className="h-9 w-9 shrink-0 object-contain" />
        <span className="text-[11px] font-medium leading-tight text-[var(--text-secondary)] sm:text-xs">
          ยอดเงินในเกม
        </span>
        <p className="text-2xl font-medium tabular-nums leading-none text-white sm:text-[1.75rem]">
          {balanceLabel}
        </p>
      </div>

      <div className="menu-drawer-balance flex flex-col items-center justify-center px-1 text-center">
        <Image
          src={gemsStore.gemAsset}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 object-contain"
        />
        <span className="text-[11px] font-medium leading-tight text-[var(--text-secondary)] sm:text-xs">
          เพชร
        </span>
        <p className="text-2xl font-medium tabular-nums leading-none text-white sm:text-[1.75rem]">
          {gemsLabel}
        </p>
      </div>

      <div className="menu-drawer-balance flex flex-col items-center justify-center px-1 text-center">
        <Image
          src={MENU_TICKET_ICON_SRC}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 object-contain"
        />
        <span className="text-[11px] font-medium leading-tight text-[var(--text-secondary)] sm:text-xs">
          ตั๋ว
        </span>
        <p className="text-2xl font-medium tabular-nums leading-none text-white sm:text-[1.75rem]">
          {ticketLabel}
        </p>
      </div>
    </div>
  );
}
