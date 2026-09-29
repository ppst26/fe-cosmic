"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FlameHotIcon } from "../ui/Icons";
import {
  FeaturedSlotProviderItem,
  GridSlotProviderItem,
} from "../../data/slotProvidersData";

/**
 * กราฟิกอาร์ตเวิร์กด้านขวาของแบนเนอร์ JILI (นักดนตรีโครงกระดูกวันแห่งความตาย)
 */
function JiliArtwork() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-44 sm:w-56 overflow-hidden select-none" aria-hidden="true">
      <svg viewBox="0 0 200 100" className="h-full w-full object-cover">
        <defs>
          <linearGradient id="sombrero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* แสงประกายเทศกาล */}
        <circle cx="150" cy="50" r="40" fill="#a855f7" opacity="0.3" filter="blur(10px)" />
        <circle cx="90" cy="30" r="25" fill="#f59e0b" opacity="0.25" filter="blur(8px)" />

        {/* เหรียญทองลอย */}
        <circle cx="160" cy="18" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="185" cy="45" r="5.5" fill="#f59e0b" />

        {/* ตรา Wild กะโหลกน้ำตาล */}
        <g transform="translate(65, 15) scale(0.65)">
          <circle cx="24" cy="24" r="22" fill="#701a75" stroke="#f472b6" strokeWidth="2" />
          <path d="M12 28 C12 16 36 16 36 28 C36 38 28 42 24 42 C20 42 12 38 12 28 Z" fill="#fdf2f8" />
          <circle cx="18" cy="26" r="3.5" fill="#db2777" />
          <circle cx="30" cy="26" r="3.5" fill="#db2777" />
          <path d="M18 36 h12" stroke="#db2777" strokeWidth="2" />
        </g>

        {/* หมวก Sombrero ปีกกว้าง */}
        <ellipse cx="140" cy="32" rx="42" ry="14" fill="url(#sombrero-grad)" stroke="#713f12" strokeWidth="1.5" />
        <path d="M122 28 C122 14 158 14 158 28 Z" fill="#a16207" />
        <path d="M102 34 C120 38 160 38 178 34" stroke="#e11d48" strokeWidth="2.5" />

        {/* กะโหลกนักดนตรี */}
        <circle cx="140" cy="44" r="14" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
        <ellipse cx="134" cy="42" rx="3.5" ry="4" fill="#0f172a" />
        <ellipse cx="146" cy="42" rx="3.5" ry="4" fill="#0f172a" />
        <polygon points="140,45 138,48 142,48" fill="#0f172a" />
        {/* หนวดเม็กซิกัน */}
        <path d="M130 52 Q140 49 150 52 Q140 56 130 52 Z" fill="#334155" />
        {/* ฟันยิ้ม */}
        <line x1="134" y1="54" x2="146" y2="54" stroke="#334155" strokeWidth="1.5" />

        {/* คอกีตาร์สีน้ำตาล */}
        <polygon points="150,60 178,28 184,33 156,65" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <circle cx="181" cy="30" r="2.5" fill="#fbbf24" />

        {/* ดอกกุหลาบสีแดงสดด้านหน้า */}
        <circle cx="115" cy="85" r="10" fill="url(#rose-grad)" />
        <circle cx="135" cy="88" r="9" fill="url(#rose-grad)" />
        <circle cx="170" cy="86" r="11" fill="url(#rose-grad)" />
      </svg>
    </div>
  );
}

/**
 * กราฟิกอาร์ตเวิร์กด้านขวาของแบนเนอร์ Pragmatic Play (ซุสเทพสายฟ้า & วิหาร)
 */
function PragmaticArtwork() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-44 sm:w-56 overflow-hidden select-none" aria-hidden="true">
      <svg viewBox="0 0 200 100" className="h-full w-full object-cover">
        <defs>
          <linearGradient id="zeus-beard" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="lightning-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="gold-armor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>

        {/* แสงออร่าสีฟ้าสายฟ้า */}
        <circle cx="150" cy="45" r="45" fill="#0284c7" opacity="0.35" filter="blur(12px)" />

        {/* วิหารโอลิมปัสเสาหินด้านหลัง */}
        <g opacity="0.35">
          <rect x="155" y="15" width="40" height="4" fill="#e2e8f0" />
          <polygon points="175,8 153,15 197,15" fill="#cbd5e1" />
          <line x1="160" y1="19" x2="160" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="168" y1="19" x2="168" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="176" y1="19" x2="176" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="184" y1="19" x2="184" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
        </g>

        {/* ประกายสายฟ้าสีฟ้าฟาด */}
        <path d="M85 0 L105 38 L95 42 L118 80 L110 52 L120 48 Z" fill="url(#lightning-bolt)" />
        <path d="M125 10 L135 32 L130 35 L145 60" stroke="#67e8f9" strokeWidth="2" fill="none" opacity="0.8" />

        {/* ไหล่และเกราะทองของซุส */}
        <path d="M100 80 Q135 68 175 75 L180 100 L95 100 Z" fill="url(#gold-armor)" stroke="#78350f" strokeWidth="1.5" />
        <path d="M115 72 Q135 62 155 68" stroke="#fef08a" strokeWidth="3" fill="none" />

        {/* ศีรษะและใบหน้าซุส */}
        <circle cx="140" cy="38" r="14" fill="#fed7aa" />
        {/* ดวงตาเรืองแสงสีฟ้า */}
        <ellipse cx="135" cy="36" rx="2.5" ry="1.5" fill="#38bdf8" />
        <ellipse cx="145" cy="36" rx="2.5" ry="1.5" fill="#38bdf8" />
        {/* ผมและหนวดเคราสีขาวสะบัด */}
        <path d="M120 32 C120 18 160 18 160 32 C162 42 155 58 140 64 C125 58 118 42 120 32 Z" fill="url(#zeus-beard)" />
        <path d="M124 45 Q140 56 156 45 Q140 68 124 45 Z" fill="#ffffff" />
      </svg>
    </div>
  );
}

/**
 * แสดงอาร์ตเวิร์กขนาดกะทัดรัดสำหรับการ์ดค่ายเกม 3 คอลัมน์
 */
function GridProviderArt({ artType }: { artType: GridSlotProviderItem["artType"] }) {
  const svgClass = "h-full w-full object-contain";
  switch (artType) {
    case "ygr-caishen":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* เทพเจ้าโชคลาภ Caishen ก้อนทอง */}
          <circle cx="45" cy="30" r="16" fill="#f59e0b" opacity="0.3" />
          <circle cx="45" cy="26" r="12" fill="#fed7aa" />
          <path d="M30 18 h30 v6 h-30 Z" fill="#dc2626" />
          <path d="M36 34 Q45 42 54 34 Z" fill="#1e293b" />
          <path d="M22 36 Q32 30 42 36 L40 44 Q32 40 24 44 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        </svg>
      );
    case "king-midas":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* กษัตริย์ไมดาสสีทอง */}
          <circle cx="45" cy="30" r="16" fill="#ca8a04" opacity="0.3" />
          <path d="M34 16 L38 10 L45 15 L52 10 L56 16 Z" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
          <circle cx="45" cy="28" r="11" fill="#eab308" />
          <path d="M36 34 Q45 45 54 34 Z" fill="#ca8a04" />
        </svg>
      );
    case "spade-girl":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* สาวน้อยอนิเมะและโคมไฟจีน */}
          <circle cx="48" cy="26" r="11" fill="#fbcfe8" />
          <path d="M36 20 C36 12 60 12 60 20 C60 26 58 32 48 34 Z" fill="#1e1b4b" />
          <circle cx="20" cy="24" r="7" fill="#dc2626" stroke="#fbbf24" strokeWidth="1" />
        </svg>
      );
    case "joker-cards":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* โจ๊กเกอร์และหมวกตัวตลก */}
          <path d="M32 18 Q20 12 28 6 Q38 14 36 20" fill="#7c3aed" />
          <path d="M58 18 Q70 12 62 6 Q52 14 54 20" fill="#dc2626" />
          <circle cx="45" cy="28" r="11" fill="#f8fafc" />
          <path d="M38 34 Q45 42 52 34 Z" fill="#dc2626" />
        </svg>
      );
    case "fachai-lion":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* สิงโตเชิด FA CHAI */}
          <circle cx="45" cy="30" r="16" fill="#dc2626" />
          <circle cx="39" cy="25" r="4" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <circle cx="51" cy="25" r="4" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <path d="M36 34 Q45 44 54 34" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
        </svg>
      );
    case "royal-adventurer":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* นักผจญภัยสวมหมวกปีกกว้างถือตะเกียง */}
          <ellipse cx="45" cy="20" rx="18" ry="5" fill="#78350f" />
          <path d="M37 18 C37 10 53 10 53 18 Z" fill="#92400e" />
          <circle cx="45" cy="28" r="10" fill="#fed7aa" />
          <rect x="22" y="28" width="8" height="12" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
        </svg>
      );
    case "relax-tropical":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* สาวชายหาดเขตร้อน */}
          <path d="M32 15 Q26 6 36 4 Q38 12 36 18" fill="#15803d" />
          <circle cx="46" cy="26" r="10" fill="#fbcfe8" />
          <path d="M36 24 C36 14 56 14 56 24 C56 36 46 44 46 44 Z" fill="#451a03" />
        </svg>
      );
    case "ka-fantasy":
      return (
        <svg viewBox="0 0 70 60" className={svgClass}>
          {/* ฮีโร่แฟนตาซีม่วงเขียว */}
          <circle cx="38" cy="22" r="7" fill="#86efac" />
          <circle cx="52" cy="28" r="9" fill="#c084fc" />
          <polygon points="46,40 54,20 62,38" fill="#3b82f6" opacity="0.8" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * แสดงโลโก้แบรนด์ของค่ายเกมแต่ละค่ายทางฝั่งซ้ายของการ์ด
 */
function ProviderLogoBrand({ item }: { item: GridSlotProviderItem }) {
  switch (item.id) {
    case "ygr":
      return (
        <div className="flex items-center">
          <span className="text-lg font-medium tracking-tighter text-white sm:text-xl">YG</span>
          <span className="text-lg font-medium tracking-tighter text-red-600 sm:text-xl">R</span>
        </div>
      );
    case "king-midas":
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-widest text-[#fde047] sm:text-sm">KING</span>
          <span className="-mt-1 text-sm font-medium tracking-tight text-[#fde047] sm:text-base">MIDAS</span>
        </div>
      );
    case "spadegaming":
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-base text-red-500">♠</span>
          <span className="text-xs font-medium text-slate-200 sm:text-sm">Spadegaming</span>
        </div>
      );
    case "joker":
      return (
        <div className="flex items-center">
          <span className="font-medium italic text-lg tracking-tighter text-white sm:text-xl">JO</span>
          <span className="font-medium italic text-lg tracking-tighter text-amber-400 sm:text-xl">KER</span>
        </div>
      );
    case "fa-chai":
      return (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-red-600 text-base">F</span>
          <span className="text-xs font-medium text-white sm:text-sm">FA CHAI</span>
        </div>
      );
    case "royal-slot-gaming":
      return (
        <div className="flex flex-col">
          <span className="text-xs text-amber-400">👑</span>
          <span className="text-xs font-medium text-amber-300 leading-tight sm:text-sm">ROYAL SLOT</span>
          <span className="text-[8px] font-medium tracking-widest text-slate-400">GAMING</span>
        </div>
      );
    case "relax-gaming":
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-widest text-white sm:text-sm">RELAX</span>
          <span className="text-[8px] font-medium tracking-widest text-slate-400">GAMING</span>
        </div>
      );
    case "ka-gaming":
      return (
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-xs font-medium text-white">KA</span>
          <span className="text-xs font-medium text-white sm:text-sm">Gaming</span>
        </div>
      );
    default:
      return (
        <span className="truncate text-xs font-medium text-white sm:text-sm">
          {item.name}
        </span>
      );
  }
}

export type SlotProviderPick = {
  id: string;
  name: string;
  href: string;
};

interface SlotProviderCardsProps {
  featuredProviders: FeaturedSlotProviderItem[];
  gridProviders: GridSlotProviderItem[];
  totalCount: number;
  /** ซ่อนหัว "สล็อต (N ค่าย)" เมื่อใช้ CategorySectionHead ด้านบน */
  hideTitleRow?: boolean;
  /** ซ่อนแบนเนอร์ JILI / Pragmatic (มุมมองใน lobby หลังเลือกค่าย) */
  hideFeatured?: boolean;
  /** เลือกค่ายใน lobby ไม่เปลี่ยนหน้า — ถูกส่งจาก LobbyCategoryProviders */
  onProviderSelect?: (provider: SlotProviderPick) => void;
}

function providerRouteId(item: { id: string; href?: string }) {
  if (item.href) {
    const segment = item.href.split("/").filter(Boolean).pop();
    if (segment) return segment;
  }
  return item.id;
}

/**
 * คอมโพเนนต์แสดงแบนเนอร์ใหญ่ 2 ค่าย และกริดค่ายเกม 3 คอลัมน์
 */
export function SlotProviderCards({
  featuredProviders,
  gridProviders,
  totalCount,
  hideTitleRow = false,
  hideFeatured = false,
  onProviderSelect,
}: SlotProviderCardsProps) {
  const cardSurfaceClass =
    "group relative flex w-full transition-all duration-[var(--motion-fast)] hover:brightness-110 active:scale-[0.99]";

  return (
    <div className="space-y-4">
      {!hideTitleRow ? (
        <div className="flex items-baseline gap-2 pt-1">
          <h2 className="text-lg font-medium text-white sm:text-xl">สล็อต</h2>
          <span className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
            ({totalCount} ค่ายเกม)
          </span>
        </div>
      ) : null}

      {/* 1. 2 แบนเนอร์ใหญ่พิเศษด้านบน (JILI & PRAGMATIC PLAY) */}
      {!hideFeatured ? (
      <div className="space-y-2.5">
        {featuredProviders.map((feat) => {
          const isJili = feat.id === "jili";
          const hasCover = Boolean(feat.coverSrc);

          const featClasses = `${cardSurfaceClass} flex h-28 items-center justify-between overflow-hidden rounded-[var(--radius-panel)] px-4 py-3 sm:h-32 sm:px-6 ${
                hasCover
                  ? "bg-[var(--surface-mid)]"
                  : `bg-gradient-to-r ${feat.bgGradient}`
              }`;

          const featInner = (
            <>
              {hasCover && feat.coverSrc && (
                <>
                  <Image
                    src={feat.coverSrc}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20"
                    aria-hidden="true"
                  />
                </>
              )}

              {/* ข้อมูลแบรนด์และสโลแกนฝั่งซ้าย */}
              <div className="relative z-10 flex flex-col justify-center">
                {isJili ? (
                  <div>
                    <h3 className="bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-3xl font-medium tracking-tight text-transparent drop-shadow sm:text-4xl">
                      JILI
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-amber-200/90 sm:text-sm">
                      {feat.slogan}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1 text-[#fde047]">
                      <span className="text-sm">👑</span>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight text-white drop-shadow sm:text-2xl">
                      PRAGMATIC PLAY<span className="text-xs font-normal">™</span>
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-widest text-sky-200/90 sm:text-sm">
                      {feat.slogan}
                    </p>
                  </div>
                )}
              </div>

              {/* ป้าย HOT มุมบนขวา (เฉพาะ JILI) */}
              {feat.badge && (
                <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-2.5 py-0.5 shadow-md">
                  <FlameHotIcon className="h-3 w-3 text-amber-300" />
                  <span className="text-xs font-medium text-white">
                    {feat.badge}
                  </span>
                </div>
              )}

              {!hasCover && (isJili ? <JiliArtwork /> : <PragmaticArtwork />)}
            </>
          );

          if (onProviderSelect) {
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() =>
                  onProviderSelect({
                    id: providerRouteId(feat),
                    name: feat.name,
                    href: feat.href,
                  })
                }
                className={featClasses}
              >
                {featInner}
              </button>
            );
          }

          return (
            <Link key={feat.id} href={feat.href} className={featClasses}>
              {featInner}
            </Link>
          );
        })}
      </div>
      ) : null}

      {/* 2. กริดค่ายเกม 3 คอลัมน์ */}
      <div className="slot-provider-grid grid grid-cols-3 gap-2 sm:gap-2.5 lg:grid-cols-8">
        {gridProviders.map((item) => {
          const hasCover = Boolean(item.coverSrc);

          const href = item.href || `/slots/${item.id}`;
          const gridClasses = `${cardSurfaceClass} flex aspect-square flex-col overflow-hidden rounded-[var(--radius-panel)] active:scale-[0.98] ${
              hasCover
                ? "bg-[var(--surface-mid)]"
                : `bg-gradient-to-b ${item.bgGradient}`
            }`;

          const gridInner = (
            <>
            {hasCover && item.coverSrc && (
              <Image
                src={item.coverSrc}
                alt=""
                fill
                sizes="(min-width: 768px) 20vw, 33vw"
                className="object-cover"
              />
            )}

            {!hasCover && item.badge && (
              <span className="absolute left-1.5 top-1.5 z-20 rounded bg-[#fde047] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-tight text-black shadow-sm">
                {item.badge}
              </span>
            )}

            {!hasCover && (
            <>
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden p-1.5 sm:p-2"
              aria-hidden="true"
            >
              <GridProviderArt artType={item.artType} />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-1 pb-2 pt-7">
              <div className="flex justify-center text-center">
                <ProviderLogoBrand item={item} />
              </div>
            </div>
            </>
            )}
            </>
          );

          if (onProviderSelect) {
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`${item.name} — สล็อต`}
                onClick={() =>
                  onProviderSelect({
                    id: providerRouteId(item),
                    name: item.name,
                    href,
                  })
                }
                className={gridClasses}
              >
                {gridInner}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={href}
              aria-label={`${item.name} — สล็อต`}
              className={gridClasses}
            >
              {gridInner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
