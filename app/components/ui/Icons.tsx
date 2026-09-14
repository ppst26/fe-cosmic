import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** path โลโก้แบรนด์ใน public — ใช้ทั้ง Header และที่อื่นที่อ้าง CosmicbetLogo */
export const BRAND_LOGO_SRC = "/cm-logo.png";

/**
 * โลโก้แบรนด์ Cosmicbet จาก asset โปร่งใส (public/cm-logo.png)
 * รักษาสัดส่วน ไม่ยืด — ใช้ใน Header
 */
export function CosmicbetLogo({ className }: { className?: string }) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt="Cosmicbet"
      width={180}
      height={52}
      priority
      className={cn("h-[22px] w-auto max-w-[100px] object-contain sm:h-6 sm:max-w-[118px]", className)}
    />
  );
}

/**
 * ไอคอนหุ่นยนต์ / บอทบริการลูกค้า (Customer Support Bot)
 * ตรงมุมขวาบนของ Header
 */
export function SupportBotIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="17" fill="#292066" stroke="#4938a6" strokeWidth="1.5" />
      {/* เสาสัญญาณ */}
      <rect x="17" y="6" width="2" height="3" rx="1" fill="#c4b5fd" />
      <circle cx="18" cy="5" r="1.5" fill="#a78bfa" />
      {/* ใบหน้าบอท */}
      <rect x="9" y="11" width="18" height="15" rx="5" fill="#16123a" stroke="#6d58d9" strokeWidth="1.5" />
      {/* หูบอท */}
      <rect x="6.5" y="15" width="2.5" height="7" rx="1.25" fill="#818cf8" />
      <rect x="27" y="15" width="2.5" height="7" rx="1.25" fill="#818cf8" />
      {/* ตาบอท */}
      <rect x="12" y="16" width="4" height="4" rx="1.5" fill="#60a5fa" />
      <rect x="20" y="16" width="4" height="4" rx="1.5" fill="#60a5fa" />
      {/* ปากบอท */}
      <rect x="14" y="22" width="8" height="1.5" rx="0.75" fill="#c4b5fd" />
    </svg>
  );
}

/**
 * ไอคอน Lobby: ตารางสี่เหลี่ยม 4 ช่อง
 */
export function LobbyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

/**
 * ไอคอน Originals: ดวงดาวประกาย 4 แฉก
 */
export function OriginalsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C12 2 13.5 8 18 10C13.5 12 12 18 12 18C12 18 10.5 12 6 10C10.5 8 12 2 12 2Z" />
      <path d="M18 15C18 15 18.8 18 21 19C18.8 20 18 23 18 23C18 23 17.2 20 15 19C17.2 18 18 15 18 15Z" />
    </svg>
  );
}

/**
 * ไอคอน Slots: เชอร์รี่คู่พร้อมก้าน
 */
export function SlotsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17a4 4 0 1 0 4-4H7a4 4 0 0 0 0 4Z" fill="currentColor" />
      <path d="M17 17a4 4 0 1 0 4-4h-4a4 4 0 0 0 0 4Z" fill="currentColor" />
      <path d="M9 13C9 7 13 4 19 3" stroke="currentColor" strokeWidth="2" />
      <path d="M15 8C11 8 7 10 7 13" stroke="currentColor" strokeWidth="2" />
      <path d="M14 3c2 2 2 5 2 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * ไอคอน Live Casino: ไพ่ / ชิปคาสิโน
 */
export function LiveCasinoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
      <path d="M8 8l-2 2 2 2" stroke="currentColor" />
      <path d="M16 8l2 2-2 2" stroke="currentColor" />
    </svg>
  );
}

/**
 * ไอคอน Game Shows: วงล้อเสี่ยงโชค (Wheel of Fortune)
 */
export function GameShowsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <line x1="12" y1="3" x2="12" y2="9.5" />
      <line x1="12" y1="14.5" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9.5" y2="12" />
      <line x1="14.5" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="10.2" y2="10.2" />
      <line x1="13.8" y1="13.8" x2="18.4" y2="18.4" />
      <line x1="5.6" y1="18.4" x2="10.2" y2="13.8" />
      <line x1="13.8" y1="10.2" x2="18.4" y2="5.6" />
    </svg>
  );
}

/**
 * ไอคอน Table Games: ลูกเต๋าและไพ่
 */
export function TableGamesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="7" y="7" width="13" height="13" rx="2.5" stroke="currentColor" />
      <path d="M7 10L4 7V4h3l3 3" stroke="currentColor" />
      <path d="M14 7V4h3l3 3v3l-3-3" stroke="currentColor" />
      <circle cx="11" cy="11" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
      <circle cx="13.5" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * ไอคอนแว่นขยายสำหรับช่องค้นหา
 */
export function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

/**
 * ไอคอนลูกศรชี้ขวา Chevron Right
 */
export function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/**
 * ไอคอนดาวคู่ประกายสีทองสำหรับหัวข้อ "ยอดนิยม"
 */
export function GoldSparkleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe66d" />
          <stop offset="100%" stopColor="#d99a08" />
        </linearGradient>
      </defs>
      <path
        d="M10 2C10 2 11.5 7 15 8.5C11.5 10 10 15 10 15C10 15 8.5 10 5 8.5C8.5 7 10 2 10 2Z"
        fill="url(#gold-grad)"
      />
      <path
        d="M16 13C16 13 17 16 19 17C17 18 16 21 16 21C16 21 15 18 13 17C15 16 16 13 16 13Z"
        fill="url(#gold-grad)"
      />
    </svg>
  );
}

/**
 * ไอคอนตราสัญลักษณ์สีแดงสำหรับการ์ด Swipe Bet
 */
export function SwipeBetEmblem({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-[var(--radius-control)] bg-gradient-to-br from-red-600 via-rose-700 to-red-950 p-2 shadow-md ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="5" y="3" width="14" height="18" rx="2" fill="none" />
        <path d="M10 8h4M9 12h6M11 16h2" />
      </svg>
    </div>
  );
}

/**
 * ไอคอนลูกศรชี้ซ้าย Chevron Left — ใช้กับปุ่ม Previous ของ CarouselControls
 */
export function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/**
 * ไอคอนเปลวไฟ — หัวข้อ "เกมยอดฮิต"
 */
export function FlameIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c.6 3.2 2.4 4.9 4.3 6.8C18.2 10.7 19 12.5 19 14.5A7 7 0 0 1 5 14.5c0-1.6.5-3 1.4-4.2.4 1 1.1 1.7 2.1 2.1C8.2 8.2 9.8 4.6 12 2Zm0 9c-1.4 1.6-2.2 3-2.2 4.3a2.2 2.2 0 1 0 4.4 0c0-1.3-.8-2.7-2.2-4.3Z" />
    </svg>
  );
}

/**
 * ไอคอนไพ่ซ้อนคู่ — หัวข้อ "คาสิโน"
 */
export function CardsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="6" width="11" height="15" rx="2" transform="rotate(-12 8.5 13.5)" />
      <rect x="10" y="4" width="11" height="15" rx="2" transform="rotate(12 15.5 11.5)" />
      <path d="M15.5 8.5c-.8-.8-2 0-1.4 1l1.4 1.5 1.4-1.5c.6-1-.6-1.8-1.4-1Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * ไอคอนปลา — หัวข้อ "ยิงปลา"
 */
export function FishIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 12c2.5-4 6-6 10-6 3.5 0 6.5 2.3 8 6-1.5 3.7-4.5 6-8 6-4 0-7.5-2-10-6Z" />
      <path d="M3 12l-1.5-4M3 12l-1.5 4" />
      <path d="M13 6l3 6-3 6" />
      <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * ไอคอนลูกฟุตบอล — หัวข้อ "กีฬา"
 */
export function FootballIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l3.8 2.8-1.5 4.4h-4.6L8.2 10.3 12 7.5Z" fill="currentColor" stroke="none" />
      <path d="M12 7.5V3.3M15.8 10.3l4-1.3M14.3 14.7l2.6 3.4M9.7 14.7l-2.6 3.4M8.2 10.3l-4-1.3" />
    </svg>
  );
}

/**
 * ไอคอนเครือข่าย (node เชื่อมกัน) — หัวข้อ "Providers"
 */
export function NetworkIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="5.5" cy="17" r="2.5" />
      <circle cx="18.5" cy="17" r="2.5" />
      <path d="M10.8 8.2 7 14.8M13.2 8.2l3.8 6.6M8 17h8" />
    </svg>
  );
}

/**
 * ดาวสี่แฉกสีทองขนาดใหญ่ — ของตกแต่งด้านซ้ายของ Cosmic Intro
 * decorative: aria-hidden และไม่รับ pointer events จาก parent
 */
export function GoldStarIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gold-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe66d" />
          <stop offset="100%" stopColor="#d99a08" />
        </linearGradient>
      </defs>
      <path d="M32 4C33.5 20 44 30.5 60 32C44 33.5 33.5 44 32 60C30.5 44 20 33.5 4 32C20 30.5 30.5 20 32 4Z" fill="url(#gold-star-grad)" />
      <path d="M32 18C32.8 26 38 31.2 46 32C38 32.8 32.8 38 32 46C31.2 38 26 32.8 18 32C26 31.2 31.2 26 32 18Z" fill="#fff8d6" opacity="0.7" />
    </svg>
  );
}

/**
 * ดาวเสาร์พร้อมวงแหวน — ของตกแต่งด้านขวาของ Cosmic Intro
 * decorative: aria-hidden และไม่รับ pointer events จาก parent
 */
export function SaturnIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="saturn-body" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#6d7cff" />
          <stop offset="60%" stopColor="#3b3fb3" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
        <linearGradient id="saturn-ring" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#f5d0fe" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* วงแหวนครึ่งหลัง */}
      <path d="M6 38c6-9 24-14 40-11 10 2 14 6 12 9" stroke="url(#saturn-ring)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="32" r="16" fill="url(#saturn-body)" />
      {/* วงแหวนครึ่งหน้า */}
      <path d="M58 36c-2 5-14 9-30 7C14 41 4 36 6 30" stroke="url(#saturn-ring)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * ไอคอนเมนูแฮมเบอร์ger — ใช้ใน Header ด้านขวา
 */
export function HamburgerMenuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

/**
 * ไอคอนล้างคำค้นหา (Clear Button)
 */
export function ClearIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** ไอคอนร้านค้าเพชร — FeatureActionCard */
export function DiamondShopIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M12 3 4 9l8 12 8-12-8-6Z" strokeLinejoin="round" />
      <path d="M4 9h16M8 9l4 12 4-12" strokeLinejoin="round" />
    </svg>
  );
}

/** ไอคอนภารกิจ — clipboard + check */
export function MissionsIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4V2h6v2" strokeLinecap="round" />
      <path d="m9 14 2 2 4-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** ไอคอนวงล้อรางวัล */
export function PrizeWheelIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** ถ้วยรางวัล — หัวข้อ Jackpot */
export function TrophyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M6 9H4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V5h8v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V5H6v4Z" strokeLinejoin="round" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  );
}

/** เครื่องสล็อต — Jackpot card */
export function SlotMachineIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h2M14 9h2M8 13h2M14 13h2" strokeLinecap="round" />
      <path d="M12 5V3" strokeLinecap="round" />
    </svg>
  );
}

/** มงกุฎ/พวงมาลัย Hall of Fame */
export function HallOfFameEmblemIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3 14 8h5l-4 3 1.5 5L12 14l-4.5 2 1.5-5-4-3h5L12 3Z"
        fill="url(#hof-gold)"
        stroke="#fde68a"
        strokeWidth="0.75"
      />
      <defs>
        <linearGradient id="hof-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DollarBadgeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M9 9h4.5a2 2 0 0 1 0 4H9M15 15H10.5a2 2 0 0 1 0-4H15" strokeLinecap="round" />
    </svg>
  );
}

export function ProfileNavIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
    </svg>
  );
}

export function DepositNavIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M12 10v6M9 13l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WithdrawNavIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M12 16V10M9 13l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BonusNavIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M12 8V5M8 5h8" strokeLinecap="round" />
      <path d="M12 8c-2 0-3 1-3 2s1 2 3 2 3-1 3-2-1-2-3-2Z" />
    </svg>
  );
}

export function ContactNavIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 14v3a2 2 0 0 0 2 2h1l2-3h4l2 3h1a2 2 0 0 0 2-2v-3" strokeLinejoin="round" />
      <path d="M6 14a6 6 0 1 1 12 0" strokeLinecap="round" />
    </svg>
  );
}
