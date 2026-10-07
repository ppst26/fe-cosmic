"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { CasinoCardItem } from "@/app/types/providers";
import {
  gameCardEnterClassName,
  gameCardEnterListKey,
  gameCardEnterStyle,
} from "@/app/lib/gameCardEnterMotion";

/**
 * คอมโพเนนต์วาดกราฟิกดีลเลอร์และองค์ประกอบของแต่ละเกมคาสิโนสดตามแบบภาพอ้างอิง
 */
function CasinoCardGraphic({ artType }: { artType: string }) {
  switch (artType) {
    case "dealer-green-female":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          {/* แสงออร่าด้านหลัง */}
          <circle cx="50" cy="55" r="40" fill="#34d399" opacity="0.25" filter="blur(10px)" />
          {/* ผมสีน้ำตาลเข้มยาวสลวย */}
          <path d="M26 40 C22 20 78 20 74 40 C78 65 74 85 70 95 C60 95 40 95 30 95 C26 85 22 65 26 40 Z" fill="#2d150b" />
          {/* ลำตัวและชุดสีเขียวมรกต */}
          <path d="M28 80 Q50 68 72 80 L76 110 L24 110 Z" fill="#047857" stroke="#10b981" strokeWidth="1" />
          <path d="M38 72 Q50 82 62 72 L64 90 Q50 96 36 90 Z" fill="#fed7aa" />
          {/* ศีรษะและใบหน้าสวยยิ้มหวาน */}
          <ellipse cx="50" cy="46" rx="15" ry="17" fill="#fed7aa" />
          <ellipse cx="44" cy="44" rx="2" ry="2.5" fill="#1e293b" />
          <ellipse cx="56" cy="44" rx="2" ry="2.5" fill="#1e293b" />
          {/* ริมฝีปากแดงยิ้มสดใส */}
          <path d="M44 54 Q50 60 56 54 Q50 63 44 54 Z" fill="#dc2626" />
        </svg>
      );
    case "dealer-silver-female":
    case "dealer-silver-female-2":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="40" fill="#6ee7b7" opacity="0.2" filter="blur(10px)" />
          {/* โต๊ะแบล็คแจ็คด้านหน้า */}
          <ellipse cx="50" cy="98" rx="44" ry="16" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
          {/* ไพ่บนโต๊ะ */}
          <rect x="36" y="90" width="12" height="15" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
          <rect x="52" y="90" width="12" height="15" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
          {/* ผมน้ำตาลยาว */}
          <path d="M28 35 C24 15 76 15 72 35 C76 65 72 80 68 90 C58 90 42 90 32 90 C28 80 24 65 28 35 Z" fill="#381e11" />
          {/* ชุดเดรสสีเงินเลื่อม */}
          <path d="M30 75 Q50 66 70 75 L74 100 L26 100 Z" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1" />
          <ellipse cx="50" cy="42" rx="14" ry="16" fill="#fed7aa" />
          <ellipse cx="45" cy="40" rx="1.8" ry="2.2" fill="#0f172a" />
          <ellipse cx="55" cy="40" rx="1.8" ry="2.2" fill="#0f172a" />
          <path d="M45 50 Q50 56 55 50 Q50 58 45 50 Z" fill="#e11d48" />
        </svg>
      );
    case "anime-dealer":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          {/* แสงสีฟ้า-ม่วงดิจิทัล */}
          <circle cx="50" cy="55" r="40" fill="#93c5fd" opacity="0.3" filter="blur(12px)" />
          {/* เขาอนิเมะสีส้มทอง */}
          <polygon points="28,26 36,12 40,28" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
          <polygon points="72,26 64,12 60,28" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
          {/* ผมสีน้ำเงินเข้มสะบัดหลายแฉก */}
          <path d="M20 45 C15 25 85 25 80 45 C86 70 78 95 72 100 C58 100 42 100 28 100 C22 95 14 70 20 45 Z" fill="#1e1b4b" />
          {/* ใบหน้าสาวอนิเมะตากลมโตสีฟ้า */}
          <ellipse cx="50" cy="46" rx="16" ry="17" fill="#ffedd5" />
          <ellipse cx="43" cy="44" rx="4" ry="5.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <circle cx="44" cy="42" r="1.5" fill="#ffffff" />
          <ellipse cx="57" cy="44" rx="4" ry="5.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <circle cx="58" cy="42" r="1.5" fill="#ffffff" />
          {/* โช้คเกอร์คอดอกไม้ */}
          <rect x="42" y="66" width="16" height="3" fill="#0f172a" />
          <circle cx="50" cy="67.5" r="2" fill="#ec4899" />
          {/* ไหล่และชุดพาสเทล */}
          <path d="M30 78 Q50 68 70 78 L74 110 L26 110 Z" fill="#93c5fd" />
        </svg>
      );
    case "roulette-wheel-green":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#16a34a" opacity="0.3" filter="blur(8px)" />
          {/* ล้อรูเล็ตสีเขียว Gamdom 3D มุมก้ม */}
          <g transform="translate(50, 52)">
            {/* ขอบนอกล้อรูเล็ตสีเขียวสะท้อนแสง */}
            <ellipse cx="0" cy="0" rx="42" ry="24" fill="#064e3b" stroke="#22c55e" strokeWidth="3" />
            <ellipse cx="0" cy="0" rx="34" ry="19" fill="#0f172a" stroke="#4ade80" strokeWidth="1" />
            {/* ช่องตัวเลขและแกนกลาง */}
            <ellipse cx="0" cy="0" rx="24" ry="13" fill="#065f46" />
            <circle cx="0" cy="0" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            {/* ป้ายโลโก้ Gamdom บนล้อ */}
            <rect x="-18" y="10" width="36" height="12" rx="3" fill="#042f1a" stroke="#22c55e" strokeWidth="1" />
            <circle cx="-11" cy="16" r="3" fill="#22c55e" />
          </g>
        </svg>
      );
    case "dealer-gold-dress":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="50" r="38" fill="#f472b6" opacity="0.3" filter="blur(10px)" />
          {/* ผมบลอนด์/น้ำตาลยาว */}
          <path d="M28 38 C24 16 76 16 72 38 C76 66 70 85 66 95 C56 95 44 95 34 95 C30 85 24 66 28 38 Z" fill="#451a03" />
          {/* มือถือชิปสีทอง */}
          <ellipse cx="32" cy="58" rx="4" ry="7" fill="#fed7aa" transform="rotate(-15 32 58)" />
          <circle cx="33" cy="50" r="3.5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          {/* ชุดเดรสสีแชมเปญทอง */}
          <path d="M30 76 Q50 68 70 76 L74 110 L26 110 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <ellipse cx="50" cy="44" rx="14" ry="16" fill="#fed7aa" />
          <ellipse cx="45" cy="42" rx="1.8" ry="2.2" fill="#1e293b" />
          <ellipse cx="55" cy="42" rx="1.8" ry="2.2" fill="#1e293b" />
          <path d="M45 52 Q50 57 55 52 Q50 59 45 52 Z" fill="#be123c" />
        </svg>
      );
    case "dealer-male-silver":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#fbbf24" opacity="0.25" filter="blur(10px)" />
          {/* ผมชายสีน้ำตาลเซ็ตเป๊ะ */}
          <path d="M34 32 C34 18 66 18 66 32 C66 38 64 42 62 44 C54 40 46 40 38 44 C36 42 34 38 34 32 Z" fill="#1e293b" />
          {/* สูทกั๊กสีเงินและเสื้อเชิ้ตขาวผูกเนคไท */}
          <path d="M26 80 Q50 70 74 80 L78 110 L22 110 Z" fill="#e2e8f0" />
          <path d="M34 80 L50 68 L66 80 L64 110 L36 110 Z" fill="#94a3b8" />
          <polygon points="50,70 47,88 50,92 53,88" fill="#475569" />
          {/* ใบหน้าดีลเลอร์ชายหนวดเคราอ่อนๆ */}
          <ellipse cx="50" cy="44" rx="14" ry="16" fill="#fed7aa" />
          <ellipse cx="44" cy="42" rx="2" ry="1.8" fill="#0f172a" />
          <ellipse cx="56" cy="42" rx="2" ry="1.8" fill="#0f172a" />
          <path d="M45 53 Q50 57 55 53" stroke="#92400e" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "dealer-male-redtux":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#3b82f6" opacity="0.3" filter="blur(10px)" />
          {/* ผมชายสีน้ำตาลเข้ม */}
          <path d="M34 30 C34 16 66 16 66 30 C66 36 64 40 62 42 C54 38 46 38 38 42 C36 40 34 36 34 30 Z" fill="#26150c" />
          {/* สูทกำมะหยี่สีแดงสด (Red Tuxedo) + หูกระต่ายดำ */}
          <path d="M26 78 Q50 68 74 78 L78 110 L22 110 Z" fill="#991b1b" stroke="#ef4444" strokeWidth="1" />
          <polygon points="40,78 50,70 60,78 56,110 44,110" fill="#ffffff" />
          {/* โบว์หูกระต่ายสีดำ */}
          <polygon points="44,76 56,76 50,80" fill="#0f172a" />
          <polygon points="44,84 56,84 50,80" fill="#0f172a" />
          <circle cx="50" cy="80" r="1.5" fill="#e2e8f0" />
          {/* ใบหน้าชายยิ้มหล่อ */}
          <ellipse cx="50" cy="42" rx="14" ry="16" fill="#fed7aa" />
          <ellipse cx="44" cy="40" rx="2" ry="1.8" fill="#0f172a" />
          <ellipse cx="56" cy="40" rx="2" ry="1.8" fill="#0f172a" />
          <path d="M45 51 Q50 56 55 51" stroke="#991b1b" strokeWidth="2" fill="none" />
        </svg>
      );
    case "dealer-red-cheongsam":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#ef4444" opacity="0.3" filter="blur(10px)" />
          {/* มือถือไพ่ K, 9, 6 ทางซ้าย */}
          <g transform="translate(18, 48) rotate(-12) scale(0.65)">
            <rect x="0" y="0" width="16" height="22" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
            <text x="3" y="10" fontSize="8" fontWeight="500" fill="#dc2626">K</text>
            <rect x="8" y="2" width="16" height="22" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
            <text x="11" y="12" fontSize="8" fontWeight="500" fill="#0f172a">9</text>
            <rect x="16" y="5" width="16" height="22" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
            <text x="19" y="15" fontSize="8" fontWeight="500" fill="#dc2626">6</text>
          </g>
          {/* ผมยาวตรงสีน้ำตาลเข้ม */}
          <path d="M28 36 C24 16 76 16 72 36 C76 66 70 85 66 95 C56 95 44 95 34 95 C30 85 24 66 28 36 Z" fill="#1c1917" />
          {/* ชุดกี่เพ้าสีแดงสดคอจีน */}
          <path d="M30 76 Q50 68 70 76 L74 110 L26 110 Z" fill="#b91c1c" stroke="#fca5a5" strokeWidth="1" />
          <path d="M46 72 Q50 76 54 72" stroke="#fde047" strokeWidth="2" fill="none" />
          {/* ใบหน้าสวยหมวยปากแดง */}
          <ellipse cx="50" cy="44" rx="14" ry="16" fill="#fef08a" opacity="0.4" />
          <ellipse cx="50" cy="44" rx="14" ry="16" fill="#fed7aa" />
          <ellipse cx="45" cy="42" rx="1.8" ry="2.2" fill="#0f172a" />
          <ellipse cx="55" cy="42" rx="1.8" ry="2.2" fill="#0f172a" />
          <path d="M44 53 Q50 59 56 53 Q50 62 44 53 Z" fill="#b91c1c" />
        </svg>
      );
    case "lightning-wheel":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#818cf8" opacity="0.3" filter="blur(10px)" />
          {/* สายฟ้าฟาด */}
          <path d="M52 10 L42 45 L54 45 L40 90 L62 48 L48 48 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="50" cy="65" rx="36" ry="18" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      );
    case "crazy-wheel":
    case "candy-wheel":
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="38" fill="#ec4899" opacity="0.3" filter="blur(10px)" />
          {/* วงล้อเกมโชว์หลากสีสัน */}
          <circle cx="50" cy="55" r="32" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2.5" />
          {/* ช่องซี่ล้อสีสัน */}
          <path d="M50 55 L30 30 A32 32 0 0 1 50 23 Z" fill="#f43f5e" />
          <path d="M50 55 L50 23 A32 32 0 0 1 70 30 Z" fill="#38bdf8" />
          <path d="M50 55 L70 30 A32 32 0 0 1 82 55 Z" fill="#fde047" />
          <path d="M50 55 L82 55 A32 32 0 0 1 70 80 Z" fill="#a855f7" />
          <path d="M50 55 L70 80 A32 32 0 0 1 50 87 Z" fill="#10b981" />
          <path d="M50 55 L50 87 A32 32 0 0 1 30 80 Z" fill="#f97316" />
          <path d="M50 55 L30 80 A32 32 0 0 1 18 55 Z" fill="#ec4899" />
          <path d="M50 55 L18 55 A32 32 0 0 1 30 30 Z" fill="#06b6d4" />
          <circle cx="50" cy="55" r="8" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="50" cy="55" r="3" fill="#ffffff" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 110" className="h-full w-full object-contain">
          <circle cx="50" cy="55" r="35" fill="#6366f1" opacity="0.3" filter="blur(8px)" />
          {/* ไพ่คู่และชิปทอง */}
          <rect x="30" y="35" width="22" height="30" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-10 41 50)" />
          <rect x="46" y="32" width="22" height="30" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" transform="rotate(10 57 47)" />
          <circle cx="50" cy="72" r="14" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
        </svg>
      );
  }
}

interface CasinoProviderCardsProps {
  items: CasinoCardItem[];
  totalCount: number;
  /** ซ่อนหัวเมื่อใช้ CategorySectionHead ใน LobbyCategoryProviders */
  hideTitleRow?: boolean;
  sectionTitle?: string;
}

/**
 * คอมโพเนนต์แสดงรายการคาสิโนสดแบบ 3 คอลัมน์ (ตามรูปภาพอ้างอิง)
 * - การ์ดทรงมนมุมแนวตั้ง Aspect Ratio ~3:4.2
 * - ป้ายกำกับ EXCLUSIVE (เขียว) / LIVE (แดง) มุมบนซ้าย
 * - อาร์ตเวิร์กดีลเลอร์/เกมตรงกลาง
 * - ข้อความหัวข้อสีขาวตัวหนา Drop-shadow เด่นชัด และชื่อ Provider ด้านล่าง
 */
export function CasinoProviderCards({
  items,
  totalCount,
  hideTitleRow = false,
  sectionTitle = "คาสิโนสด",
}: CasinoProviderCardsProps) {
  return (
    <div className="space-y-3.5">
      {!hideTitleRow ? (
      <div className="flex items-baseline gap-2 pt-1">
        <h2 className="text-lg font-medium text-white sm:text-xl">
          {sectionTitle}
        </h2>
        <span className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
          ({totalCount} โต๊ะ/ค่ายเกม)
        </span>
      </div>
      ) : null}

      {/* กริดแสดงผล 3 คอลัมน์แนวตั้งตามแบบภาพอ้างอิง */}
      <div
        key={gameCardEnterListKey(items.map((item) => item.id))}
        className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
      >
        {items.map((item, index) => {
          const hasCover = Boolean(item.coverSrc);

          return (
          <Link
            key={item.id}
            href={item.href}
            aria-label={hasCover ? `${item.title} — ${item.provider}` : undefined}
            style={gameCardEnterStyle(index)}
            className={gameCardEnterClassName(
              `group relative flex aspect-[3/4.2] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[var(--radius-thumb)] shadow-md transition-all duration-200 hover:brightness-110 active:scale-[0.98] ${
                hasCover
                  ? "bg-[var(--surface-mid)] p-0"
                  : `bg-gradient-to-b ${item.bgGradient ?? "from-[#1e1b4b] to-[#0f172a]"} p-2 sm:p-2.5`
              }`,
            )}
          >
            {hasCover && item.coverSrc && (
              <Image
                src={item.coverSrc}
                alt=""
                fill
                sizes="(min-width: 768px) 20vw, 33vw"
                className="object-cover"
              />
            )}

            {!hasCover && (
            <>
            {/* 1. แถบป้ายกำกับมุมบนซ้าย (EXCLUSIVE / LIVE) */}
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

            {/* 2. อาร์ตเวิร์กดีลเลอร์/เกมตรงกลาง */}
            <div className="pointer-events-none absolute inset-x-0 bottom-11 top-4 flex items-center justify-center select-none overflow-hidden" aria-hidden="true">
              <CasinoCardGraphic artType={item.artType ?? "default"} />
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
