import { slotProviderCoverSrc } from "./slotProviderCoverData";

/**
 * ข้อมูล mock หน้าค่ายสล็อต (/slots) — กริดรูปจาก public/slots
 */
export interface SlotFilterTabItem {
  id: string;
  label: string;
  iconId: "gift" | "gamepad" | "water-drop" | "chicken" | "flame" | "trophy" | "sparkle";
}

export interface FeaturedSlotProviderItem {
  id: string;
  name: string;
  slogan: string;
  badge?: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  href: string;
  artType: "jili-skeleton" | "pragmatic-zeus";
  /** รูปจาก public/slots */
  coverSrc?: string;
  tags?: string[];
}

export interface GridSlotProviderItem {
  id: string;
  name: string;
  category: string;
  bgGradient: string;
  borderColor: string;
  href: string;
  artType:
    | "ygr-caishen"
    | "king-midas"
    | "spade-girl"
    | "joker-cards"
    | "fachai-lion"
    | "royal-adventurer"
    | "relax-tropical"
    | "ka-fantasy"
    | "generic";
  /** รูปจาก public/slots */
  coverSrc?: string;
  badge?: string;
  tags?: string[];
}

/**
 * แท็บตัวกรองสำหรับหน้าสล็อต: ศูนย์รวม, ค่ายเกมทั้งหมด, Drops & Wins, ไก่, ซื้อฟรีสปิน, แจ็คพอต, เมกะเวย์
 */
export const SLOT_FILTER_TABS: SlotFilterTabItem[] = [
  {
    id: "all-in-one",
    label: "ศูนย์รวม",
    iconId: "gift",
  },
  {
    id: "all-providers",
    label: "ค่ายเกมทั้งหมด",
    iconId: "gamepad",
  },
  {
    id: "drops-and-wins",
    label: "Drops & Wins",
    iconId: "water-drop",
  },
  {
    id: "chicken",
    label: "ไก่",
    iconId: "chicken",
  },
  {
    id: "buy-feature",
    label: "ซื้อฟรีสปิน",
    iconId: "flame",
  },
  {
    id: "jackpot",
    label: "แจ็คพอต",
    iconId: "trophy",
  },
  {
    id: "megaways",
    label: "เมกะเวย์",
    iconId: "sparkle",
  },
];

/**
 * 2 แบนเนอร์ใหญ่พิเศษด้านบน (JILI & PRAGMATIC PLAY)
 */
export const FEATURED_SLOT_PROVIDERS: FeaturedSlotProviderItem[] = [
  {
    id: "jili",
    name: "JILI",
    slogan: "PLAY FOR A BRIGHTER TOMORROW",
    badge: "HOT",
    bgGradient: "from-[#220d36] via-[#381048] to-[#180924]",
    borderColor: "border-[#9333ea]/40",
    glowColor: "shadow-[0_4px_24px_rgba(147,51,234,0.25)]",
    href: "/slots/jili",
    artType: "jili-skeleton",
    coverSrc: slotProviderCoverSrc("JILI.webp"),
  },
  {
    id: "pragmatic",
    name: "PRAGMATIC PLAY",
    slogan: "PLAY BEYOND LIMITS",
    bgGradient: "from-[#081838] via-[#0d2b5c] to-[#06142e]",
    borderColor: "border-[#2563eb]/40",
    glowColor: "shadow-[0_4px_24px_rgba(37,99,235,0.25)]",
    href: "/slots/pragmatic",
    artType: "pragmatic-zeus",
    coverSrc: slotProviderCoverSrc("pragmaticplay.webp"),
  },
];

export { GRID_SLOT_PROVIDERS } from "./slotProviderCoverData";


