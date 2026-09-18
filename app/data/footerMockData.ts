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

export const FOOTER_GAME_LINKS: FooterNavLink[] = [
  { label: "คาสิโน", href: "/casino" },
  { label: "สล็อต", href: "/slots" },
  { label: "ยิงปลา", href: "/fishing" },
  { label: "กีฬา", href: "/sport" },
  { label: "หวย", href: "/lottery" },
];

export const FOOTER_INFO_LINKS: FooterNavLink[] = [
  { label: "โปรโมชั่น", href: "/promotions" },
  { label: "กิจกรรม", href: "/activities" },
  { label: "ระดับ VIP", href: "/profile" },
  { label: "ชวนเพื่อน", href: "/referral" },
];

export const FOOTER_SOCIAL_LINKS: FooterNavLink[] = [
  { label: "LINE", href: "/support" },
  { label: "Telegram", href: "/support" },
];

export const FOOTER_PAYMENT_LABELS: readonly string[] = ["PromptPay", "TrueMoney", "ธนาคาร"];

export const FOOTER_LEGAL_LINKS: FooterNavLink[] = [
  { label: "ข้อกำหนดการใช้งาน", href: "/support" },
  { label: "นโยบายความเป็นส่วนตัว", href: "/support" },
];

export const FOOTER_COPYRIGHT = "© 2026 cosmicbet. All rights reserved.";

export const FOOTER_TAGLINE = "รวมเกมและกิจกรรมไว้ในที่เดียว";
