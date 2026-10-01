"use client";

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
      preload
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
 * ไอคอนโฮม — ใช้ใน CategoryNav / sidebar หมวดหน้าแรก
 */
export function HomeNavIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 10.5 12 4l7.5 6.5" />
      <path d="M6.5 10v9.5h11V10" />
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
 * ไอคอนตัวกรองแบบสไลด์ — แถบมินิมอลค้นหา/หมวดย่อยค่ายเกม
 */
export function FilterSlidersIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** ไอคอนเครื่องหมายถูก — ปิด dialog ตัวกรอง */
export function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** ไอคอน grid 4 ช่อง — แถวค่ายเกมใน dialog ตัวกรอง */
export function FilterProvidersGridIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" opacity="0.95" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" opacity="0.75" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" opacity="0.75" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" opacity="0.55" />
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
 * ไอคอนลูกศรย้อนกลับ Arrow Left — ใช้ในแถบหัวหน้า standalone มือถือ (ไร้ card ครอบ)
 */
export function ArrowLeftIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

/** ไอคอนคัดลอก — ID สมาชิก */
export function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" />
    </svg>
  );
}

/** ไอคอนยืนยัน — badge เบอร์โทร */
export function VerifiedCheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** ไอคอนออกจากระบบ */
export function LogOutIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** อวatar placeholder วงกลม */
export function ProfileAvatarIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3.5" />
      <path d="M6.5 19.5c1.5-3 4-4.5 5.5-4.5s4 1.5 5.5 4.5" strokeLinecap="round" />
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
 * ไอคอนลูกบาสเกตบอล
 */
export function BasketballIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5.6 5.6C8.5 8.5 8.5 15.5 5.6 18.4M18.4 5.6c-2.9 2.9-2.9 9.9 0 12.8" />
    </svg>
  );
}

/**
 * ไอคอนนวมมวย / มวยไทย
 */
export function BoxingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 10c0-3.5-2.5-6-6.5-6S6 6.5 6 10c0 2 .8 3.5 2 4.5V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.5c1.2-1 2-2.5 2-4.5Z" />
      <path d="M6 10h4c1 0 2 1 2 2s-1 2-2 2H8" />
      <line x1="8" y1="17" x2="14" y2="17" />
    </svg>
  );
}

/**
 * ไอคอนลูกเทนนิส / ไม้เทนนิส
 */
export function TennisIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18M12 3a9 9 0 0 1 0 18" strokeDasharray="2 2" opacity="0.3" />
      <path d="M5.6 5.6c4.5 4.5 4.5 8.3 0 12.8M18.4 5.6c-4.5 4.5-4.5 8.3 0 12.8" />
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

/**
 * ไอคอนกระเป๋าเงินแบบเส้น — ใช้ใน Header notch ยอดคงเหลือ
 */
export function HeaderWalletIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path
        d="M4 8.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5H6a2 2 0 0 1-2-2v-1.5Z"
        strokeLinejoin="round"
      />
      <path d="M19 13.5h1.5a1.5 1.5 0 1 0 0-3H19" strokeLinecap="round" />
      <path d="M6 8.5V7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1.5" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * ไอคอนกระเป๋าทองคำ 3D-styled — สำหรับ Header mobile capsule
 */
export function HeaderGoldWalletIcon({ className = "w-6 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cmGoldWalletBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="cmGoldWalletFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="cmGoldWalletClasp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Back flap edge for depth */}
      <rect x="2" y="3" width="22" height="17" rx="3.5" fill="#b45309" />
      {/* Wallet main body */}
      <rect x="2" y="6" width="24" height="15" rx="3.5" fill="url(#cmGoldWalletBody)" />
      {/* Front flap with curve */}
      <path
        d="M2 7C2 5.343 3.343 4 5 4H21C22.657 4 24 5.343 24 7V10C24 11.657 22.657 13 21 13H5C3.343 13 2 11.657 2 10V7Z"
        fill="url(#cmGoldWalletFlap)"
      />
      {/* Clasp tab on right side */}
      <rect x="21" y="9.5" width="4.5" height="4.5" rx="1.5" fill="url(#cmGoldWalletClasp)" stroke="#b45309" strokeWidth="0.5" />
      <circle cx="23.25" cy="11.75" r="0.75" fill="#78350f" />
    </svg>
  );
}

/**
 * ไอคอนผู้ใช้ทึบ (Solid Avatar) — สำหรับ Header mobile profile circle
 */
export function SolidUserIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="7.5" r="4.25" />
      <path d="M4 19.5C4 15.5 7.5 13 12 13s8 2.5 8 6.5V20H4v-0.5Z" />
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

/**
 * ไอคอนกากบาท (Close / X)
 * ใช้ในปุ่มปิดของ RightMenuDrawer (มุมบนซ้าย)
 */
export function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** ไอคอนมือถือ — ฟอร์มสมัครสมาชิก */
export function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" strokeLinecap="round" />
    </svg>
  );
}

/** ไอคอนกุญแจ — รหัสผ่าน */
export function LockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

/** แสดงรหัสผ่าน */
export function EyeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** ซ่อนรหัสผ่าน */
export function EyeOffIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-4.1 5.2M6.2 6.2C3.4 8.4 2 12 2 12a18.5 18.5 0 0 0 7.9 6.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** ไอคอนธนาคาร — trigger เลือกธนาคาร */
export function BankBuildingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 10 12 4l8 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v8h14v-8" />
      <path d="M9 18v-4h6v4" strokeLinecap="round" />
    </svg>
  );
}

/** ไอคอนช่องทาง / broadcast */
export function BroadcastChannelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2" />
      <path d="M5.5 8.5a7 7 0 0 0 0 7M18.5 8.5a7 7 0 0 1 0 7" strokeLinecap="round" />
      <path d="M2 5.5a11 11 0 0 0 0 13M22 5.5a11 11 0 0 1 0 13" strokeLinecap="round" />
    </svg>
  );
}

/**
 * ไอคอนลูกเต๋าคู่ (Casino Dice)
 * ใช้ในเมนูนำทาง "คาสิโน" ของ RightMenuDrawer
 */
export function CasinoDiceIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="7" width="12" height="12" rx="2.5" />
      <path d="M7 7V4.5A1.5 1.5 0 0 1 8.5 3h11A1.5 1.5 0 0 1 21 4.5V15a1.5 1.5 0 0 1-1.5 1.5H15" />
      <circle cx="6.5" cy="10.5" r="0.8" fill="currentColor" />
      <circle cx="11.5" cy="10.5" r="0.8" fill="currentColor" />
      <circle cx="9" cy="13" r="0.8" fill="currentColor" />
      <circle cx="6.5" cy="15.5" r="0.8" fill="currentColor" />
      <circle cx="11.5" cy="15.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * ไอคอนตั๋วคูปอง (Promo Ticket)
 * ใช้ในเมนู "โปรโมชั่น" ของ RightMenuDrawer
 */
export function PromoTicketIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 8a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3Z" />
      <path d="M12 7v2M12 11v2M12 15v2" strokeDasharray="1 1" />
    </svg>
  );
}

/**
 * ไอคอน NFT หกเหลี่ยมตัว N (NFT Hexagon)
 * ใช้ในเมนู "NFT" ของ RightMenuDrawer
 */
export function NftHexIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.5l7.5 4.3v8.6L12 21.5l-7.5-4.3V6.8L12 2.5Z" />
      <path d="M9 8.5v7l6-7v7" strokeWidth="2" />
    </svg>
  );
}

/**
 * ไอคอนกลุ่มเพื่อน (Invite Friends)
 * ใช้ในเมนู "ชวนเพื่อน" ของ RightMenuDrawer
 */
export function InviteFriendsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/**
 * ไอคอนชุดหูฟังแชทสด (Support Headset)
 * ใช้ในแถบเมนูฟังก์ชันเสริม "แชทสด" ของ RightMenuDrawer
 */
export function SupportHeadsetIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" />
    </svg>
  );
}

/**
 * ไอคอนดาวน์โหลดแอป (Download App)
 * ใช้ในแถบเมนูฟังก์ชันเสริม "ติดตั้งแอป" ของ RightMenuDrawer
 */
export function DownloadAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/**
 * ไอคอนลูกโลก (Language Globe)
 * ใช้ในตัวเลือกภาษา "ภาษาไทย" ของ RightMenuDrawer
 */
export function LanguageGlobeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8" />
      <path d="M12 3a14.5 14.5 0 0 0 0 18M12 3a14.5 14.5 0 0 1 0 18" />
    </svg>
  );
}

/**
 * ไอคอนลูกศรชี้ลง (Chevron Down)
 * ใช้ใน Dropdown หมวดหมู่ย่อยและเลือกภาษาของ RightMenuDrawer
 */
export function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** มงกุฎ VIP */
export function CrownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 18h16l-2-9-4 3-2-5-2 5-4-3-2 9Z" strokeLinejoin="round" />
      <path d="M4 18v2h16v-2" strokeLinecap="round" />
    </svg>
  );
}

/** นาฬิกา / ประวัติ */
export function HistoryIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** เพชร */
export function DiamondGemIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M6 3h12l4 7-10 11L2 10l4-7Z" strokeLinejoin="round" />
      <path d="M2 10h20M12 21 6 3m6 18 6-18M8.5 3l3.5 7m3.5-7-3.5 7" strokeLinejoin="round" />
    </svg>
  );
}

/** โบนัสยอดเสีย / คืนยอด */
export function RefundIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Affiliate / กลุ่ม */
export function UsersGroupIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 19c0-2 2-3.5 4-3.5" strokeLinecap="round" />
    </svg>
  );
}

/** ป้ายโปรโมชั่น */
export function PromoTagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M20 12l-8 8-8-8 8-8 8 8Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * ไอคอนกล่องของขวัญ / ริบบิ้น (Gift Voucher)
 * ใช้ในการ์ด "บัตรของขวัญ" ของ RightMenuDrawer
 */
export function GiftVoucherIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect x="4" y="11" width="24" height="17" rx="3" fill="#818cf8" fillOpacity="0.25" stroke="#a5b4fc" strokeWidth="1.5" />
      <rect x="2" y="9" width="28" height="6" rx="2" fill="#6366f1" />
      <path d="M16 9v19" stroke="#e0e7ff" strokeWidth="2.5" />
      <path d="M16 9C14 5 10 4 9 6s2 3 7 3Zm0 0c2-4 6-5 7-3s-2 3-7 3Z" fill="#c7d2fe" />
    </svg>
  );
}

/**
 * ไอคอนกระเป๋าเงินคริปโต (Wallet Crypto)
 * ใช้ในการ์ด "ยังไม่มีคริปโต?" ของ RightMenuDrawer
 */
export function WalletCryptoIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect x="2" y="6" width="24" height="16" rx="3.5" fill="#3b82f6" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="1.5" />
      <path d="M2 10.5C4 9 7 9 26 9" stroke="#93c5fd" strokeWidth="1.5" />
      <rect x="18" y="12" width="7" height="6" rx="1.5" fill="#2563eb" stroke="#bfdbfe" strokeWidth="1" />
      <circle cx="21" cy="15" r="1" fill="#ffffff" />
    </svg>
  );
}

/**
 * กราฟิกวงล้อรางวัลสีสันสดใส (Wheel of Fortune Graphic)
 * ใช้ในการ์ด "วงล้อ" มุมบนซ้ายของ RightMenuDrawer
 */
export function WheelGraphic({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="url(#wheel-outer-rim)" stroke="#fcd34d" strokeWidth="2" />
      <defs>
        <radialGradient id="wheel-outer-rim" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#831843" />
        </radialGradient>
      </defs>
      {/* 8 ช่องสีวงล้อ */}
      <path d="M32 32 L32 4 A28 28 0 0 1 52 12 Z" fill="#ef4444" />
      <path d="M32 32 L52 12 A28 28 0 0 1 60 32 Z" fill="#f59e0b" />
      <path d="M32 32 L60 32 A28 28 0 0 1 52 52 Z" fill="#10b981" />
      <path d="M32 32 L52 52 A28 28 0 0 1 32 60 Z" fill="#3b82f6" />
      <path d="M32 32 L32 60 A28 28 0 0 1 12 52 Z" fill="#8b5cf6" />
      <path d="M32 32 L12 52 A28 28 0 0 1 4 32 Z" fill="#ec4899" />
      <path d="M32 32 L4 32 A28 28 0 0 1 12 12 Z" fill="#06b6d4" />
      <path d="M32 32 L12 12 A28 28 0 0 1 32 4 Z" fill="#eab308" />
      {/* วงแหวนทองขอบใน */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 3" />
      {/* ดุมกึ่งกลาง */}
      <circle cx="32" cy="32" r="8" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="4" fill="#ffffff" />
      {/* เข็มชี้บน */}
      <polygon points="32,2 28,10 36,10" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
    </svg>
  );
}

/**
 * กราฟิกเพชรประกายและหีบสมบัติ (Diamond & Treasure Chest Graphic)
 * ใช้ในการ์ด "ร้านค้าเพชร" มุมบนขวาของ RightMenuDrawer
 */
export function DiamondChestGraphic({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="diamond-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="chest-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* หีบสมบัติ */}
      <rect x="20" y="34" width="38" height="24" rx="4" fill="#7c2d12" stroke="#d97706" strokeWidth="1.5" />
      <path d="M18 34c0-5 6-10 20-10s20 5 20 10H18Z" fill="#9a3412" stroke="#d97706" strokeWidth="1.5" />
      <rect x="36" y="32" width="6" height="8" rx="1.5" fill="url(#chest-gold)" />
      {/* เพชรสีฟ้าประกายใหญ่ */}
      <polygon points="26,6 40,6 48,16 26,38 4,16" fill="url(#diamond-glow)" stroke="#bae6fd" strokeWidth="1.5" />
      <polygon points="26,6 40,6 36,16 16,16" fill="#e0f2fe" opacity="0.85" />
      <polygon points="16,16 36,16 26,38" fill="#38bdf8" />
      <polygon points="4,16 16,16 26,38" fill="#0284c7" opacity="0.9" />
      <polygon points="48,16 36,16 26,38" fill="#0369a1" opacity="0.9" />
      {/* ประกายดาววิบวับ */}
      <path d="M48 6L50 10L54 12L50 14L48 18L46 14L42 12L46 10Z" fill="#ffffff" />
      <circle cx="12" cy="8" r="1.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * กราฟิกกระดานภารกิจและดาวทอง (Mission Clipboard Graphic)
 * ใช้ในการ์ด "ภารกิจ" ของ RightMenuDrawer
 */
export function MissionClipboardGraphic({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="board-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      {/* แผ่นกระดานคลิปบอร์ด */}
      <rect x="8" y="12" width="38" height="46" rx="5" fill="url(#board-grad)" stroke="#93c5fd" strokeWidth="1.5" />
      <rect x="18" y="6" width="18" height="10" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
      <circle cx="27" cy="11" r="2" fill="#1e293b" />
      {/* รายการบรรทัดและเครื่องหมายถูก */}
      <rect x="14" y="24" width="7" height="7" rx="1.5" fill="#10b981" />
      <path d="M15.5 27.5L17.5 29.5L20 25.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="24" y1="28" x2="38" y2="28" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />

      <rect x="14" y="36" width="7" height="7" rx="1.5" fill="#10b981" />
      <path d="M15.5 39.5L17.5 41.5L20 37.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="24" y1="40" x2="38" y2="40" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />

      {/* เหรียญดาวทองลอยเด่น */}
      <circle cx="46" cy="44" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
      <path d="M46 34L49 41L56 42L51 47L52 54L46 50L40 54L41 47L36 42L43 41Z" fill="#fef08a" stroke="#b45309" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * กราฟิกถ้วยรางวัลและการแข่งขัน (Trophy & Racing Graphic)
 * ใช้ในการ์ด "การแข่งขัน" ของ RightMenuDrawer
 */
export function TrophyRacingGraphic({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* ริบบิ้นแข่งรถ / ธงตาหมากรุกด้านหลัง */}
      <path d="M38 18C44 14 56 16 60 22L54 36C50 32 44 32 38 34Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
      <rect x="42" y="17" width="5" height="5" fill="#0f172a" />
      <rect x="52" y="19" width="5" height="5" fill="#0f172a" />
      <rect x="47" y="24" width="5" height="5" fill="#0f172a" />
      {/* ถ้วยรางวัลทองคำ */}
      <path d="M18 16H40V28C40 35 34 38 29 38C24 38 18 35 18 28V16Z" fill="url(#trophy-gold)" stroke="#78350f" strokeWidth="1.5" />
      <path d="M18 19H12C9 19 8 26 12 28C15 29 18 27 18 25" stroke="url(#trophy-gold)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 19H46C49 19 50 26 46 28C43 29 40 27 40 25" stroke="url(#trophy-gold)" strokeWidth="2.5" strokeLinecap="round" />
      {/* ฐานถ้วยรางวัล */}
      <path d="M26 38H32V46H26V38Z" fill="#eab308" stroke="#78350f" strokeWidth="1" />
      <rect x="20" y="46" width="18" height="8" rx="2" fill="#451a03" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="29" cy="24" r="3" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

/**
 * ไอคอนจอยเกมคอนโซล (Gamepad)
 * ใช้ในแท็บ "ค่ายเกมทั้งหมด" ของหน้าค่ายเกมสล็อต (/category/slots)
 */
export function GamepadIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M6 12h4M8 10v4" />
      <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" />
      <circle cx="17.5" cy="13.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

/**
 * ไอคอนหยดน้ำ (Water Drop)
 * ใช้ในแท็บ "Drops & Wins" ของหน้าค่ายเกมสล็อต (/category/slots)
 */
export function WaterDropIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.5C12 2.5 5 10 5 15.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5Z" />
      <path d="M12 8c0 3 2 5 4 6" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * ไอคอนไก่ (Rooster / Chicken)
 * ใช้ในแท็บ "ไก่" ของหน้าค่ายเกมสล็อต (/category/slots)
 */
export function ChickenIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* หงอนไก่ */}
      <path d="M14 3.5c.5-1 2-1 2.5 0 .5-.8 1.8-.8 2.2 0" />
      {/* ตัวไก่และจะงอยปาก */}
      <path d="M18 5.5c-1 0-3 1-3.5 3-.5 2 1 4 0 6.5s-3 3-5 3c-3 0-5.5-2-5.5-5 0-4 4-7 8.5-7.5" />
      <path d="M18 7l2.5 1.5-2.5 1.5" />
      <circle cx="16" cy="7.5" r="0.8" fill="currentColor" />
      {/* ขาไก่ */}
      <path d="M10 18v3M12 18v3M9 21h3M11 21h3" />
    </svg>
  );
}

/**
 * ไอคอนเปลวไฟสีสดใสสำหรับป้าย HOT
 * ใช้บนแบนเนอร์ JILI ของหน้าค่ายเกมสล็อต (/category/slots)
 */
export function FlameHotIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c.6 3.2 2.4 4.9 4.3 6.8C18.2 10.7 19 12.5 19 14.5A7 7 0 0 1 5 14.5c0-1.6.5-3 1.4-4.2.4 1 1.1 1.7 2.1 2.1C8.2 8.2 9.8 4.6 12 2Zm0 9c-1.4 1.6-2.2 3-2.2 4.3a2.2 2.2 0 1 0 4.4 0c0-1.3-.8-2.7-2.2-4.3Z" />
    </svg>
  );
}

/**
 * ไอคอนกล่องของขวัญ (Gift Box)
 * ใช้ในแท็บ "ศูนย์รวม" ของหน้าค่ายเกมสล็อต (/slots)
 */
export function GiftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* ริบบิ้นโบว์ด้านบน */}
      <path d="M12 7a2.5 2.5 0 0 0-2.45-3 2.5 2.5 0 0 0-2.5 2.5c0 1.5 2.5 3 4.95 3.5H12Zm0 0a2.5 2.5 0 0 1 2.45-3 2.5 2.5 0 0 1 2.5 2.5c0 1.5-2.5 3-4.95 3.5H12Z" fill="none" />
      {/* ฝากล่อง */}
      <rect x="3" y="7" width="18" height="4" rx="1.5" />
      {/* ตัวกล่อง */}
      <path d="M5 11v8.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V11" />
      {/* เส้นริบบิ้นผ่ากลาง */}
      <line x1="12" y1="7" x2="12" y2="21" />
    </svg>
  );
}

/**
 * ไอคอนประกายดาวเมกะเวย์ (Sparkle)
 * ใช้ในแท็บ "เมกะเวย์" ของหน้าค่ายเกมสล็อต (/slots)
 */
export function SparkleSlotIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}



