/** เนื้อหา mock ใน modal รายละเอียดโปรโมชั่น (โปร standalone — ไม่ลิงก์ไปหน้าอื่น) */

export type PromotionDetailId =
  | "welcome"
  | "promo-cashback"
  | "promo-refer-friends"
  | "promo-vip"
  | "promo-check-in"
  | "promo-wheel";

export type PromotionDetailBlockIcon = "shield" | "gift" | "info" | "coin" | "referral" | "calendar" | "wheel";

export interface PromotionDetailBlock {
  icon: PromotionDetailBlockIcon;
  title: string;
  description?: string;
  bullets?: string[];
  showDividerBefore?: boolean;
}

export interface PromotionDetailContent {
  id: PromotionDetailId;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerArt: PromotionDetailBlockIcon;
  blocks: PromotionDetailBlock[];
  footerNote: string;
}

const DESIGN_FOOTER = "ข้อความตัวอย่างสำหรับการออกแบบ";

export const PROMOTION_DETAILS: Record<PromotionDetailId, PromotionDetailContent> = {
  welcome: {
    id: "welcome",
    bannerTitle: "สิทธิพิเศษ ต้อนรับคุณ",
    bannerSubtitle: "ค้นพบโปรโมชั่นที่เหมาะกับคุณ",
    bannerArt: "gift",
    blocks: [
      {
        icon: "gift",
        title: "แพ็กต้อนรับสมาชิกใหม่",
        description: "รับสิทธิพิเศษเมื่อสมัครและเริ่มเล่นครั้งแรก ตามเงื่อนไขโปรโมชันนี้",
      },
      {
        icon: "info",
        title: "สิทธิประโยชน์ที่ร่วมรายการ",
        bullets: ["โบนัสต้อนรับ", "เครดิตฟรีสำหรับสมาชิกใหม่", "โปรโมชันเสริมตามช่วงเวลา"],
        showDividerBefore: true,
      },
      {
        icon: "info",
        title: "เงื่อนไขการรับสิทธิ์",
        bullets: [
          "ใช้ได้กับสมาชิกที่ผ่านการยืนยันตามที่ระบบกำหนด",
          "อ่านรายละเอียดในโปรโมชันนี้ก่อนกดรับสิทธิ์",
          "ยอดโบนัสและเงื่อนไขอาจเปลี่ยนแปลงตามช่วงเวลา",
        ],
        showDividerBefore: true,
      },
    ],
    footerNote: DESIGN_FOOTER,
  },
  "promo-cashback": {
    id: "promo-cashback",
    bannerTitle: "คืนยอดเสีย",
    bannerSubtitle: "ตรวจสอบยอดคืนและรับโบนัสของคุณ",
    bannerArt: "coin",
    blocks: [
      {
        icon: "coin",
        title: "โปรโมชันคืนยอดเสีย",
        description: "ระบบคำนวณยอดคืนตามรอบและเปอร์เซ็นต์ที่กำหนดในโปรโมชันนี้ แล้วแสดงสถานะรับโบนัสให้คุณ",
      },
      {
        icon: "gift",
        title: "สิทธิประโยชน์ที่ร่วมรายการ",
        bullets: ["คืนยอดเสียตามรอบโปรโมชัน", "รับโบนัสเมื่อครบเงื่อนไข", "ติดตามยอดสะสมในช่วงแคมเปญ"],
        showDividerBefore: true,
      },
      {
        icon: "info",
        title: "เงื่อนไขการรับสิทธิ์",
        bullets: [
          "ตรวจสอบรอบคำนวณและสถานะตามที่ระบุด้านล่าง",
          "กดรับโบนัสภายในเวลาที่กำหนด",
          "ยอดและเปอร์เซ็นต์เป็นตัวอย่างสำหรับการออกแบบ",
        ],
        showDividerBefore: true,
      },
    ],
    footerNote: DESIGN_FOOTER,
  },
  "promo-refer-friends": {
    id: "promo-refer-friends",
    bannerTitle: "ชวนเพื่อน รับรายได้ 2 ต่อ",
    bannerSubtitle: "แชร์ลิงก์และติดตามรายได้จากเพื่อน",
    bannerArt: "referral",
    blocks: [
      {
        icon: "referral",
        title: "โปรแกรมชวนเพื่อน",
        description: "แชร์ลิงก์ส่วนตัว ติดตามเพื่อนที่เข้าร่วม และดูรายได้จากโปรโมชันนี้ตามเงื่อนไขที่กำหนด",
      },
      {
        icon: "gift",
        title: "สิทธิประโยชน์ที่ร่วมรายการ",
        bullets: ["รายได้จากยอดเดิมพันของเพื่อนที่ชวน", "โบนัสตามขั้นค่าคอมมิชชัน", "ติดตามสถิติในช่วงแคมเปญ"],
        showDividerBefore: true,
      },
      {
        icon: "info",
        title: "เงื่อนไขการรับสิทธิ์",
        bullets: [
          "เพื่อนต้องสมัครผ่านลิงก์ของคุณภายในช่วงโปรโมชัน",
          "อ่านอัตราค่าคอมและเงื่อนไขในรายละเอียดนี้",
          "ข้อมูลเป็นตัวอย่างสำหรับการออกแบบ",
        ],
        showDividerBefore: true,
      },
    ],
    footerNote: DESIGN_FOOTER,
  },
  "promo-vip": {
    id: "promo-vip",
    bannerTitle: "สิทธิพิเศษ VIP",
    bannerSubtitle: "สำรวจรางวัลประจำระดับของคุณ",
    bannerArt: "shield",
    blocks: [
      {
        icon: "shield",
        title: "สิทธิพิเศษตามระดับ",
        description: "ตรวจสอบสิทธิประโยชน์และเงื่อนไขของระดับสมาชิกก่อนรับโบนัส",
      },
      {
        icon: "gift",
        title: "สิทธิประโยชน์ที่ร่วมรายการ",
        bullets: ["โบนัสเลื่อนระดับ", "โบนัสรักษาระดับ", "สิทธิคืนยอดเสียตามระดับสมาชิก"],
        showDividerBefore: true,
      },
      {
        icon: "info",
        title: "เงื่อนไขการรับสิทธิ์",
        bullets: [
          "ระดับสมาชิกอ้างอิงจากข้อมูลบัญชีของคุณ",
          "อ่านรายละเอียดของแต่ละสิทธิประโยชน์ก่อนรับโบนัส",
          "ยอดโบนัสและเงื่อนไขจะแสดงตามระดับสมาชิกของคุณ",
        ],
        showDividerBefore: true,
      },
    ],
    footerNote: DESIGN_FOOTER,
  },
  "promo-check-in": {
    id: "promo-check-in",
    bannerTitle: "เช็คอินรายวัน",
    bannerSubtitle: "สะสมวัน รับรางวัลเครดิตฟรี",
    bannerArt: "calendar",
    blocks: [
      {
        icon: "calendar",
        title: "กิจกรรมเช็คอินสะสม",
        description: "เข้าเช็คอินทุกวันเพื่อปลดล็อกรางวัลเครดิตตามวัน และรางวัลพิเศษเมื่อครบรอบ",
      },
      {
        icon: "gift",
        title: "สิทธิประโยชน์ที่ร่วมรายการ",
        bullets: ["เครดิตฟรีรายวัน", "รางวัลสะสมครบรอบ", "ติดตามความคืบหน้าในโปรโมชันนี้"],
        showDividerBefore: true,
      },
      {
        icon: "info",
        title: "เงื่อนไขการรับสิทธิ์",
        bullets: [
          "เช็คอินได้วันละ 1 ครั้งตามเวลาระบบ",
          "อ่านเงื่อนไขการเช็คอินในรายละเอียดด้านล่าง",
          "รางวัลเป็นตัวอย่างสำหรับการออกแบบ",
        ],
        showDividerBefore: true,
      },
    ],
    footerNote: DESIGN_FOOTER,
  },
  "promo-wheel": {
    id: "promo-wheel",
    bannerTitle: "วงล้อพารวย",
    bannerSubtitle: "ลุ้นรับรางวัลมากมายทุกวัน",
    bannerArt: "wheel",
    blocks: [
      {
        icon: "wheel",
        title: "กิจกรรมหมุนวงล้อ",
        description: "ใช้สิทธิ์หมุนวงล้อตามเงื่อนไขโปรโมชัน ลุ้นเครดิตและของรางวัลทุกวัน",
      },
      {
        icon: "gift",
        title: "สิทธิประโยชน์ที่ร่วมรายการ",
        bullets: ["รางวัลเครดิตหลายระดับ", "ของรางวัลพิเศษตามช่วงเวลา", "จำนวนครั้งหมุนตามเงื่อนไข"],
        showDividerBefore: true,
      },
      {
        icon: "info",
        title: "เงื่อนไขการรับสิทธิ์",
        bullets: [
          "ตรวจสอบจำนวนครั้งหมุนที่เหลือก่อนเล่น",
          "รางวัลที่ได้รับจะแสดงทันทีหลังหมุน (mock)",
          "ข้อมูลเป็นตัวอย่างสำหรับการออกแบบ",
        ],
        showDividerBefore: true,
      },
    ],
    footerNote: DESIGN_FOOTER,
  },
};

export function getPromotionDetail(id: PromotionDetailId): PromotionDetailContent {
  return PROMOTION_DETAILS[id];
}
