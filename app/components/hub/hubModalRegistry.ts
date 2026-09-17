import type { CashbackTabId } from "@/app/data/cashbackMockData";
import type { TransactionKind } from "@/app/types/transaction";

/** หมวด hub ที่เปิดเป็น modal บน desktop (lg+) */
export type DesktopHubId =
  | "promotions"
  | "cashback"
  | "gems-store"
  | "account"
  | "referral"
  | "transactions"
  | "wheel"
  | "check-in";

export interface OpenHubOptions {
  cashbackTab?: CashbackTabId;
  transactionKind?: TransactionKind;
}

export const HUB_MODAL_TITLES: Record<DesktopHubId, string> = {
  promotions: "Promotions",
  cashback: "คืนยอด",
  "gems-store": "ร้านค้า Gems",
  account: "ข้อมูลบัญชี",
  referral: "ชวนเพื่อน",
  transactions: "ธุรกรรม",
  wheel: "วงล้อจักรวาล",
  "check-in": "เช็คอินรายวัน",
};

const PATH_TO_HUB: Record<string, DesktopHubId> = {
  "/promotions": "promotions",
  "/cashback": "cashback",
  "/gems-store": "gems-store",
  "/profile/account": "account",
  "/referral": "referral",
  "/transactions": "transactions",
  "/wheel": "wheel",
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

/** hub ที่ต้องล็อกอินก่อนเปิด modal */
export const HUB_REQUIRES_AUTH: ReadonlySet<DesktopHubId> = new Set([
  "cashback",
  "account",
  "transactions",
]);
