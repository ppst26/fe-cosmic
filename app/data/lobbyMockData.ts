import {
  CategoryItem,
  PromoItem,
  HighlightItem,
  IntroStats,
  GameSectionData,
  ProviderItem,
  FeatureActionItem,
  JackpotWinner,
  HallOfFameTabId,
  HallOfFameRow,
  BottomNavItem,
} from "../types/lobby";

/**
 * ข้อมูลจำลองสำหรับหมวดหมู่เกม 6 หมวดหลัก (Categories)
 * ถูกเรียกใช้โดย CategoryNav.tsx เพื่อแสดงผลตามลำดับในภาพตัวอย่าง
 */
export const CATEGORIES_DATA: CategoryItem[] = [
  { id: "lobby", label: "LOBBY", href: "/" },
  { id: "originals", label: "ORIGINALS", href: "/category/originals" },
  { id: "slots", label: "SLOTS", href: "/category/slots" },
  { id: "live-casino", label: "LIVE CASINO", href: "/category/live-casino" },
  { id: "game-shows", label: "GAME SHOWS", href: "/category/game-shows" },
  { id: "table-games", label: "TABLE GAMES", href: "/category/table-games" },
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
  },
  {
    id: "promo-gift-cards",
    title: "Play with ...",
    subtitle: "Buy Gift Cards",
    href: "/promotions/gift-cards",
  },
  {
    id: "promo-vip-cashback",
    title: "VIP Cashback",
    subtitle: "Up to 25% weekly rebate",
    href: "/promotions/cashback",
  },
  {
    id: "promo-weekly-race",
    title: "Weekly Race",
    subtitle: "Prize pool 100,000 USDT",
    href: "/promotions/weekly-race",
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
  },
  {
    id: "highlight-dexy-race",
    title: "DEXY RACE",
    type: "event_banner",
    href: "/events/dexy-race",
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
    viewAllHref: "/category/slots",
    games: [
      {
        id: "game-gates-of-olympus",
        title: "Gates of Olympus Super Scatter",
        provider: "Pragmatic Play",
        href: "/games/gates-of-olympus-super-scatter",
        coverTone: "indigo",
      },
      {
        id: "game-wanted-dead-or-a-wild",
        title: "Wanted Dead or a Wild",
        provider: "Hacksaw Gaming",
        href: "/games/wanted-dead-or-a-wild",
        coverTone: "amber",
      },
      {
        id: "game-sweet-bonanza-1000",
        title: "Sweet Bonanza 1000",
        provider: "Pragmatic Play",
        href: "/games/sweet-bonanza-1000",
        coverTone: "rose",
      },
    ],
  },
  {
    id: "section-casino",
    title: "คาสิโน",
    icon: "cards",
    viewAllHref: "/category/live-casino",
    games: [
      {
        id: "game-live-pragmatic",
        title: "Pragmatic Play Live Casino",
        provider: "Pragmatic Play",
        href: "/casino/pragmatic-play",
        coverTone: "violet",
      },
      {
        id: "game-live-pretty",
        title: "Pretty Gaming",
        provider: "Pretty Gaming",
        href: "/casino/pretty-gaming",
        coverTone: "amber",
      },
      {
        id: "game-live-sa",
        title: "SA Gaming",
        provider: "SA Gaming",
        href: "/casino/sa-gaming",
        coverTone: "indigo",
      },
    ],
  },
  {
    id: "section-fishing",
    title: "ยิงปลา",
    icon: "fish",
    viewAllHref: "/category/fishing",
    games: [
      {
        id: "game-sweet-bonanza-2500",
        title: "Sweet Bonanza 2500",
        provider: "Pragmatic Play",
        href: "/games/sweet-bonanza-2500",
        coverTone: "rose",
      },
      {
        id: "game-le-fisherman",
        title: "Le Fisherman",
        provider: "Hacksaw Gaming",
        href: "/games/le-fisherman",
        coverTone: "emerald",
      },
      {
        id: "game-duck-hunters",
        title: "Duck Hunters",
        provider: "Nolimit City",
        href: "/games/duck-hunters",
        coverTone: "sky",
      },
    ],
  },
  {
    id: "section-sports",
    title: "กีฬา",
    icon: "football",
    viewAllHref: "/category/sports",
    games: [
      {
        id: "game-askmebet",
        title: "askmebet",
        provider: "askmebet",
        href: "/sports/askmebet",
        coverTone: "emerald",
      },
      {
        id: "game-afb88",
        title: "AFB88",
        provider: "AFB88",
        href: "/sports/afb88",
        coverTone: "indigo",
      },
      {
        id: "game-fb-sports",
        title: "FB Sports",
        provider: "FB Sports",
        href: "/sports/fb-sports",
        coverTone: "violet",
      },
    ],
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
  { id: "feature-diamond-shop", title: "ร้านค้าเพชร", href: "/shop/diamonds", icon: "diamond-shop" },
  { id: "feature-missions", title: "ภารกิจ", href: "/missions", icon: "missions" },
  { id: "feature-prize-wheel", title: "วงล้อ", href: "/wheel", icon: "prize-wheel" },
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

const LIVE_BETS_ROWS: HallOfFameRow[] = [
  { id: "hof-live-1", gameName: "Sweet Bonanza", payout: 17.25, gameIcon: "cherries" },
  { id: "hof-live-2", gameName: "Gates of Olympus", payout: 67.05, gameIcon: "cherries" },
  { id: "hof-live-3", gameName: "Wanted Dead or a Wild", payout: 0.46, gameIcon: "flame" },
  { id: "hof-live-4", gameName: "Sugar Rush Xmas", payout: 51.67, gameIcon: "cherries" },
];

const HIGH_ROLLERS_ROWS: HallOfFameRow[] = [
  { id: "hof-hr-1", gameName: "Moon Rush", payout: 1240.0, gameIcon: "cherries" },
  { id: "hof-hr-2", gameName: "Pragmatic Play Live", payout: 890.5, gameIcon: "cards" },
  { id: "hof-hr-3", gameName: "AFB88 Sports", payout: 2100.75, gameIcon: "football" },
];

const LUCKY_WINS_ROWS: HallOfFameRow[] = [
  { id: "hof-lw-1", gameName: "Hamster-Dam", payout: 320.12, gameIcon: "flame" },
  { id: "hof-lw-2", gameName: "Duck Hunters", payout: 88.0, gameIcon: "fish" },
  { id: "hof-lw-3", gameName: "Le Fisherman", payout: 156.4, gameIcon: "fish" },
];

/**
 * Hall of Fame แยก dataset ตาม tab
 * ถูกเรียกใช้โดย HallOfFame.tsx
 */
export const HALL_OF_FAME_DATA: Record<HallOfFameTabId, HallOfFameRow[]> = {
  "live-bets": LIVE_BETS_ROWS,
  "high-rollers": HIGH_ROLLERS_ROWS,
  "lucky-wins": LUCKY_WINS_ROWS,
};

/**
 * เมนูล่าง — โปรไฟล์ / ฝาก / ถอน / โบนัส / ติดต่อ
 * ถูกเรียกใช้โดย FloatingBottomNav.tsx
 */
export const BOTTOM_NAV_DATA: BottomNavItem[] = [
  { id: "nav-profile", label: "โปรไฟล์", href: "/profile", icon: "profile" },
  { id: "nav-deposit", label: "ฝากเงิน", href: "/deposit", icon: "deposit" },
  { id: "nav-withdraw", label: "ถอนเงิน", href: "/withdraw", icon: "withdraw" },
  { id: "nav-bonus", label: "โบนัส", href: "/bonus", icon: "bonus" },
  { id: "nav-contact", label: "ติดต่อ", href: "/support", icon: "contact" },
];
