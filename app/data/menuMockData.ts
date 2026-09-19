/** รูปนางแบบด้านขวา panel — public/assets/model/girl2.webp */
export const MENU_DIALOG_MODEL_SRC = "/assets/model/girl2.webp";

export type MenuDialogAction = "vip-rank" | "coupon";

export interface MenuDialogTile {
  id: string;
  label: string;
  href?: string;
  action?: MenuDialogAction;
  iconId: string;
}

export interface MenuDialogSection {
  id: string;
  sectionLabel: string;
  columns: 3 | 4;
  items: MenuDialogTile[];
}

/**
 * กลุ่มเมนู dialog — เลเบลด้านบนแต่ละกลุ่ม · grid 3 / 4 / 4
 * ใช้โดย app/components/layout/RightMenuDrawer.tsx
 */
export const MENU_DIALOG_SECTIONS: MenuDialogSection[] = [
  {
    id: "personal",
    sectionLabel: "ข้อมูลส่วนตัว",
    columns: 3,
    items: [
      { id: "profile", label: "โปรไฟล์", href: "/profile/account", iconId: "profile" },
      { id: "transactions", label: "ธุรกรรม", href: "/transactions", iconId: "transactions" },
      { id: "rank", label: "แร็งค์", action: "vip-rank", iconId: "rank" },
    ],
  },
  {
    id: "privileges",
    sectionLabel: "สิทธิพิเศษ",
    columns: 4,
    items: [
      { id: "promotions", label: "โปรโมชั่น", href: "/promotions", iconId: "promotions" },
      { id: "activities", label: "กิจกรรม", href: "/activities", iconId: "activities" },
      { id: "cashback", label: "คืนยอด", href: "/cashback", iconId: "cashback" },
      { id: "check-in", label: "เช็คอิน", href: "/missions/check-in", iconId: "check-in" },
    ],
  },
  {
    id: "rewards",
    sectionLabel: "ลุ้นรางวัล",
    columns: 4,
    items: [
      { id: "wheel", label: "วงล้อ", href: "/wheel", iconId: "wheel" },
      { id: "gems-shop", label: "ร้านค้า Gems", href: "/gems-store", iconId: "gems" },
      { id: "referral", label: "ชวนเพื่อน", href: "/referral", iconId: "referral" },
      { id: "coupon", label: "คูปอง", action: "coupon", iconId: "coupon" },
    ],
  },
];
