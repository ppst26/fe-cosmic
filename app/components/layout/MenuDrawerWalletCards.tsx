"use client";

import Image from "next/image";
import {
  formatGemsBalance,
  GEMS_STORE_BALANCE_MOCK,
  GEMS_STORE_GEM_ASSET,
} from "@/app/data/gemsStoreMockData";
import {
  formatHeaderWalletBalance,
  MOCK_MAIN_WALLET_BALANCE,
} from "@/app/data/walletMockData";
import { HeaderWalletAssetIcon } from "./HeaderWalletAssetIcon";
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import { cn } from "@/lib/utils";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";

const MENU_TICKET_ICON_SRC = getMenuIconSrc("ticket") ?? "/assets/3d/menuicon/lottery.avif";

interface MenuDrawerWalletCardsProps {
  className?: string;
}

/**
 * ยอดเครดิต · เพชร · ตั๋วบนเมนูมือถือ — ไอคอน · ชื่อ · ตัวเลข (RightMenuDrawer)
 */
export function MenuDrawerWalletCards({ className }: MenuDrawerWalletCardsProps) {
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);
  const gemsLabel = formatGemsBalance(GEMS_STORE_BALANCE_MOCK);
  const ticketLabel = new Intl.NumberFormat("th-TH").format(MENU_DIALOG_TICKET_COUNT_MOCK);

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
