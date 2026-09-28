import type { CashbackTabId } from "@/app/data/cashbackMockData";
import type { TransactionKind } from "@/app/types/transaction";

/** หมวด hub ที่เปิดเป็น modal บน desktop (lg+) */
export type DesktopHubId =
  | "promotions"
  | "activities"
  | "cashback"
  | "gems-store"
  | "account"
  | "referral"
  | "transactions"
  | "check-in";

export interface OpenHubOptions {
  cashbackTab?: CashbackTabId;
  transactionKind?: TransactionKind;
}

export const HUB_MODAL_TITLES: Record<DesktopHubId, string> = {
  promotions: "Promotions",
  activities: "กิจกรรม",
  cashback: "คืนยอด",
  "gems-store": "ร้านค้า Gems",
  account: "ข้อมูลบัญชี",
  referral: "ชวนเพื่อน",
  transactions: "ธุรกรรม",
  "check-in": "เช็คอินรายวัน",
};

const PATH_TO_HUB: Record<string, DesktopHubId> = {
  "/promotions": "promotions",
  "/event": "activities",
  "/cashback": "cashback",
  "/gems-store": "gems-store",
  "/profile/account": "account",
  "/referral": "referral",
  "/transactions": "transactions",
  "/missions/check-in": "check-in",
};

/**
 * แยก pathname จาก href (รองรับ query string)
 */
export function getHrefPathname(href: string): string {
  const path = href.split("?")[0]?.split("#")[0] ?? href;
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

/**
 * แมป href → hub id + ตัวเลือกเปิด (เช่น แท็บ cashback)
 */
export function parseHubFromHref(href: string): {
  id: DesktopHubId | null;
  options?: OpenHubOptions;
} {
  const pathname = getHrefPathname(href);

  if (pathname === "/loss-rebate") {
    return { id: "cashback", options: { cashbackTab: "loss" } };
  }

  const id = PATH_TO_HUB[pathname] ?? null;
  if (!id) return { id: null };

  const options: OpenHubOptions = {};
  const query = href.includes("?") ? href.split("?")[1]?.split("#")[0] : "";

  if (query) {
    const params = new URLSearchParams(query);
    if (id === "cashback") {
      const tab = params.get("tab");
      if (tab === "loss") options.cashbackTab = "loss";
    }
    if (id === "transactions") {
      const kind = params.get("kind");
      if (kind === "withdraw") options.transactionKind = "withdraw";
    }
  }

  return { id, options: Object.keys(options).length ? options : undefined };
}

export function hrefToHubId(href: string): DesktopHubId | null {
  return parseHubFromHref(href).id;
}

export function isDesktopHubId(value: string | null): value is DesktopHubId {
  return value !== null && value in HUB_MODAL_TITLES;
}

/** hub ที่ต้องล็อกอินก่อนเปิด modal */
export const HUB_REQUIRES_AUTH: ReadonlySet<DesktopHubId> = new Set([
  "cashback",
  "account",
  "transactions",
]);

/** Hub ที่ใช้ responsive sheet แบบคูปอง/ฝาก-ถอน (ไม่ใช่ modal hub กลางจอแบบเดิม) */
export const RESPONSIVE_SHEET_HUB_IDS: ReadonlySet<DesktopHubId> = new Set([
  "promotions",
  "activities",
  "cashback",
  "gems-store",
  "referral",
  "check-in",
  "account",
  "transactions",
]);

export function isResponsiveSheetHub(id: DesktopHubId): boolean {
  return RESPONSIVE_SHEET_HUB_IDS.has(id);
}

/** ความกว้าง sheet บน desktop — wide สำหรับ master–detail · hubCompact สำหรับเช็คอิน */
export function getHubSheetSize(id: DesktopHubId): "compact" | "wide" | "hubCompact" {
  if (id === "check-in") {
    return "hubCompact";
  }
  if (
    id === "referral" ||
    id === "promotions" ||
    id === "activities" ||
    id === "transactions" ||
    id === "account"
  ) {
    return "wide";
  }
  return "compact";
}
