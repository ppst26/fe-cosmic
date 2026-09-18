import {
  CategoryItem,
  PromoItem,
  WelcomeBannerSlide,
  HighlightItem,
  IntroStats,
  GameSectionData,
  GameItem,
  ProviderItem,
  FeatureActionItem,
  JackpotWinner,
  BottomNavItem,
} from "../types/lobby";
import { CASINO_FEATURED_ITEMS } from "./casinoFeaturedData";
import { SPORT_FEATURED_ITEMS } from "./sportFeaturedData";
import { FISHING_FEATURED_ITEMS } from "./fishingFeaturedData";
import { GRID_SLOT_PROVIDERS } from "./slotProvidersData";

/** จำนวนการ์ดสูงสุดต่อ carousel หมวดเกมหน้าแรก (ทุกประเภทเกม) */
export const HOME_LOBBY_GAME_CAROUSEL_MAX = 8;

/** จำนวนการ์ดสูงสุด carousel ผู้ให้บริการหน้าแรก */
export const HOME_LOBBY_CAROUSEL_MAX = 15;

/** แถว SLOTS หน้าแรก — รูปค่ายจาก public/slots (สูงสุด 15 ใบต่อ carousel) */
export const HOME_SLOTS_PROVIDER_ITEMS: GameItem[] = GRID_SLOT_PROVIDERS.slice(0, 15).map(
  (provider) => ({
    id: `home-slots-${provider.id}`,
    title: provider.name,
    provider: provider.name,
    href: provider.href,
    coverSrc: provider.coverSrc,
  }),
);

/**
 * ข้อมูลจำลองหมวดหมู่เกม — แถบ CategoryNav / sidebar desktop
 */
/** แถบนำทาง header desktop (Dexsport-style pills) — Header.tsx */
export const HEADER_DESKTOP_NAV = [
  { id: "sports", label: "กีฬา", href: "/sport" },
  { id: "casino", label: "คาสิโน", href: "/casino" },
  { id: "promotions", label: "โปรโมชัน", href: "/promotions", showBadge: true },
] as const;

export const CATEGORIES_DATA: CategoryItem[] = [
  { id: "home", label: "โฮม", href: "/" },
  { id: "casino", label: "คาสิโน", href: "/casino" },
  { id: "slots", label: "สล็อต", href: "/slots" },
  { id: "fishing", label: "ยิงปลา", href: "/fishing" },
  { id: "sports", label: "กีฬา", href: "/sport" },
  { id: "lottery", label: "หวย", href: "/lottery" },
  { id: "games", label: "เกมส์", href: "#games" },
  { id: "cards", label: "เกมไพ่", href: "/cards" },
];

/**
 * แบนเนอร์โปรโมหน้าแรก — public/HomeProBanner (เรียงตาม PROMO_CAROUSEL_DATA 4 ใบแรก)
 */
export const HOME_PRO_BANNER_ASSETS = [
  "/HomeProBanner/HomeProBanner1.webp",
  "/HomeProBanner/HomeProBanner2.webp",
  "/HomeProBanner/HomeProBanner3.webp",
  "/HomeProBanner/HomeProBanner4.webp",
] as const;

/** แบนเนอร์ Welcome Pack หน้าแรก */
export const MAIN_HOME_BANNER_SRC = "/HomeProBanner/MainHomeBannner.webp";

/**
 * สไลด์ Welcome Hero — WelcomeBanner carousel
 * ถูกเรียกใช้ใน WelcomeBanner.tsx และ app/page.tsx
 */
export const WELCOME_BANNER_SLIDES: WelcomeBannerSlide[] = [
  {
    id: "welcome-pack",
    bannerSrc: MAIN_HOME_BANNER_SRC,
    title: "Welcome Pack",
    subtitle: "Rakeback Up to 100%",
    ctaText: "Sign Up",
  },
  {
    id: "welcome-loyalty",
    bannerSrc: HOME_PRO_BANNER_ASSETS[0],
    title: "Loyalty v2.0",
    subtitle: "Easy start & more rewards",
    ctaText: "Sign Up",
  },
  {
    id: "welcome-gift-cards",
    bannerSrc: HOME_PRO_BANNER_ASSETS[1],
    title: "Play with Gift Cards",
    subtitle: "Buy & redeem instantly",
    ctaText: "Sign Up",
  },
  {
    id: "welcome-vip",
    bannerSrc: HOME_PRO_BANNER_ASSETS[2],
    title: "VIP Cashback",
    subtitle: "Up to 25% weekly rebate",
    ctaText: "Sign Up",
  },
  {
    id: "welcome-race",
    bannerSrc: HOME_PRO_BANNER_ASSETS[3],
    title: "Weekly Race",
    subtitle: "Prize pool 100,000 USDT",
    ctaText: "Sign Up",
  },
];

/**
 * ข้อมูลจำลองสำหรับ Promotional Carousel แบนเนอร์โปรโมชัน
 * ถูกเรียกใช้โดย PromoCarousel.tsx
 */
export const PROMO_CAROUSEL_DATA: PromoItem[] = [
  {
    id: "promo-loyalty-v2",
    title: "Loyalty v2.0",
    subtitle: "Easy start & more rewards",
    href: "/promotions/loyalty-v2",
    bannerSrc: HOME_PRO_BANNER_ASSETS[0],
  },
  {
    id: "promo-gift-cards",
    title: "Play with ...",
    subtitle: "Buy Gift Cards",
    href: "/promotions/gift-cards",
    bannerSrc: HOME_PRO_BANNER_ASSETS[1],
  },
  {
    id: "promo-vip-cashback",
    title: "VIP Cashback",
    subtitle: "Up to 25% weekly rebate",
    href: "/promotions/cashback",
    bannerSrc: HOME_PRO_BANNER_ASSETS[2],
  },
  {
    id: "promo-weekly-race",
    title: "Weekly Race",
    subtitle: "Prize pool 100,000 USDT",
    href: "/promotions/weekly-race",
    bannerSrc: HOME_PRO_BANNER_ASSETS[3],
  },
  {
    id: "promo-daily-drops",
    title: "Daily Drops",
    subtitle: "Win instant random cash prizes",
    href: "/promotions/daily-drops",
  },
];

/**
 * ตัวเลขตัวอย่างสำหรับ Cosmic Intro — ไม่ใช่สถิติยืนยัน ต้องแทนด้วยข้อมูลจริงจาก API
 * ถูกเรียกใช้โดย CosmicIntro.tsx
 */
export const INTRO_STATS_DATA: IntroStats = {
  gamesCount: 15000,
  providersCount: 120,
};

/**
 * ข้อมูลจำลองสำหรับส่วน "ยอดนิยม" (Popular Highlights)
 * ประกอบด้วย Swipe Bet และ DEXY RACE
 * ถูกเรียกใช้โดย PopularHighlights.tsx
 */
export const POPULAR_HIGHLIGHTS_DATA: HighlightItem[] = [
  {
    id: "highlight-swipe-bet",
    title: "Swipe Bet",
    type: "swipe_bet",
    href: "/games/swipe-bet",
    imageSrc: "/HomeProBanner/left.webp",
  },
  {
    id: "highlight-dexy-race",
    title: "DEXY RACE",
    type: "event_banner",
    href: "/events/dexy-race",
    imageSrc: "/HomeProBanner/right.webp",
  },
];

/**
 * ข้อมูลจำลองสำหรับหมวดเกม 5 แถว (เกมยอดฮิต / SLOTS / คาสิโน / ยิงปลา / กีฬา)
 * รายชื่อเกมและค่ายถอดจากภาพตัวอย่างเพื่อจัดวางเท่านั้น — หมวดจริงต้องอ้าง taxonomy ของระบบ
 * ถูกเรียกใช้โดย GameSection.tsx ผ่าน app/page.tsx
 */
export const GAME_SECTIONS_DATA: GameSectionData[] = [
  {
    id: "section-hot",
    title: "เกมยอดฮิต",
    icon: "flame",
    viewAllHref: "/games?filter=hot",
    games: [
      {
        id: "game-tres-pinatas",
        title: "Tres Pinatas Hold & Win",
        provider: "Hacksaw Gaming",
        href: "/games/tres-pinatas",
        coverTone: "rose",
      },
      {
        id: "game-hamster-dam",
        title: "Hamster-Dam",
        provider: "Wicked Games",
        href: "/games/hamster-dam",
        coverTone: "emerald",
        badge: "EXCLUSIVE",
      },
      {
        id: "game-moon-rush",
        title: "Moon Rush",
        provider: "Pragmatic Play",
        href: "/games/moon-rush",
        coverTone: "sky",
      },
    ],
  },
  {
    id: "section-slots",
    title: "SLOTS",
    icon: "cherries",
    viewAllHref: "/slots",
    games: HOME_SLOTS_PROVIDER_ITEMS,
  },
  {
    id: "section-casino",
    title: "คาสิโน",
    icon: "cards",
    viewAllHref: "/casino",
    games: CASINO_FEATURED_ITEMS,
  },
  {
    id: "section-fishing",
    title: "ยิงปลา",
    icon: "fish",
    viewAllHref: "/fishing",
    games: FISHING_FEATURED_ITEMS,
  },
  {
    id: "section-sports",
    title: "กีฬา",
    icon: "football",
    viewAllHref: "/sport",
    games: SPORT_FEATURED_ITEMS,
  },
];

/**
 * ข้อมูลจำลองสำหรับส่วน Providers — เฉพาะค่ายที่เห็นในภาพตัวอย่าง ไม่เติมรายการซ้ำ
 * ถูกเรียกใช้โดย ProvidersSection.tsx
 */
export const PROVIDERS_DATA: ProviderItem[] = [
  { id: "provider-pragmatic-play", name: "Pragmatic Play", href: "/providers/pragmatic-play" },
  { id: "provider-hacksaw-gaming", name: "Hacksaw Gaming", href: "/providers/hacksaw-gaming" },
  { id: "provider-nolimit-city", name: "Nolimit City", href: "/providers/nolimit-city" },
];

/**
 * การ์ดฟีเจอร์ — ร้านค้าเพชร / ภารกิจ / วงล้อ
 * ถูกเรียกใช้โดย FeatureActionCards.tsx
 */
export const FEATURE_ACTIONS_DATA: FeatureActionItem[] = [
  {
    id: "feature-diamond-shop",
    title: "ร้านค้าเพชร",
    description: "แลก Gems เป็นของรางวัล โบนัส และสิทธิพิเศษสำหรับสมาชิก",
    href: "/gems-store",
    icon: "diamond-shop",
    ctaPrimaryLabel: "เข้าร้านค้า",
    ctaSecondaryLabel: "ดูรายการแลก",
  },
  {
    id: "feature-missions",
    title: "ภารกิจ",
    description: "เช็คอินรายวันและทำภารกิจสะสมเพื่อปลดล็อกรางวัล",
    href: "/missions/check-in",
    icon: "missions",
    ctaPrimaryLabel: "เช็คอินเลย",
    ctaSecondaryLabel: "กติกากิจกรรม",
    secondaryHref: "/activities",
  },
  {
    id: "feature-prize-wheel",
    title: "วงล้อ",
    description: "หมุนลุ้นเครดิตและของรางวัล — ใช้สิทธิ์ตามเงื่อนไขแต่ละรอบ",
    href: "/wheel",
    icon: "prize-wheel",
    ctaPrimaryLabel: "หมุนเลย",
    ctaSecondaryLabel: "วิธีเล่น",
  },
];

/**
 * ผู้ชนะ Jackpot — mock ตามตัวอย่าง design.md (ไม่มีเครื่องหมาย +)
 * ถูกเรียกใช้โดย JackpotSection.tsx
 */
export const JACKPOT_WINNERS_DATA: JackpotWinner[] = [
  {
    id: "jackpot-casino-1",
    maskedUsername: "Bll****ia",
    amount: 600_000,
    currency: "SGD",
    categoryLabel: "คาสิโน",
    gameName: "Cash or Clash",
    providerName: "Pragmatic Play",
    category: "casino",
  },
  {
    id: "jackpot-sports-1",
    maskedUsername: "Bll****ia",
    amount: 59_704.9,
    currency: "SGD",
    categoryLabel: "กีฬา",
    gameName: "Football",
    providerName: "FB Sports",
    category: "sports",
  },
  {
    id: "jackpot-slots-1",
    maskedUsername: "Bll****ia",
    amount: 450_000,
    currency: "SGD",
    categoryLabel: "สล็อต",
    gameName: "Sweet Bonanza",
    providerName: "Pragmatic Play",
    category: "slots",
  },
];

export { HALL_OF_FAME_DATA } from "./hallOfFameMockData";

/**
 * เมนูล่าง — ถอน / ฝาก / เมนู (กลาง) / คืนยอด / ติดต่อ
 * ถูกเรียกใช้โดย FloatingBottomNav.tsx
 */
export const BOTTOM_NAV_DATA: BottomNavItem[] = [
  { id: "nav-withdraw", label: "ถอนเงิน", href: "/withdraw", icon: "withdraw" },
  { id: "nav-deposit", label: "ฝากเงิน", href: "/deposit", icon: "deposit" },
  { id: "nav-menu", label: "เมนู", href: "#menu", icon: "menu" },
  { id: "nav-cashback", label: "คืนยอด", href: "/cashback", icon: "cashback" },
  { id: "nav-contact", label: "ติดต่อ", href: "/support", icon: "contact" },
];
