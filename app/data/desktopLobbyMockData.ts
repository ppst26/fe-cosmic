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
