/**
 * ไอคอนเมนู dialog — public/assets/icons (RightMenuDrawer · MenuItemIcon variant asset)
 */
export const MENU_DIALOG_ICON_SRC: Record<string, string> = {
  profile: "/assets/icons/profile.avif",
  transactions: "/assets/icons/transaction.avif",
  rank: "/assets/icons/rank.avif",
  promotions: "/assets/icons/promotiokn.avif",
  activities: "/assets/icons/mission.avif",
  cashback: "/assets/icons/cashback.avif",
  "check-in": "/assets/icons/checkin.avif",
  wheel: "/assets/icons/wheel.avif",
  gems: "/assets/icons/gems.avif",
  referral: "/assets/icons/referal.avif",
  coupon: "/assets/icons/coupon.avif",
};

export function getMenuDialogIconSrc(iconId: string): string | undefined {
  return MENU_DIALOG_ICON_SRC[iconId];
}
