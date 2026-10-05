/** จำนวนตั๋ว mock — การ์ดบนเมนูเต็มจอ (MenuDrawerWalletCards) */
export const MENU_DIALOG_TICKET_COUNT_MOCK = 2;

export type MenuDialogAction = "vip-rank" | "coupon";

export interface MenuDialogTile {
  id: string;
  label: string;
  href?: string;
  action?: MenuDialogAction;
  iconId: string;
  /** ต้องล็อกอินก่อน — เปิด login sheet (RightMenuDrawer) */
  requiresAuth?: boolean;
  /** ยังไม่เปิดใช้ — แสดง Coming soon · ไม่นำทาง */
  comingSoon?: boolean;
}

/** เมนูที่ต้องล็อกอินก่อนเข้า */
export function menuTileRequiresAuth(tile: MenuDialogTile): boolean {
  return tile.requiresAuth === true;
}

/** action เมนูที่ต้องล็อกอิน (sidebar desktop · mobile drawer) */
export const MENU_DIALOG_ACTION_REQUIRES_AUTH: Record<MenuDialogAction, boolean> = {
  "vip-rank": true,
  coupon: true,
};

export function menuActionRequiresAuth(action: MenuDialogAction): boolean {
  return MENU_DIALOG_ACTION_REQUIRES_AUTH[action] === true;
}

/**
 * path จาก href เมนู — ใช้เช็ค requiresAuth (วงล้อ / ตั๋ว ที่ไม่ใช่ hub modal)
 */
export function menuHrefRequiresAuth(href: string): boolean {
  const path = href.split("?")[0]?.split("#")[0] ?? href;
  const normalized =
    path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  const tile = MENU_DIALOG_ALL_TILES.find((t) => {
    if (!t.href) return false;
    const tilePath = t.href.split("?")[0]?.split("#")[0] ?? t.href;
    const tileNorm =
      tilePath.endsWith("/") && tilePath.length > 1
        ? tilePath.slice(0, -1)
        : tilePath;
    return tileNorm === normalized;
  });
  return tile ? menuTileRequiresAuth(tile) : false;
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
      { id: "profile", label: "โปรไฟล์", href: "/profile/account", iconId: "profile", requiresAuth: true },
      { id: "transactions", label: "ธุรกรรม", href: "/transactions", iconId: "transactions", requiresAuth: true },
      { id: "rank", label: "แรงค์", action: "vip-rank", iconId: "rank", requiresAuth: true },
    ],
  },
  {
    id: "privileges",
    sectionLabel: "สิทธิพิเศษ",
    columns: 4,
    layout: "horizontal",
    items: [
      { id: "promotions", label: "โปรโมชั่น", href: "/promotions", iconId: "promotions" },
      { id: "cashback", label: "คืนยอด", href: "/cashback", iconId: "cashback", requiresAuth: true },
      { id: "check-in", label: "เช็คอิน", href: "/missions/check-in", iconId: "check-in", requiresAuth: true },
      { id: "referral", label: "ชวนเพื่อน", href: "/referral", iconId: "referral", requiresAuth: true },
    ],
  },
  {
    id: "rewards",
    sectionLabel: "ลุ้นรางวัล",
    columns: 4,
    layout: "horizontal",
    items: [
      {
        id: "reward-hub",
        label: "สุ่มของรางวัล",
        href: "/reward",
        iconId: "reward-hub",
        requiresAuth: true,
      },
      { id: "wheel", label: "วงล้อ", href: "/wheel", iconId: "wheel", requiresAuth: true },
      { id: "gems-shop", label: "ร้านค้า Gems", href: "/gems-store", iconId: "gems", requiresAuth: true },
      { id: "activities", label: "กิจกรรม", href: "/event", iconId: "activities" },
      { id: "coupon", label: "คูปอง", action: "coupon", iconId: "coupon", requiresAuth: true },
    ],
  },
];

/** รายการเมนูรวมทุกกลุ่ม — grid เต็มจอมือถือ (RightMenuDrawer) */
export const MENU_DIALOG_ALL_TILES: MenuDialogTile[] = MENU_DIALOG_SECTIONS.flatMap(
  (section) => section.items,
);
