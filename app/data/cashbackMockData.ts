/** ข้อมูล mock หน้าคืนยอด (/cashback) */

import { getMenuIconSrc } from "@/app/data/menuIconAssets";

export type CashbackTabId = "play" | "loss";

export interface CashbackPanelMock {
  title: string;
  subtitle: string;
  claimableThb: number;
  statusHint: string;
  ratePercent: number;
  minThb: number;
  maxPerClaimThb: number;
  cycleLabel: string;
  canClaim: boolean;
  claimButtonLabel: string;
}

export const CASHBACK_TABS: { id: CashbackTabId; label: string }[] = [
  { id: "play", label: "คืนยอดเล่น" },
  { id: "loss", label: "คืนยอดเสีย" },
];

/** ไอคอน hero ยอดคืนที่รับได้ — public/assets/3d/menuicon/cashback.avif */
export const CASHBACK_PAGE_ICON_SRC =
  getMenuIconSrc("cashback") ?? "/assets/3d/menuicon/cashback.avif";

/** แท็บคืนยอดเล่น — สถานะว่างตาม mock */
export const CASHBACK_PLAY_PANEL_MOCK: CashbackPanelMock = {
  title: "คืนยอดเล่น",
  subtitle: "คืนจากยอดหมุนที่เล่น",
  claimableThb: 0,
  statusHint: "ยังไม่มียอดให้รับ",
  ratePercent: 0.5,
  minThb: 50,
  maxPerClaimThb: 0,
  cycleLabel: "ทุกวัน 00:00",
  canClaim: false,
  claimButtonLabel: "ยังไม่มียอดให้รับ",
};

/** แท็บคืนยอดเสีย — mock เริ่มต้นยังไม่มียอด (สลับ UI ได้เมื่อมี API) */
export const CASHBACK_LOSS_PANEL_MOCK: CashbackPanelMock = {
  title: "คืนยอดเสีย",
  subtitle: "คืนจากยอดเสียสุทธิ",
  claimableThb: 0,
  statusHint: "ยังไม่มียอดให้รับ",
  ratePercent: 8,
  minThb: 50,
  maxPerClaimThb: 0,
  cycleLabel: "ทุกวัน 00:00",
  canClaim: false,
  claimButtonLabel: "ยังไม่มียอดให้รับ",
};

