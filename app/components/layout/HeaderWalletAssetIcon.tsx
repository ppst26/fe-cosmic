import { cn } from "@/lib/utils";

/** ไอคอนกระเป๋าใน Header / เมนู (asset คงที่ ไม่ได้มาจาก API) */
const HEADER_WALLET_ICON_SRC = "/assets/deposit/Wallet2.avif";

/**
 * ไอคอนกระเป๋า Wallet2 — Header mobile/desktop · เมนูยอดเงิน
 */
export function HeaderWalletAssetIcon({ className }: { className?: string }) {
  return (
    <img
      src={HEADER_WALLET_ICON_SRC}
      alt=""
      width={24}
      height={24}
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}
