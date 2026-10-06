/** ข้อมูล mock ศูนย์สุ่มของรางวัล — อ้างอิง flow /th/reward ของ Z-Gaming */

export const REWARD_POINTS_BALANCE_MOCK = 3_365;

export const REWARD_POINTS_LABEL = "พอยท์";

export function formatRewardPoints(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type RewardHubShortcutId = "lucky-box" | "random-card" | "freespins";

export interface RewardHubShortcut {
  id: RewardHubShortcutId;
  label: string;
  href: string;
  iconId: string;
  /** ปิดใช้งานชั่วคราว — แสดง Coming soon */
  comingSoon?: boolean;
}

export const REWARD_FREESPINS_COMING_SOON_LABEL = "Coming soon";

/** แถบไอคอน 3 ช่องบนหน้า reward */
export const REWARD_HUB_SHORTCUTS: RewardHubShortcut[] = [
  { id: "lucky-box", label: "แลกกล่องสุ่ม", href: "/reward/lucky-box", iconId: "lucky-box" },
  { id: "random-card", label: "แลกการ์ดสุ่ม", href: "/reward/random-card", iconId: "random-card" },
  {
    id: "freespins",
    label: "แลกรับฟรีสปิน/ชิป",
    href: "/reward/freespins",
    iconId: "freespins",
    comingSoon: true,
  },
];

export interface RewardPromoBanner {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageSrc: string;
  termsLabel: string;
}

export const REWARD_HUB_PROMO_BANNERS: RewardPromoBanner[] = [
  {
    id: "banner-lucky-box",
    title: "Lucky Box",
    subtitle: "แลกกล่องสุ่มด้วยพอยท์",
    href: "/reward/lucky-box",
    imageSrc: "/assets/3d/card-1-mobile.avif",
    termsLabel: "เงื่อนไขเพิ่มเติม",
  },
  {
    id: "banner-random-card",
    title: "Redeem Card",
    subtitle: "เปิดการ์ดลุ้นรางวัล",
    href: "/reward/random-card",
    imageSrc: "/assets/3d/card-2-mobile.avif",
    termsLabel: "เงื่อนไขเพิ่มเติม",
  },
];

/** ป้าย Coming soon — กระดานแลกรางวัล (กล่อง · การ์ด) */
export const REWARD_REDEEM_COMING_SOON_LABEL = "Coming soon";

/** ค่าสุ่มต่อครั้ง — แสดงใน UI Lucky Box (mock) */
export const LUCKY_BOX_DRAW_COST_DISPLAY = 10;

/** ภาพกล่องสมบัติ — public/assets */
export const LUCKY_BOX_HERO_IMAGE_SRC = "/assets/3d/card-1-mobile.avif";

export const RANDOM_CARD_COUNT = 5;

/** ค่าสุ่มต่อครั้ง — แสดงใน UI (mock) */
export const RANDOM_CARD_DRAW_COST_DISPLAY = 10;

export const RANDOM_CARD_COMING_SOON_LABEL = REWARD_REDEEM_COMING_SOON_LABEL;

/** การ์ดรางวัลแสดงผล — 3 บน · 2 ล่าง (อ้างอิง Redeem Card) */
export interface RandomCardDisplayItem {
  id: string;
  imageSrc: string;
  pointsValue: number;
}

export const RANDOM_CARD_DISPLAY_ITEMS: RandomCardDisplayItem[] = [
  { id: "rc-1", imageSrc: "/assets/gems/diamond.avif", pointsValue: 2000 },
  { id: "rc-2", imageSrc: "/assets/3d/diamond.avif", pointsValue: 0 },
  { id: "rc-3", imageSrc: "/assets/check-in/diamonds.avif", pointsValue: 10000 },
  { id: "rc-4", imageSrc: "/assets/coins/coins3.webp", pointsValue: 5000 },
  { id: "rc-5", imageSrc: "/assets/gems/diamond.avif", pointsValue: 1000 },
];

export interface ExchangeMoneyPackage {
  id: string;
  credits: number;
  pointsCost: number;
}

export const EXCHANGE_MONEY_PACKAGES: ExchangeMoneyPackage[] = [
  { id: "ex-50", credits: 50, pointsCost: 500 },
  { id: "ex-100", credits: 100, pointsCost: 950 },
  { id: "ex-250", credits: 250, pointsCost: 2_300 },
  { id: "ex-500", credits: 500, pointsCost: 4_500 },
];

export const EXCHANGE_MONEY_RATE_LABEL = "อัตราแลก: 10 พอยท์ = 1 เครดิต (โดยประมาณ)";

export interface FreespinOffer {
  id: string;
  gameName: string;
  providerLabel: string;
  pointsCost: number;
  spins: number;
  thumbSrc: string;
}

export const FREESPIN_OFFERS_MOCK: FreespinOffer[] = [
  {
    id: "fs-1",
    gameName: "Cosmic Rush",
    providerLabel: "PG",
    pointsCost: 600,
    spins: 10,
    thumbSrc: "/assets/3d/menuicon/slot.avif",
  },
  {
    id: "fs-2",
    gameName: "Nebula Spins",
    providerLabel: "JILI",
    pointsCost: 900,
    spins: 15,
    thumbSrc: "/assets/3d/menuicon/slot.avif",
  },
  {
    id: "fs-3",
    gameName: "Star Fortune",
    providerLabel: "PP",
    pointsCost: 1_200,
    spins: 20,
    thumbSrc: "/assets/3d/menuicon/slot.avif",
  },
];

export const REWARD_FEATURE_TERMS =
  "รางวัลและพอยท์เป็น mock สำหรับ UI — เงื่อนไขจริงขึ้นกับระบบหลังบ้านเมื่อเชื่อม API";
