/** จำนวนตั๋ว mock — การ์ดบนเมนูเต็มจอ (MenuDrawerWalletCards) */
export const MENU_DIALOG_TICKET_COUNT_MOCK = 2;

/** seed สำหรับ avatar mock บนเมนู — Dicebear (MenuDrawerUserAvatar) */
const MENU_MOCK_AVATAR_SEEDS = [
  "cosmic-nova",
  "cosmic-orbit",
  "cosmic-pulse",
  "cosmic-vega",
  "cosmic-lyra",
  "cosmic-comet",
  "cosmic-pluto",
  "cosmic-aurora",
  "cosmic-nebula",
  "cosmic-stellar",
] as const;

/**
 * สุ่ม seed avatar เมนู — เรียกครั้งเดียวต่อ mount
 */
export function pickMenuMockAvatarSeed(): string {
  const index = Math.floor(Math.random() * MENU_MOCK_AVATAR_SEEDS.length);
  return MENU_MOCK_AVATAR_SEEDS[index] ?? MENU_MOCK_AVATAR_SEEDS[0];
}

/**
 * URL รูป avatar mock วงกลม — ใช้ใน MenuDrawerUserAvatar
 */
export function menuMockAvatarImageUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(seed)}&size=160`;
}

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
  columns: 2 | 3 | 4;
  layout?: "vertical" | "horizontal";
  items: MenuDialogTile[];
}

/**
 * กลุ่มเมนู dialog — เลเบลด้านบนแต่ละกลุ่ม · grid 3 / 2 (row) / 4
 * ใช้โดย app/components/layout/RightMenuDrawer.tsx
 */
export const MENU_DIALOG_SECTIONS: MenuDialogSection[] = [
  {
    id: "personal",
    sectionLabel: "ข้อมูลส่วนตัว",
    columns: 3,
    layout: "vertical",
    items: [
      { id: "profile", label: "โปรไฟล์", href: "/profile/account", iconId: "profile" },
      { id: "transactions", label: "ธุรกรรม", href: "/transactions", iconId: "transactions" },
      { id: "rank", label: "แรงค์", action: "vip-rank", iconId: "rank" },
    ],
  },
  {
    id: "privileges",
    sectionLabel: "สิทธิพิเศษ",
    columns: 4,
    layout: "horizontal",
    items: [
      { id: "promotions", label: "โปรโมชั่น", href: "/promotions", iconId: "promotions" },
      { id: "cashback", label: "คืนยอด", href: "/cashback", iconId: "cashback" },
      { id: "check-in", label: "เช็คอิน", href: "/missions/check-in", iconId: "check-in" },
      { id: "referral", label: "ชวนเพื่อน", href: "/referral", iconId: "referral" },
    ],
  },
  {
    id: "rewards",
    sectionLabel: "ลุ้นรางวัล",
    columns: 4,
    layout: "horizontal",
    items: [
      { id: "wheel", label: "วงล้อ", href: "/wheel", iconId: "wheel" },
      { id: "gems-shop", label: "ร้านค้า Gems", href: "/gems-store", iconId: "gems" },
      { id: "activities", label: "กิจกรรม", href: "/event", iconId: "activities" },
      { id: "coupon", label: "คูปอง", action: "coupon", iconId: "coupon" },
      { id: "ticket", label: "ตั๋ว", href: "/lottery/slips", iconId: "ticket" },
    ],
  },
];

/** รายการเมนูรวมทุกกลุ่ม — grid เต็มจอมือถือ (RightMenuDrawer) */
export const MENU_DIALOG_ALL_TILES: MenuDialogTile[] = MENU_DIALOG_SECTIONS.flatMap(
  (section) => section.items,
);
