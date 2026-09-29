/** ข้อมูล mock หน้าโปรโมชั่นและกิจกรรม (/promotions) — การ์ดเป็นโปรใหม่ กดแล้วเปิด modal อย่างเดียว */

import type { PromotionDetailId } from "@/app/data/promotionDetailMockData";
import { HOME_PRO_BANNER_ASSETS } from "@/app/data/lobbyMockData";

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

/** หมวดแท็บมือถือหน้าโปรโมชั่น (layout รายการแนวตั้ง) */
export type PromoHubMobileCategoryId = "new-member" | "daily" | "privilege";

export type PromoHubMobileCategoryFilterId = "all" | PromoHubMobileCategoryId;

export interface PromoHubMobileListItem {
  id: string;
  title: string;
  detailId: PromotionDetailId;
  bannerSrc: string;
  expiresLabel: string;
  mobileCategories: PromoHubMobileCategoryId[];
}

export const PROMOTIONS_MOBILE_CATEGORY_TABS: {
  id: PromoHubMobileCategoryFilterId;
  label: string;
}[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "new-member", label: "สมาชิกใหม่" },
  { id: "daily", label: "ประจำวัน" },
  { id: "privilege", label: "สิทธิพิเศษ" },
];

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

export function matchesPromoHubMobileCategory(
  categories: PromoHubMobileCategoryId[],
  filterId: PromoHubMobileCategoryFilterId,
): boolean {
  if (filterId === "all") return true;
  return categories.includes(filterId);
}

/** รายการโปรมือถือ — แบนเนอร์จาก HomeProBanner ในโปรเจกต์ (ไม่ใช้ asset ตัวอย่าง UI) */
export const PROMOTIONS_MOBILE_LIST: PromoHubMobileListItem[] = [
  {
    id: "mobile-hero-welcome",
    title: "สิทธิพิเศษ ต้อนรับคุณ",
    detailId: "welcome",
    bannerSrc: HOME_PRO_BANNER_ASSETS[0],
    expiresLabel: "31/12/2568",
    mobileCategories: ["new-member", "privilege"],
  },
  {
    id: "mobile-cashback",
    title: "คืนยอดเสีย สูงสุด 30,000",
    detailId: "promo-cashback",
    bannerSrc: HOME_PRO_BANNER_ASSETS[1],
    expiresLabel: "31/12/2568",
    mobileCategories: ["daily", "privilege"],
  },
  {
    id: "mobile-refer",
    title: "ชวนเพื่อน รับรายได้ 2 ต่อ",
    detailId: "promo-refer-friends",
    bannerSrc: HOME_PRO_BANNER_ASSETS[2],
    expiresLabel: "30/06/2569",
    mobileCategories: ["new-member"],
  },
  {
    id: "mobile-vip",
    title: "สิทธิพิเศษ VIP",
    detailId: "promo-vip",
    bannerSrc: HOME_PRO_BANNER_ASSETS[3],
    expiresLabel: "31/12/2568",
    mobileCategories: ["privilege"],
  },
  {
    id: "mobile-slots-drops",
    title: "Drops & Wins สล็อต",
    detailId: "welcome",
    bannerSrc: HOME_PRO_BANNER_ASSETS[0],
    expiresLabel: "15/08/2568",
    mobileCategories: ["daily"],
  },
  {
    id: "mobile-sport-boost",
    title: "บูสต์คอมโบกีฬา",
    detailId: "promo-cashback",
    bannerSrc: HOME_PRO_BANNER_ASSETS[1],
    expiresLabel: "31/03/2569",
    mobileCategories: ["daily"],
  },
];
