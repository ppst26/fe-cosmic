/** ข้อมูล mock แถบขวา desktop lobby — ไม่ใช่ยอด live */
export const DESKTOP_PLAYER_PANEL_MOCK = {
  gems: 1000,
  rankLabel: "GOLD",
  rankId: "gold" as const,
  expCurrent: 1250,
  expTarget: 2000,
  cashbackHint: "ตรวจสอบยอดคืนเงินที่มี",
} as const;

export const DESKTOP_ACTIVITY_LINKS = [
  {
    id: "activity-check-in",
    label: "เช็คอินรายวัน",
    href: "/missions/check-in",
    iconId: "check-in",
  },
  {
    id: "activity-wheel",
    label: "วงล้อนำโชค",
    href: "/wheel",
    iconId: "wheel",
  },
  {
    id: "activity-gems",
    label: "ร้านค้า Gems",
    href: "/gems-store",
    iconId: "gems",
  },
] as const;

/** การ์d โปรโมชันแนวนอนใต้กริด — desktop mock */
export const DESKTOP_FEATURE_PROMOS = [
  {
    id: "promo-wheel",
    title: "วงล้อนำโชค",
    subtitle: "หมุนรับรางวัล",
    href: "/wheel",
    tone: "violet" as const,
  },
  {
    id: "promo-check-in",
    title: "เช็คอินรายวัน",
    subtitle: "รับโบนัสทุกวัน",
    href: "/missions/check-in",
    tone: "indigo" as const,
  },
  {
    id: "promo-gems",
    title: "ร้านค้า Gems",
    subtitle: "แลกของรางวัล",
    href: "/gems-store",
    tone: "rose" as const,
  },
] as const;

/** การ์ดเมนู hub desktop — glass + พื้นหลัง 3D cover ขวา (public/assets/3d) */
export const DESKTOP_RIGHT_MENU_TILES = [
  {
    id: "menu-referral",
    variant: "cell" as const,
    title: "แนะนำเพื่อน",
    subtitle: "สร้างรายได้ 2 ชั้น",
    visualSrc: "/assets/3d/cashback.avif",
    isBg: true,
    href: "/referral",
    ariaLabel: "แนะนำเพื่อน สร้างรายได้ 2 ชั้น",
  },
  {
    id: "menu-check-in",
    variant: "cell" as const,
    title: "เช็คอิน",
    subtitle: "CHECK-IN",
    visualSrc: "/assets/3d/checkin.avif",
    isBg: true,
    href: "/missions/check-in",
    ariaLabel: "เช็คอิน CHECK-IN",
  },
  {
    id: "menu-wheel",
    variant: "cell" as const,
    title: "วงล้อ",
    subtitle: "LUCKY WHEEL",
    visualSrc: "/assets/3d/wheel.avif",
    isBg: true,
    href: "/wheel",
    ariaLabel: "วงล้อ LUCKY WHEEL",
  },
  {
    id: "menu-gems",
    variant: "cell" as const,
    title: "ร้านค้าเพชร",
    subtitle: "GEMS SHOP",
    visualSrc: "/assets/3d/diamond.avif",
    isBg: true,
    href: "/gems-store",
    ariaLabel: "ร้านค้าเพชร GEMS SHOP",
  },
  {
    id: "menu-coupon",
    variant: "cell" as const,
    title: "คูปอง",
    subtitle: "COUPON",
    visualSrc: "/assets/3d/coupon.avif",
    isBg: true,
    action: "coupon" as const,
    ariaLabel: "แลกคูปอง COUPON",
  },
  {
    id: "menu-vip",
    variant: "cell" as const,
    title: "ยศ VIP",
    subtitle: "สิทธิพิเศษสมาชิก",
    visualSrc: "/assets/3d/vip.avif",
    isBg: true,
    action: "vip-rank" as const,
    ariaLabel: "ยศ VIP สิทธิพิเศษสมาชิก",
  },
] as const;
