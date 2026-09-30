import Image from "next/image";
import { fetchWalletBalance } from "@/lib/api/profile";
import { cn } from "@/lib/utils";

/**
 * ไอคอนกระเป๋า Wallet2 — Header mobile/desktop · เมนูยอดเงิน
 */
export function HeaderWalletAssetIcon({ className }: { className?: string }) {
  const iconSrc = fetchWalletBalance().iconSrc;
  return (
    <Image
      src={iconSrc}
      alt=""
      width={24}
      height={24}
      className={cn("shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}
