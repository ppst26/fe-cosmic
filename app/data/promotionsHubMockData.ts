/** ข้อมูล mock หน้าโปรโมชั่นและกิจกรรม (/promotions) — การ์ดเป็นโปรใหม่ กดแล้วเปิด modal อย่างเดียว */

import type { PromotionDetailId } from "@/app/data/promotionDetailMockData";

/** หมวดโปร (ไม่รวม all — ใช้กับฟิลเตอร์แท็บ) */
export type PromoHubCategoryId = "slots" | "casino" | "sport";

export type PromoHubCategoryFilterId = "all" | PromoHubCategoryId;

export interface PromoHubHero {
  title: string;
  subtitle: string;
  ctaLabel: string;
  detailId: PromotionDetailId;
  categories: PromoHubCategoryId[];
}

export interface PromoHubFeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
  ctaLabel: string;
  categories: PromoHubCategoryId[];
}

export interface PromoHubActivityItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
  ctaLabel: string;
  categories: PromoHubCategoryId[];
}

export const PROMOTIONS_HUB_CATEGORY_TABS: {
  id: PromoHubCategoryFilterId;
  label: string;
}[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "slots", label: "สล็อต" },
  { id: "casino", label: "คาสิโน" },
  { id: "sport", label: "กีฬา" },
];

export const PROMOTIONS_HUB_HERO: PromoHubHero = {
  title: "สิทธิพิเศษ ต้อนรับคุณ",
  subtitle: "ค้นพบโปรโมชั่นที่เหมาะกับคุณ",
  ctaLabel: "ดูรายละเอียด",
  detailId: "welcome",
  categories: ["slots", "casino", "sport"],
};

export const PROMOTIONS_HUB_FEATURED: PromoHubFeaturedItem[] = [
  {
    id: "featured-cashback",
    title: "คืนยอดเสีย",
    subtitle: "ตรวจสอบยอดคืนและรับโบนัสของคุณ",
    detailId: "promo-cashback",
    ctaLabel: "ดูรายละเอียด",
    categories: ["casino", "sport"],
  },
  {
    id: "featured-refer-friends",
    title: "ชวนเพื่อน รับรายได้ 2 ต่อ",
    subtitle: "แชร์ลิงก์และติดตามรายได้จากเพื่อน",
    detailId: "promo-refer-friends",
    ctaLabel: "ดูรายละเอียด",
    categories: ["slots", "casino", "sport"],
  },
  {
    id: "featured-vip",
    title: "สิทธิพิเศษ VIP",
    subtitle: "สำรวจรางวัลประจำระดับของคุณ",
    detailId: "promo-vip",
    ctaLabel: "ดูรายละเอียด",
    categories: ["casino"],
  },
  {
    id: "featured-slots-drops",
    title: "Drops & Wins สล็อต",
    subtitle: "ลุ้นรางวัลรายวันจาก Pragmatic Play",
    detailId: "welcome",
    ctaLabel: "ดูรายละเอียด",
    categories: ["slots"],
  },
  {
    id: "featured-sport-boost",
    title: "บูสต์คอมโบกีฬา",
    subtitle: "เพิ่มยอดชนะเมื่อแทงหลายคู่",
    detailId: "promo-cashback",
    ctaLabel: "ดูรายละเอียด",
    categories: ["sport"],
  },
];

export const PROMOTIONS_HUB_ACTIVITIES: PromoHubActivityItem[] = [
  {
    id: "activity-check-in",
    title: "เช็คอินรายวัน",
    subtitle: "สะสมวัน รับรางวัลเครดิตฟรี",
    detailId: "promo-check-in",
    ctaLabel: "ดูรายละเอียด",
    categories: ["slots", "casino"],
  },
  {
    id: "activity-wheel",
    title: "วงล้อพารวย",
    subtitle: "ลุ้นรับรางวัลมากมายทุกวัน",
    detailId: "promo-wheel",
    ctaLabel: "ดูรายละเอียด",
    categories: ["slots", "sport"],
  },
];

/**
 * กรองรายการโปรตามแท็บ — all แสดงทั้งหมด
 */
export function matchesPromoHubCategory(
  categories: PromoHubCategoryId[],
  filterId: PromoHubCategoryFilterId,
): boolean {
  if (filterId === "all") return true;
  return categories.includes(filterId);
}
