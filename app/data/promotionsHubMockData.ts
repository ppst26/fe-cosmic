/** ข้อมูล mock หน้าโปรโมชั่นและกิจกรรม (/promotions) — การ์ดเป็นโปรใหม่ กดแล้วเปิด modal อย่างเดียว */

import type { PromotionDetailId } from "@/app/data/promotionDetailMockData";

export interface PromoHubHero {
  title: string;
  subtitle: string;
  ctaLabel: string;
  detailId: PromotionDetailId;
}

export interface PromoHubFeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
  ctaLabel: string;
}

export interface PromoHubActivityItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
  ctaLabel: string;
}

export const PROMOTIONS_HUB_HERO: PromoHubHero = {
  title: "สิทธิพิเศษ ต้อนรับคุณ",
  subtitle: "ค้นพบโปรโมชั่นที่เหมาะกับคุณ",
  ctaLabel: "ดูรายละเอียด",
  detailId: "welcome",
};

export const PROMOTIONS_HUB_FEATURED: PromoHubFeaturedItem[] = [
  {
    id: "featured-cashback",
    title: "คืนยอดเสีย",
    subtitle: "ตรวจสอบยอดคืนและรับโบนัสของคุณ",
    detailId: "promo-cashback",
    ctaLabel: "ดูรายละเอียด",
  },
  {
    id: "featured-refer-friends",
    title: "ชวนเพื่อน รับรายได้ 2 ต่อ",
    subtitle: "แชร์ลิงก์และติดตามรายได้จากเพื่อน",
    detailId: "promo-refer-friends",
    ctaLabel: "ดูรายละเอียด",
  },
  {
    id: "featured-vip",
    title: "สิทธิพิเศษ VIP",
    subtitle: "สำรวจรางวัลประจำระดับของคุณ",
    detailId: "promo-vip",
    ctaLabel: "ดูรายละเอียด",
  },
];

export const PROMOTIONS_HUB_ACTIVITIES: PromoHubActivityItem[] = [
  {
    id: "activity-check-in",
    title: "เช็คอินรายวัน",
    subtitle: "สะสมวัน รับรางวัลเครดิตฟรี",
    detailId: "promo-check-in",
    ctaLabel: "ดูรายละเอียด",
  },
  {
    id: "activity-wheel",
    title: "วงล้อพารวย",
    subtitle: "ลุ้นรับรางวัลมากมายทุกวัน",
    detailId: "promo-wheel",
    ctaLabel: "ดูรายละเอียด",
  },
];
