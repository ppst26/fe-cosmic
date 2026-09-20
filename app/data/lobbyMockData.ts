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
  HomeLobbyTournamentItem,
  LobbyTournamentSectionItem,
  BottomNavItem,
} from "../types/lobby";
import { CASINO_FEATURED_ITEMS } from "./casinoFeaturedData";
import { SPORT_FEATURED_ITEMS } from "./sportFeaturedData";
import { FISHING_FEATURED_ITEMS } from "./fishingFeaturedData";
import { HOT_GAMES_FEATURED_ITEMS } from "./hotGamesFeaturedData";
import { GRID_SLOT_PROVIDERS } from "./slotProvidersData";

/** รูปทัวร์นาเมนต์ใน public/tournament */
export const TOURNAMENT_IMAGE_PATHS = {
  esport: "/tournament/esport.webp",
  esport2: "/tournament/esport2.webp",
  slotWin: "/tournament/slot-win.avif",
  sportWin: "/tournament/sport-win.avif",
} as const;

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
    games: HOT_GAMES_FEATURED_ITEMS,
    carouselMax: HOT_GAMES_FEATURED_ITEMS.length,
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
    secondaryHref: "/event",
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
 * กิจกรรมทัวร์นาเมนต์บน lobby — รูปจาก public/tournament
 * ถูกเรียกใช้โดย JackpotSection.tsx
 */
export const HOME_LOBBY_TOURNAMENT_ITEMS: HomeLobbyTournamentItem[] = [
  {
    id: "tournament-esport",
    title: "ทัวร์นาเมนต์อีสปอร์ต",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport,
    href: "/event",
  },
  {
    id: "tournament-sport",
    title: "ทัวร์นาเมนต์กีฬา",
    imageSrc: TOURNAMENT_IMAGE_PATHS.sportWin,
    href: "/event",
  },
  {
    id: "tournament-slot",
    title: "ทัวร์นาเมนต์สล็อต",
    imageSrc: TOURNAMENT_IMAGE_PATHS.slotWin,
    href: "/event",
  },
  {
    id: "tournament-esport-2",
    title: "ทัวร์นาเมนต์อีสปอร์ต",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport2,
    href: "/event",
  },
];

/**
 * กิจกรรม — section หลัง Hall of Fame · รูปจาก public/tournament
 * ถูกเรียกใช้โดย TournamentsSection.tsx
 */
export const LOBBY_TOURNAMENTS_SECTION_ITEMS: LobbyTournamentSectionItem[] = [
  {
    id: "tournament-endorphina",
    brandLabel: "Endorphina",
    badge: "9,999 ways to win",
    description: "€100,000 Prize Pool · 9,999 Winning Places",
    imageSrc: TOURNAMENT_IMAGE_PATHS.slotWin,
    href: "/event",
  },
  {
    id: "tournament-tennis",
    brandLabel: "Tennis",
    badge: "AUGUST 30 – SEPTEMBER 13",
    description: "Place US Open Bets, GET 5% BACK!",
    imageSrc: TOURNAMENT_IMAGE_PATHS.sportWin,
    href: "/event",
  },
  {
    id: "tournament-dota",
    brandLabel: "Dota 2",
    badge: "The International 2026",
    description: "Follow the Biggest Dota 2 Event of the Year in freebets",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport,
    href: "/event",
  },
  {
    id: "tournament-cs2",
    brandLabel: "CS2",
    badge: "CS2 Pick'em Challenge",
    description: "Follow Every Match. Make Your Picks.",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport2,
    href: "/event",
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
