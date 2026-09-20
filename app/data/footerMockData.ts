/** ข้อมูล mock ส่วนท้ายเว็บ (CosmicFooter) */

export const FOOTER_PARTNER_NAMES: readonly string[] = [
  "EVOPLAY",
  "CQ9",
  "JILI",
  "PLAYSTAR",
  "JOKER",
  "EBET",
  "PG SOFT",
  "PRAGMATIC PLAY",
];

export interface FooterNavLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterNavLink[];
}

/** คอลัมน์ลิงก์ footer desktop — href จริงจาก route ในแอป · ที่ไม่มีใช้ /support */
export const FOOTER_DESKTOP_COLUMNS: FooterLinkColumn[] = [
  {
    title: "แพลตฟอร์ม",
    links: [
      { label: "โปรไฟล์", href: "/profile" },
      { label: "ธุรกรรม", href: "/transactions" },
      { label: "โพยหวย", href: "/lottery/slips" },
      { label: "ตั้งค่าบัญชี", href: "/profile/account" },
      { label: "เช็คอินรายวัน", href: "/missions/check-in" },
      { label: "ร้านอัญมณี", href: "/gems-store" },
      { label: "ลีดเดอร์บอร์ด", href: "/support" },
      { label: "ทายผล", href: "/support" },
    ],
  },
  {
    title: "กีฬา",
    links: [
      { label: "กีฬาสด", href: "/sport" },
      { label: "กีฬา", href: "/sport" },
      { label: "อีสปอร์ต", href: "/sport" },
      { label: "ทัวร์นาเมนต์", href: "/event" },
      { label: "ฟุตบอล", href: "/sport" },
      { label: "บาสเกตบอล", href: "/sport" },
      { label: "เทนนิส", href: "/support" },
      { label: "คริกเก็ต", href: "/support" },
    ],
  },
  {
    title: "คาสิโน",
    links: [
      { label: "ล็อบบี้", href: "/casino" },
      { label: "เกมยอดฮิต", href: "/" },
      { label: "คาสิโนสด", href: "/casino" },
      { label: "เกมใหม่", href: "/slots" },
      { label: "เกมแครช", href: "/support" },
      { label: "เกมโต๊ะ", href: "/cards" },
      { label: "สล็อต", href: "/slots" },
      { label: "ซื้อโบนัส", href: "/support" },
      { label: "รูเล็ต", href: "/casino" },
      { label: "ค่ายเกม", href: "/slots" },
    ],
  },
  {
    title: "โปรโมชัน",
    links: [
      { label: "โปรโมชันทั้งหมด", href: "/promotions" },
      { label: "โบนัสต้อนรับกีฬา", href: "/promotions" },
      { label: "โบนัสต้อนรับคาสิโน", href: "/promotions" },
      { label: "คืนยอดรายสัปดาห์", href: "/cashback" },
      { label: "คลับกีฬา", href: "/sport" },
      { label: "คลับ VIP", href: "/profile" },
      { label: "ชวนเพื่อน", href: "/referral" },
    ],
  },
  {
    title: "ข้อมูล",
    links: [
      { label: "เกี่ยวกับเรา", href: "/support" },
      { label: "กิจกรรม", href: "/event" },
      { label: "ทัวร์นาเมนต์", href: "/activities" },
      { label: "ร่วมงานกับเรา", href: "/support" },
      { label: "ติดต่อเรา", href: "/support" },
      { label: "แบรนด์", href: "/support" },
      { label: "เล่นอย่างมีสติ", href: "/support" },
    ],
  },
  {
    title: "บริการ",
    links: [
      { label: "ศูนย์ช่วยเหลือ", href: "/support" },
      { label: "คู่มือ", href: "/support" },
      { label: "วงล้อนำโชค", href: "/wheel" },
      { label: "หวย", href: "/lottery" },
      { label: "ยิงปลา", href: "/fishing" },
      { label: "คืนยอดเสีย", href: "/loss-rebate" },
    ],
  },
];

export interface FooterSocialIcon {
  label: string;
  href: string;
  icon: "telegram" | "x" | "discord" | "instagram" | "youtube" | "line";
}

export const FOOTER_DESKTOP_SOCIAL: FooterSocialIcon[] = [
  { label: "Telegram", href: "/support", icon: "telegram" },
  { label: "X", href: "/support", icon: "x" },
  { label: "Discord", href: "/support", icon: "discord" },
  { label: "Instagram", href: "/support", icon: "instagram" },
  { label: "YouTube", href: "/support", icon: "youtube" },
  { label: "LINE", href: "/support", icon: "line" },
];

export const FOOTER_TRUST_BADGES: readonly { label: string; name: string }[] = [
  { label: "ตรวจสอบโดย", name: "CERTIK" },
  { label: "ตรวจสอบโดย", name: "PESSIMISTIC" },
  { label: "อนุมัติโดย", name: "ECHELON" },
];

export const FOOTER_EXTERNAL_MOCK_LINKS: FooterNavLink[] = [
  { label: "CoinMarketCap", href: "/support" },
  { label: "CoinGecko", href: "/support" },
  { label: "DEXTools", href: "/support" },
];

export const FOOTER_DISCLAIMER =
  "cosmicbet ให้บริการความบันเทิงออนไลน์สำหรับผู้เล่นที่มีอายุครบตามกฎหมายในพื้นที่ของท่าน โปรดเล่นอย่างมีสติและรับผิดชอบต่อการตัดสินใจของตนเอง ข้อมูลบริษัทและใบอนุญาตเป็นตัวอย่างเพื่อการแสดงผล (mock) — ใช้เพื่อทดสอบ UI เท่านั้น";

export const FOOTER_GAME_LINKS: FooterNavLink[] = [
  { label: "คาสิโน", href: "/casino" },
  { label: "สล็อต", href: "/slots" },
  { label: "ยิงปลา", href: "/fishing" },
  { label: "กีฬา", href: "/sport" },
  { label: "หวย", href: "/lottery" },
];

export const FOOTER_INFO_LINKS: FooterNavLink[] = [
  { label: "โปรโมชั่น", href: "/promotions" },
  { label: "กิจกรรม", href: "/event" },
  { label: "ระดับ VIP", href: "/profile" },
  { label: "ชวนเพื่อน", href: "/referral" },
];

export const FOOTER_SOCIAL_LINKS: FooterNavLink[] = [
  { label: "LINE", href: "/support" },
  { label: "Telegram", href: "/support" },
];

export const FOOTER_PAYMENT_LABELS: readonly string[] = ["PromptPay", "TrueMoney", "ธนาคาร"];

export const FOOTER_LEGAL_LINKS: FooterNavLink[] = [
  { label: "นโยบายความเป็นส่วนตัว", href: "/support" },
  { label: "ข้อกำหนดและเงื่อนไข", href: "/support" },
  { label: "แชร์ความคิดเห็น", href: "/support" },
  { label: "แผนผังเว็บ", href: "/support" },
];

export const FOOTER_COPYRIGHT = "Copyright © cosmicbet, since 2021";

export const FOOTER_TAGLINE = "รวมเกมและกิจกรรมไว้ในที่เดียว";
