"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SportCardItem } from "../../data/sportProvidersData";

/**
 * คอมโพเนนต์วาดกราฟิกกีฬาแต่ละประเภทตามสไตล์เดียวกับภาพอ้างอิง
 */
function SportCardGraphic({ artType }: { artType: string }) {
  switch (artType) {
    case "football-stadium":
    case "premier-football":
    case "virtual-pitch":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          {/* แสงสปอร์ตไลท์สนาม */}
          <circle cx="50" cy="55" r="38" fill="#38bdf8" opacity="0.3" filter="blur(10px)" />
          {/* สนามหญ้าและเส้นโค้งอัฒจันทร์ */}
          <ellipse cx="50" cy="85" rx="44" ry="20" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1.5" />
          <path d="M15 85 Q50 65 85 85" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.6" />
          {/* ลูกฟุตบอลลอยเด่นพุ่งเข้ามา */}
          <g transform="translate(50, 46)">
            <circle cx="0" cy="0" r="20" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="0,-7 6,-2 4,5 -4,5 -6,-2" fill="#0f172a" />
            <line x1="0" y1="-7" x2="0" y2="-17" stroke="#334155" strokeWidth="1.2" />
            <line x1="6" y1="-2" x2="16" y2="-6" stroke="#334155" strokeWidth="1.2" />
            <line x1="4" y1="5" x2="13" y2="13" stroke="#334155" strokeWidth="1.2" />
            <line x1="-4" y1="5" x2="-13" y2="13" stroke="#334155" strokeWidth="1.2" />
            <line x1="-6" y1="-2" x2="-16" y2="-6" stroke="#334155" strokeWidth="1.2" />
          </g>
        </svg>
      );
    case "basketball-arena":
    case "basketball-dunk":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#ea580c" opacity="0.3" filter="blur(10px)" />
          {/* แป้นและห่วงบาส */}
          <rect x="25" y="15" width="50" height="30" rx="3" fill="#ffffff" stroke="#ea580c" strokeWidth="2" opacity="0.4" />
          <rect x="36" y="24" width="28" height="18" fill="none" stroke="#ea580c" strokeWidth="2" />
          {/* ลูกบาสเกตบอลหมุน */}
          <g transform="translate(50, 52)">
            <circle cx="0" cy="0" r="22" fill="#f97316" stroke="#fb923c" strokeWidth="2" />
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#7c2d12" strokeWidth="1.8" />
            <line x1="0" y1="-22" x2="0" y2="22" stroke="#7c2d12" strokeWidth="1.8" />
            <path d="M-15 -15 Q0 -7 15 -15" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
            <path d="M-15 15 Q0 7 15 15" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
          </g>
        </svg>
      );
    case "boxing-gloves":
    case "boxing-ring":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#22c55e" opacity="0.3" filter="blur(10px)" />
          {/* เชือกเวทีมวย */}
          <line x1="10" y1="30" x2="90" y2="30" stroke="#86efac" strokeWidth="2" opacity="0.4" />
          <line x1="10" y1="42" x2="90" y2="42" stroke="#86efac" strokeWidth="2" opacity="0.4" />
          {/* นวมมวยคู่สีแดงและทอง */}
          <g transform="translate(42, 50) rotate(-15)">
            <path d="M-12 -16 C-12 -24 8 -24 8 -16 C10 -6 6 12 -4 12 C-12 12 -12 -6 -12 -16 Z" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
            <rect x="-10" y="8" width="16" height="8" rx="2" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
          </g>
          <g transform="translate(58, 52) rotate(15)">
            <path d="M-8 -16 C-8 -24 12 -24 12 -16 C12 -6 12 12 4 12 C-6 12 -8 -6 -8 -16 Z" fill="#eab308" stroke="#fef08a" strokeWidth="1.5" />
            <rect x="-6" y="8" width="16" height="8" rx="2" fill="#ffffff" stroke="#854d0e" strokeWidth="1" />
          </g>
        </svg>
      );
    case "esports-controller":
    case "esports-neon":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#a855f7" opacity="0.3" filter="blur(10px)" />
          {/* หูฟังเกมมิ่งและจอยคอนโทรลเลอร์นีออน */}
          <g transform="translate(50, 52)">
            {/* ก้านหูฟัง */}
            <path d="M-28 -4 C-28 -28 28 -28 28 -4" stroke="#c084fc" strokeWidth="3" fill="none" />
            <rect x="-34" y="-8" width="10" height="16" rx="4" fill="#a855f7" />
            <rect x="24" y="-8" width="10" height="16" rx="4" fill="#a855f7" />
            {/* จอยเกม */}
            <rect x="-22" y="0" width="44" height="26" rx="10" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" />
            <path d="M-12 9 h6 M-9 6 v6" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="10" r="2.5" fill="#f43f5e" />
            <circle cx="16" cy="15" r="2.5" fill="#38bdf8" />
          </g>
        </svg>
      );
    case "tennis-court":
    case "tennis-trophy":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#06b6d4" opacity="0.3" filter="blur(10px)" />
          {/* ไม้เทนนิสและลูกเทนนิสสีเขียวสะท้อนแสง */}
          <g transform="translate(50, 48)">
            {/* หัวไม้เทนนิส */}
            <ellipse cx="-4" cy="-6" rx="18" ry="24" fill="none" stroke="#22d3ee" strokeWidth="2" transform="rotate(25)" />
            {/* เอ็นไม้เทนนิส */}
            <line x1="-12" y1="-18" x2="6" y2="10" stroke="#a5f3fc" strokeWidth="0.8" opacity="0.6" />
            <line x1="-18" y1="-6" x2="12" y2="-6" stroke="#a5f3fc" strokeWidth="0.8" opacity="0.6" />
            {/* ด้ามจับไม้เทนนิส */}
            <line x1="8" y1="12" x2="22" y2="34" stroke="#0891b2" strokeWidth="3.5" strokeLinecap="round" />
            {/* ลูกเทนนิส */}
            <circle cx="-14" cy="12" r="10" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1.2" />
            <path d="M-21 7 Q-14 12 -21 17" stroke="#ffffff" strokeWidth="1.2" fill="none" />
            <path d="M-7 7 Q-14 12 -7 17" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          </g>
        </svg>
      );
    case "trophy-gold-cup":
    case "world-cup-globe":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#fbbf24" opacity="0.3" filter="blur(10px)" />
          {/* ถ้วยรางวัลแชมเปียนส์ลีกสีทองหรูหรา */}
          <g transform="translate(50, 50)">
            {/* ตัวถ้วย */}
            <path d="M-18 -20 H18 V-2 C18 12 8 18 0 18 C-8 18 -18 12 -18 -2 Z" fill="#eab308" stroke="#78350f" strokeWidth="1.5" />
            {/* หูถ้วย 2 ข้าง */}
            <path d="M-18 -15 H-26 C-32 -15 -32 5 -20 5 H-16" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 -15 H26 C32 -15 32 5 20 5 H16" fill="none" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
            {/* ก้านและฐานถ้วย */}
            <rect x="-4" y="18" width="8" height="10" fill="#ca8a04" />
            <rect x="-14" y="28" width="28" height="8" rx="2" fill="#451a03" stroke="#fbbf24" strokeWidth="1" />
            <circle cx="0" cy="-2" r="4" fill="#fef08a" />
          </g>
        </svg>
      );
    case "pinnacle-shield":
    default:
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#ef4444" opacity="0.3" filter="blur(10px)" />
          {/* โล่สปอร์ตและลูกศรพุ่งทะยาน */}
          <g transform="translate(50, 50)">
            <path d="M0 -24 L24 -12 V10 C24 24 0 32 0 32 C0 32 -24 24 -24 10 V-12 Z" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
            <polygon points="0,-16 12,6 4,6 4,16 -4,16 -4,6 -12,6" fill="#fef08a" />
          </g>
        </svg>
      );
  }
}

interface SportProviderCardsProps {
  items: SportCardItem[];
  totalCount: number;
  hideTitleRow?: boolean;
  sectionTitle?: string;
}

/**
 * คอมโพเนนต์แสดงรายการกีฬาแบบ 3 คอลัมน์ (ตามรูปภาพอ้างอิง)
 * - การ์ดทรงมนมุมแนวตั้ง Aspect Ratio ~3:4.2
 * - ป้ายกำกับ EXCLUSIVE / LIVE / HOT มุมบนซ้าย
 * - อาร์ตเวิร์กประเภทกีฬาตรงกลาง
 * - ข้อความหัวข้อสีขาวตัวหนา Drop-shadow เด่นชัด และชื่อ Provider ด้านล่าง
 */
export function SportProviderCards({
  items,
  totalCount,
  hideTitleRow = false,
  sectionTitle = "กีฬา",
}: SportProviderCardsProps) {
  return (
    <div className="space-y-3.5">
      {!hideTitleRow ? (
      <div className="flex items-baseline gap-2 pt-1">
        <h2 className="text-lg font-medium text-white sm:text-xl">
          {sectionTitle}
        </h2>
        <span className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
          ({totalCount} รายการ/ค่ายเกม)
        </span>
      </div>
      ) : null}

      {/* มือถือ: carousel 3 ใบ + peek | เดสก์ท็อป: กริด (carousel.css) */}
      <div className="lobby-category-provider-track carousel-track carousel-lobby-category">
        {items.map((item) => {
          const hasCover = Boolean(item.coverSrc);

          return (
          <Link
            key={item.id}
            href={item.href}
            aria-label={hasCover ? `${item.title} — ${item.provider}` : undefined}
            className={`group relative flex aspect-[3/4] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-white/[0.08] shadow-md transition-all duration-200 hover:brightness-110 active:scale-[0.98] ${
              hasCover
                ? "bg-[var(--surface-mid)] p-0"
                : `bg-gradient-to-b ${item.bgGradient ?? "from-[#1e1b4b] to-[#0f172a]"} p-2 sm:p-2.5`
            }`}
          >
            {hasCover && item.coverSrc ? (
              <Image
                src={item.coverSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 11vw, 42vw"
                className="object-cover"
              />
            ) : null}

            {!hasCover && (
            <>
            {/* 1. แถบป้ายกำกับมุมบนซ้าย (EXCLUSIVE / LIVE / HOT) */}
            <div className="z-10 flex flex-wrap items-start gap-1">
              {item.badges.map((badge, idx) => {
                if (badge === "EXCLUSIVE") {
                  return (
                    <span
                      key={idx}
                      className="rounded bg-[#00f59b] px-1.5 py-0.5 text-[7.5px] font-medium uppercase tracking-tight text-black shadow-sm sm:text-[8.5px]"
                    >
                      EXCLUSIVE
                    </span>
                  );
                }
                if (badge === "LIVE") {
                  return (
                    <span
                      key={idx}
                      className="rounded bg-[#e91e3a] px-1.5 py-0.5 text-[7.5px] font-medium uppercase tracking-tight text-white shadow-sm sm:text-[8.5px]"
                    >
                      LIVE
                    </span>
                  );
                }
                if (badge === "HOT") {
                  return (
                    <span
                      key={idx}
                      className="rounded bg-[#f59e0b] px-1.5 py-0.5 text-[7.5px] font-medium uppercase tracking-tight text-black shadow-sm sm:text-[8.5px]"
                    >
                      HOT
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* 2. อาร์ตเวิร์กกีฬาตรงกลาง */}
            <div className="pointer-events-none absolute inset-x-0 bottom-11 top-4 flex items-center justify-center select-none overflow-hidden" aria-hidden="true">
              <SportCardGraphic artType={item.artType ?? "pinnacle-shield"} />
            </div>

            {/* 3. แผ่นเงาดำไล่ระดับด้านล่าง (Bottom Gradient Overlay) เพื่อให้อ่านตัวหนังสือชัดเจน */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

            {/* 4. ข้อความหัวข้อสีขาว และชื่อ Provider ด้านล่าง */}
            <div className="z-10 mt-auto flex flex-col items-center pb-2 px-1 text-center">
              <h3 className="line-clamp-2 text-center text-xs sm:text-[13px] font-medium uppercase leading-snug tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {item.title}
              </h3>
              <p className="mt-0.5 truncate text-center text-xs font-medium text-white/80 drop-shadow sm:text-sm">
                {item.provider}
              </p>
            </div>
            </>
            )}
          </Link>
          );
        })}
      </div>
    </div>
  );
}
