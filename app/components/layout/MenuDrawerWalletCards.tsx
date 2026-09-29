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
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import { COSMIC_PANEL_GLASS } from "@/app/components/ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

import { getMenuIconSrc } from "@/app/data/menuIconAssets";

const MENU_TICKET_ICON_SRC = getMenuIconSrc("ticket") ?? "/assets/3d/menuicon/lottery.avif";

interface MenuDrawerWalletCardsProps {
  className?: string;
}

/**
 * การ์ดยอดเครดิต + เพชรบนเมนูเต็มจอมือถือ — mock จนกว่าจะมี API
 * ใช้ใน RightMenuDrawer.tsx
 */
export function MenuDrawerWalletCards({ className }: MenuDrawerWalletCardsProps) {
  const balanceLabel = formatHeaderWalletBalance(MOCK_MAIN_WALLET_BALANCE);
  const gemsLabel = formatGemsBalance(GEMS_STORE_BALANCE_MOCK);

  const ticketLabel = new Intl.NumberFormat("th-TH").format(MENU_DIALOG_TICKET_COUNT_MOCK);

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <div className={cn(COSMIC_PANEL_GLASS, "flex flex-col gap-1 p-2.5 min-h-[72px] sm:p-3")}>
        <span className="cosmic-type-sheet-meta leading-none">ยอดเงินในเกม</span>
        <p className="text-base font-medium text-white tabular-nums leading-tight mt-1">
          {balanceLabel}
        </p>
      </div>

      <div className={cn(COSMIC_PANEL_GLASS, "flex flex-col gap-1 p-2.5 min-h-[72px] sm:p-3")}>
        <span className="cosmic-type-sheet-meta leading-none">เพชร</span>
        <div className="flex items-center gap-1.5 mt-1 min-w-0">
          <Image
            src={GEMS_STORE_GEM_ASSET}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain"
          />
          <p className="text-base font-medium text-white tabular-nums leading-tight truncate">
            {gemsLabel}
          </p>
        </div>
      </div>

      <div className={cn(COSMIC_PANEL_GLASS, "flex flex-col gap-1 p-2.5 min-h-[72px] sm:p-3")}>
        <span className="cosmic-type-sheet-meta leading-none">ตั๋ว</span>
        <div className="flex items-center gap-1.5 mt-1 min-w-0">
          <Image
            src={MENU_TICKET_ICON_SRC}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain"
          />
          <p className="text-base font-medium text-white tabular-nums leading-tight truncate">
            {ticketLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
