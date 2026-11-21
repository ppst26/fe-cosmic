/**
 * ข้อมูลและ Mock Items สำหรับหน้ารวมกีฬา (/sport)
 * การ์ดรูปจาก public/sport — ใช้บนหน้า /sport และ carousel หน้าแรก
 */

import type { SportFilterTabItem, SportCardItem } from "@/app/types/providers";

/**
 * แถบตัวกรองสำหรับหน้ากีฬา
 */
export const SPORT_FILTER_TABS: SportFilterTabItem[] = [
  { id: "all-in-one", labelKey: "filters.allInOne", iconId: "gift" },
  { id: "all-providers", labelKey: "filters.allProviders", iconId: "gamepad" },
  { id: "football", labelKey: "filters.football", iconId: "football" },
  { id: "basketball", labelKey: "filters.basketball", iconId: "basketball" },
  { id: "esports", labelKey: "filters.esports", iconId: "esports" },
  { id: "boxing", labelKey: "filters.boxing", iconId: "boxing" },
  { id: "tennis", labelKey: "filters.tennis", iconId: "tennis" },
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
  // ค่ายกีฬาทั้งหมดเดิมชี้ไป /sport/<ค่าย> ซึ่งไม่มี route (404) จึงถูกลบ — เพิ่มกลับพร้อม route
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
