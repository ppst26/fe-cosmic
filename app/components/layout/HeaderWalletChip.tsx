import { HeaderWalletAssetIcon } from "./HeaderWalletAssetIcon";
import { cn } from "@/lib/utils";
import { valueClass } from "@/lib/semanticValue";

type HeaderWalletChipProps = {
  balanceLabel: string;
  /** มือถือ — กดเปิดฝาก; desktop — แสดงยอดอย่างเดียวถ้าไม่ส่ง */
  onClick?: () => void;
  variant?: "mobile" | "desktop";
  className?: string;
};

/**
 * ชิปยอดเครดิต — การ์ดเดียว · ตัวเลขแล้วไอคอนกระเป๋าด้านหลัง (Header · LobbyDesktopTopBar)
 */
export function HeaderWalletChip({
  balanceLabel,
  onClick,
  variant = "mobile",
  className,
}: HeaderWalletChipProps) {
  const rootClass = cn(
    "header-wallet-chip",
    variant === "desktop" && "header-wallet-chip--desktop",
    className,
  );

  const chipInner = (
    <>
      <span
        className={valueClass(
          "emphasis",
          cn(
            "header-wallet-chip__amount cosmic-nav__wallet-balance",
            variant === "desktop" && "max-w-[min(100%,7.5rem)] truncate",
          ),
        )}
      >
        {balanceLabel}
      </span>
      <span className="header-wallet-chip__icon" aria-hidden>
        <HeaderWalletAssetIcon className="header-wallet-chip__icon-img" />
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={rootClass}
        aria-label="ฝากเงินและดูยอดเครดิต"
      >
        {chipInner}
      </button>
    );
  }

  return (
    <div className={rootClass} aria-live="polite" aria-label="ยอดเครดิต">
      {chipInner}
    </div>
  );
}
