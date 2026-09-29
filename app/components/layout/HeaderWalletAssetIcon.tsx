import Image from "next/image";
import { HEADER_WALLET_ICON_SRC } from "@/app/data/walletMockData";
import { cn } from "@/lib/utils";

/**
 * ไอคอนกระเป๋า Wallet2 — Header mobile/desktop · เมนูยอดเงิน
 */
export function HeaderWalletAssetIcon({ className }: { className?: string }) {
  return (
    <Image
      src={HEADER_WALLET_ICON_SRC}
      alt=""
      width={24}
      height={24}
      className={cn("shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}
