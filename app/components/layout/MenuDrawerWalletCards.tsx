"use client";

import Image from "next/image";
import { useGemsStore, useMenuTicketCount } from "@/app/hooks/api/member";
import { GEMS_STORE_GEM_ASSET } from "@/app/data/gemsStoreMockData";
import { useWallet } from "@/app/hooks/api/account";
import { HeaderWalletAssetIcon } from "./HeaderWalletAssetIcon";
import { cn } from "@/lib/utils";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { formatGemsBalance, formatHeaderWalletBalance, formatNumber } from "@/lib/format";

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
  const wallet = useWallet();
  const gemsStore = useGemsStore();
  const ticketCount = useMenuTicketCount();

  const balanceLabel =
    showAmounts && wallet.data ? formatHeaderWalletBalance(wallet.data.amount) : "—";
  const gemsLabel =
    showAmounts && gemsStore.data ? formatGemsBalance(gemsStore.data.balance) : "—";
  const ticketLabel =
    showAmounts && ticketCount.data !== null ? formatNumber(ticketCount.data) : "—";

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
          src={GEMS_STORE_GEM_ASSET}
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
