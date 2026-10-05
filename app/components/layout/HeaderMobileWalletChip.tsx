import { HeaderWalletChip } from "./HeaderWalletChip";

type HeaderMobileWalletChipProps = {
  balanceLabel: string;
  onClick: () => void;
  className?: string;
};

/** @deprecated ใช้ HeaderWalletChip — คง export ให้ import เก่า */
export function HeaderMobileWalletChip(props: HeaderMobileWalletChipProps) {
  return <HeaderWalletChip {...props} variant="mobile" />;
}
