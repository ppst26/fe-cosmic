/* ── จาก app/data/menuMockData.ts ── */

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

export interface MenuDialogSection {
  id: string;
  sectionLabel: string;
  columns: 2 | 3 | 4;
  layout?: "vertical" | "horizontal";
  items: MenuDialogTile[];
}
