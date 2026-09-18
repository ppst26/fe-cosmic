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

/** การ์ดเมนูแถบขวา desktop — variant hero = feature สูง x2 · tone สำหรับ CSS */
export const DESKTOP_RIGHT_MENU_TILES = [
  {
    id: "menu-referral",
    variant: "hero" as const,
    tone: "referral" as const,
    iconId: "referral",
    title: "แนะนำเพื่อน",
    subtitle: "สร้างรายได้ 2 ชั้น",
    href: "/referral",
    ariaLabel: "แนะนำเพื่อน สร้างรายได้ 2 ชั้น",
  },
  {
    id: "menu-check-in",
    variant: "cell" as const,
    tone: "check-in" as const,
    iconId: "check-in",
    title: "เช็คอิน",
    subtitle: "CHECK-IN",
    href: "/missions/check-in",
    ariaLabel: "เช็คอิน CHECK-IN",
  },
  {
    id: "menu-wheel",
    variant: "cell" as const,
    tone: "wheel" as const,
    iconId: "wheel",
    title: "วงล้อ",
    subtitle: "LUCKY WHEEL",
    href: "/wheel",
    ariaLabel: "วงล้อ LUCKY WHEEL",
  },
  {
    id: "menu-promotions",
    variant: "cell" as const,
    tone: "promotions" as const,
    iconId: "promotions",
    title: "โปรโมชั่น",
    subtitle: "PROMOTION",
    href: "/promotions",
    ariaLabel: "โปรโมชั่น PROMOTION",
  },
  {
    id: "menu-gems",
    variant: "cell" as const,
    tone: "gems" as const,
    iconId: "gems",
    title: "ร้านค้าเพชร",
    subtitle: "GEMS SHOP",
    href: "/gems-store",
    ariaLabel: "ร้านค้าเพชร GEMS SHOP",
  },
  {
    id: "menu-coupon",
    variant: "cell" as const,
    tone: "coupon" as const,
    iconId: "coupon",
    title: "คูปอง",
    subtitle: "COUPON",
    action: "coupon" as const,
    ariaLabel: "แลกคูปอง COUPON",
  },
  {
    id: "menu-vip",
    variant: "hero" as const,
    tone: "vip" as const,
    iconId: "rank",
    title: "ยศ VIP",
    subtitle: "สิทธิพิเศษสมาชิก",
    action: "vip-rank" as const,
    ariaLabel: "ยศ VIP สิทธิพิเศษสมาชิก",
  },
] as const;
