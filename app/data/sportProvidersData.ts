/**
 * ข้อมูลและ Mock Items สำหรับหน้ารวมกีฬา (/sport)
 * การ์ดรูปจาก public/sport — ใช้บนหน้า /sport และ carousel หน้าแรก
 */

export interface SportFilterTabItem {
  id: string;
  label: string;
  iconId: "gift" | "gamepad" | "football" | "basketball" | "esports" | "boxing" | "tennis";
}

export interface SportCardItem {
  id: string;
  title: string;
  provider: string;
  badges: ("EXCLUSIVE" | "LIVE" | "HOT" | "POPULAR")[];
  /** รูปปกจาก public/sport — แสดงเต็มการ์ดแทน SVG mock */
  coverSrc?: string;
  bgGradient?: string;
  artType?: string;
  tags: string[];
  href: string;
}

/**
 * แถบตัวกรองสำหรับหน้ากีฬา
 */
export const SPORT_FILTER_TABS: SportFilterTabItem[] = [
  { id: "all-in-one", label: "ศูนย์รวม", iconId: "gift" },
  { id: "all-providers", label: "ค่ายทั้งหมด", iconId: "gamepad" },
  { id: "football", label: "ฟุตบอล", iconId: "football" },
  { id: "basketball", label: "บาสเกตบอล", iconId: "basketball" },
  { id: "esports", label: "อีสปอร์ต", iconId: "esports" },
  { id: "boxing", label: "มวยไทย", iconId: "boxing" },
  { id: "tennis", label: "เทนนิส", iconId: "tennis" },
];

const SPORT_DEFAULT_TAGS = ["all-in-one", "all-providers", "football"] as const;

/** ชื่อค่ายตามไฟล์ใน public/sport */
const SPORT_COVER_META: {
  file: string;
  title: string;
  provider: string;
  href: string;
  badges?: SportCardItem["badges"];
  tags?: string[];
}[] = [
  {
    file: "sbobet.avif",
    title: "SBOBET",
    provider: "SBOBET",
    href: "/sport/sbobet",
    badges: ["EXCLUSIVE", "LIVE"],
  },
  {
    file: "saba.avif",
    title: "SABA Sports",
    provider: "SABA Sports",
    href: "/sport/saba",
    badges: ["EXCLUSIVE", "LIVE"],
    tags: ["all-in-one", "all-providers", "basketball"],
  },
  {
    file: "afb88.avif",
    title: "AFB88",
    provider: "AFB88",
    href: "/sport/afb88",
    badges: ["HOT", "LIVE"],
  },
  {
    file: "ufabet.avif",
    title: "UFABET",
    provider: "UFABET",
    href: "/sport/ufabet",
    badges: ["EXCLUSIVE", "LIVE"],
    tags: ["all-in-one", "all-providers", "boxing"],
  },
  {
    file: "amb.avif",
    title: "AMB Sport",
    provider: "AMB",
    href: "/sport/amb",
    badges: ["LIVE"],
  },
  {
    file: "fb.avif",
    title: "FB Sports",
    provider: "FB Sports",
    href: "/sport/fb",
    badges: ["HOT", "LIVE"],
    tags: ["all-in-one", "all-providers", "esports"],
  },
  {
    file: "laliga.avif",
    title: "La Liga",
    provider: "La Liga",
    href: "/sport/laliga",
    badges: ["HOT", "LIVE"],
  },
  {
    file: "lim.avif",
    title: "LIM Sport",
    provider: "LIM",
    href: "/sport/lim",
    badges: ["LIVE"],
    tags: ["all-in-one", "all-providers", "tennis"],
  },
];

function buildSportCoverItem(meta: (typeof SPORT_COVER_META)[number]): SportCardItem {
  return {
    id: `sport-${meta.file.replace(/\.avif$/i, "")}`,
    title: meta.title,
    provider: meta.provider,
    badges: meta.badges ?? ["LIVE"],
    coverSrc: `/sport/${meta.file}`,
    tags: meta.tags ?? [...SPORT_DEFAULT_TAGS],
    href: meta.href,
  };
}

/** การ์ดรูปค่ายจาก public/sport */
export const SPORT_PROVIDER_COVERS: SportCardItem[] = SPORT_COVER_META.map(buildSportCoverItem);

/** รายการกริดหน้า /sport */
export const SPORT_ITEMS: SportCardItem[] = SPORT_PROVIDER_COVERS;
