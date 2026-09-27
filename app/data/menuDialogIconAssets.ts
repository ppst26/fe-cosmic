/**
 * ไอคอนเมนู dialog — public/assets/icons (RightMenuDrawer · MenuItemIcon variant asset)
 */
export const MENU_DIALOG_ICON_SRC: Record<string, string> = {
  profile: "/assets/3d/menuicon/profile.avif",
  transactions: "/assets/3d/menuicon/transactions.avif",
  rank: "/assets/3d/menuicon/rank.avif",
  promotions: "/assets/3d/menuicon/promotion.avif",
  activities: "/assets/3d/menuicon/event.avif",
  cashback: "/assets/3d/menuicon/cashback.avif",
  "check-in": "/assets/3d/menuicon/checkin.avif",
  wheel: "/assets/3d/menuicon/wheel.avif",
  gems: "/assets/3d/menuicon/diamond.avif",
  referral: "/assets/3d/menuicon/referral.avif",
  coupon: "/assets/3d/menuicon/coupon.avif",
};

export function getMenuDialogIconSrc(iconId: string): string | undefined {
  return MENU_DIALOG_ICON_SRC[iconId];
}
