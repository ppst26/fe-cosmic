"use client";

import React, { useState } from "react";
import { ProviderGameItem } from "../../data/providerGamesData";

interface ProviderGameGridProps {
  games: ProviderGameItem[];
  onPlayGame?: (game: ProviderGameItem) => void;
}

/**
 * ไอคอนหัวใจสำหรับปุ่มบันทึกรายการโปรด (Wishlist)
 */
function HeartIcon({ isFilled, className = "w-3.5 h-3.5" }: { isFilled?: boolean; className?: string }) {
  if (isFilled) {
    return (
      <svg viewBox="0 0 24 24" fill="#f43f5e" className={className} aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/**
 * วาดอาร์ตเวิร์ก Thumbnail ของแต่ละเกมตาม artType
 */
function GameThumbnailArtwork({ game }: { game: ProviderGameItem }) {
  const { artType, accentColor } = game;

  switch (artType) {
    case "zeus":
    case "zeus-1000":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#2e1d52] via-[#1c1038] to-[#0d071d]">
          {/* วิหารและสายฟ้า */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_20%,#fbbf24_0%,transparent_60%)]" />
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* เสาวิหารกรีก */}
            <rect x="10" y="20" width="8" height="60" rx="1" fill="#706897" opacity="0.5" />
            <rect x="82" y="20" width="8" height="60" rx="1" fill="#706897" opacity="0.5" />
            {/* ซุสและสายฟ้า */}
            <circle cx="50" cy="40" r="22" fill="#4338ca" stroke="#818cf8" strokeWidth="1.5" />
            {/* เคราและผมขาว */}
            <path d="M36 40 C36 60 64 60 64 40 Z" fill="#f8fafc" />
            <ellipse cx="50" cy="36" rx="10" ry="8" fill="#fcd34d" opacity="0.7" />
            {/* มงกุฎลอเรลทอง */}
            <path d="M40 28 C45 22 55 22 60 28" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            {/* สายฟ้าในมือ */}
            <path d="M22 65 L32 45 L26 45 L36 25" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* ป้ายชื่อทอง */}
            <rect x="15" y="72" width="70" height="18" rx="3" fill="#1e1b4b" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="500" letterSpacing="0.5">
              GATES OF OLYMPUS
            </text>
          </svg>
          {game.badge && (
            <div className="absolute bottom-1 right-1 rounded bg-gradient-to-r from-amber-500 to-yellow-400 px-1 py-0.5 text-[8px] font-medium text-black shadow">
              {game.badge}
            </div>
          )}
        </div>
      );

    case "candy":
    case "candy-1000":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#61163e] via-[#3d0d26] to-[#1f0513]">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_30%,#f43f5e_0%,transparent_70%)]" />
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* อมยิ้มหัวใจสีแดงชมพู */}
            <circle cx="50" cy="40" r="24" fill="#e11d48" stroke="#fecdd3" strokeWidth="2" />
            <path d="M38 32 C42 24 58 24 62 32 C66 42 50 56 50 56 C50 56 34 42 38 32 Z" fill="#ffffff" opacity="0.9" />
            <circle cx="28" cy="55" r="8" fill="#10b981" />
            <circle cx="72" cy="52" r="9" fill="#3b82f6" />
            <circle cx="35" cy="22" r="6" fill="#f59e0b" />
            {/* ป้าย Sweet Bonanza */}
            <rect x="12" y="70" width="76" height="20" rx="4" fill="#831843" stroke="#f472b6" strokeWidth="1.5" />
            <text x="50" y="83" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="500" fontStyle="italic">
              SWEET BONANZA
            </text>
          </svg>
          {game.badge && (
            <div className="absolute bottom-1 right-1 rounded bg-gradient-to-r from-pink-500 to-rose-400 px-1 py-0.5 text-[8px] font-medium text-white shadow">
              {game.badge}
            </div>
          )}
        </div>
      );

    case "dog":
    case "dog-megaways":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#3b2410] via-[#241508] to-[#120a03]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* หลังคาบ้านสุนัข */}
            <polygon points="50,15 85,42 15,42" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            {/* สุนัขน่ารัก 2 ตัว */}
            <circle cx="36" cy="52" r="14" fill="#d97706" />
            <circle cx="32" cy="48" r="2.5" fill="#000" />
            <circle cx="40" cy="48" r="2.5" fill="#000" />
            <ellipse cx="36" cy="54" rx="4" ry="3" fill="#451a03" />

            <circle cx="64" cy="50" r="13" fill="#a16207" />
            <circle cx="60" cy="47" r="2" fill="#000" />
            <circle cx="68" cy="47" r="2" fill="#000" />
            {/* ป้ายชื่อกระดูก */}
            <rect x="14" y="72" width="72" height="18" rx="4" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="500">
              THE DOG HOUSE
            </text>
          </svg>
          {game.badge && (
            <div className="absolute top-1 left-1 rounded bg-gradient-to-r from-amber-600 to-orange-500 px-1 py-0.2 text-[7.5px] font-medium text-white shadow">
              {game.badge}
            </div>
          )}
        </div>
      );

    case "bass":
    case "bass-splash":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#083042] via-[#051c27] to-[#020d13]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* คลื่นน้ำฟองอากาศ */}
            <circle cx="20" cy="30" r="12" fill="#38bdf8" opacity="0.2" />
            <circle cx="80" cy="25" r="15" fill="#38bdf8" opacity="0.25" />
            {/* ปลากระพงยักษ์กระโดดเหนือน้ำ */}
            <path d="M25 55 C35 30 65 30 75 45 C70 55 50 65 35 60 Z" fill="#15803d" stroke="#86efac" strokeWidth="1.5" />
            <circle cx="68" cy="42" r="3" fill="#fde047" />
            <circle cx="69" cy="42" r="1.5" fill="#000" />
            {/* ครีบปลา */}
            <polygon points="50,32 60,24 55,36" fill="#16a34a" />
            <polygon points="25,55 15,48 18,62" fill="#166534" />
            {/* ละอองน้ำกระเซ็น */}
            <path d="M25 65 Q50 60 75 68" stroke="#bae6fd" strokeWidth="2" fill="none" />
            {/* ป้าย Big Bass */}
            <rect x="12" y="72" width="76" height="18" rx="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="500" fontStyle="italic">
              BIG BASS BONANZA
            </text>
          </svg>
        </div>
      );

    case "gumball":
    case "gumball-1000":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#56145f] via-[#350b3a] to-[#19041c]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* โถลูกอมหลากสี */}
            <circle cx="50" cy="40" r="22" fill="#fdf4ff" opacity="0.25" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="44" cy="35" r="5" fill="#ef4444" />
            <circle cx="56" cy="34" r="5" fill="#3b82f6" />
            <circle cx="48" cy="45" r="5.5" fill="#eab308" />
            <circle cx="58" cy="44" r="4.5" fill="#10b981" />
            {/* ฐานตู้หยอดเหรียญสีชมพู */}
            <rect x="35" y="58" width="30" height="14" rx="2" fill="#be185d" />
            {/* ป้าย Sugar Rush */}
            <rect x="12" y="72" width="76" height="18" rx="4" fill="#a21caf" stroke="#f472b6" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="500">
              SUGAR RUSH
            </text>
          </svg>
          {game.badge && (
            <div className="absolute bottom-1 right-1 rounded bg-gradient-to-r from-fuchsia-500 to-pink-500 px-1 py-0.5 text-[8px] font-medium text-white shadow">
              {game.badge}
            </div>
          )}
        </div>
      );

    case "princess":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#172554] via-[#0f172a] to-[#080b14]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* ดาวและประกายเวทมนตร์ */}
            <circle cx="50" cy="35" r="24" fill="#60a5fa" opacity="0.25" />
            {/* เจ้าหญิงผมแดงมงกุฎทอง */}
            <circle cx="50" cy="36" r="15" fill="#fed7aa" />
            <path d="M35 28 Q50 18 65 28 C65 50 62 55 58 55 C52 48 48 48 42 55 C38 55 35 50 35 28 Z" fill="#dc2626" />
            {/* มงกุฎคทาดาว */}
            <polygon points="50,16 54,23 60,20 56,26 50,23" fill="#facc15" />
            <path d="M72 45 L78 30 L84 45 Z" fill="#38bdf8" />
            {/* ป้าย Starlight Princess */}
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#e0f2fe" fontSize="7.5" fontWeight="500">
              STARLIGHT PRINCESS
            </text>
          </svg>
        </div>
      );

    case "cowboy":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#422006] via-[#291304] to-[#140801]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* หมวกคาวบอยปีกกว้าง */}
            <ellipse cx="50" cy="35" rx="30" ry="10" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <path d="M36 34 C36 20 64 20 64 34 Z" fill="#92400e" />
            {/* หน้าคาวบอยและผ้าพันคอ */}
            <circle cx="50" cy="45" r="12" fill="#fdba74" />
            <polygon points="50,56 42,66 58,66" fill="#dc2626" />
            {/* ปืนลูกโม่คู่ */}
            <rect x="18" y="72" width="64" height="18" rx="3" fill="#713f12" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="500">
              WILD WEST GOLD
            </text>
          </svg>
        </div>
      );

    case "fruit":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#14532d] via-[#052e16] to-[#02150a]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            {/* ผลไม้หลากสี: ส้ม สตรอว์เบอร์รี องุ่น */}
            <circle cx="35" cy="38" r="14" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
            <circle cx="65" cy="38" r="12" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1" />
            <circle cx="50" cy="52" r="15" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
            <rect x="12" y="72" width="76" height="18" rx="4" fill="#15803d" stroke="#4ade80" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="500">
              FRUIT PARTY
            </text>
          </svg>
        </div>
      );

    case "bass-splash":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#083042] via-[#051c27] to-[#020d13]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <circle cx="80" cy="25" r="15" fill="#38bdf8" opacity="0.25" />
            <path d="M25 55 C35 30 65 30 75 45 C70 55 50 65 35 60 Z" fill="#eab308" stroke="#fef08a" strokeWidth="1.5" />
            <circle cx="68" cy="42" r="3" fill="#fde047" />
            <circle cx="69" cy="42" r="1.5" fill="#000" />
            <polygon points="50,32 60,24 55,36" fill="#ca8a04" />
            <path d="M20 65 Q50 55 80 65" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="500" fontStyle="italic">
              BIG BASS SPLASH
            </text>
          </svg>
        </div>
      );

    case "athena":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#451a03] via-[#290e02] to-[#140601]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <circle cx="50" cy="40" r="22" fill="#78350f" opacity="0.4" />
            <path d="M35 38 C35 22 65 22 65 38 C65 52 50 56 50 56 C50 56 35 52 35 38 Z" fill="#d97706" stroke="#fde047" strokeWidth="1.5" />
            <path d="M48 14 C48 10 52 10 52 14 L54 28 L46 28 Z" fill="#dc2626" />
            <ellipse cx="50" cy="40" rx="8" ry="7" fill="#fed7aa" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#9a3412" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="7" fontWeight="500">
              WISDOM OF ATHENA
            </text>
          </svg>
        </div>
      );

    case "thor":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#1e3a5f] via-[#10223b] to-[#08111f]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <rect x="42" y="24" width="16" height="24" rx="2" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="48" y="48" width="4" height="20" fill="#78350f" />
            <path d="M20 30 L42 36 M80 30 L58 36" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="50,15 54,22 60,18" fill="#3b82f6" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#67e8f9" fontSize="7" fontWeight="500">
              POWER OF THOR
            </text>
          </svg>
          {game.badge && (
            <div className="absolute top-1 left-1 rounded bg-gradient-to-r from-blue-600 to-cyan-500 px-1 py-0.2 text-[7px] font-medium text-white shadow">
              {game.badge}
            </div>
          )}
        </div>
      );

    case "aztec":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#364210] via-[#202909] to-[#0f1404]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <circle cx="50" cy="40" r="24" fill="#ca8a04" stroke="#fde047" strokeWidth="2" />
            <circle cx="42" cy="36" r="4" fill="#15803d" />
            <circle cx="58" cy="36" r="4" fill="#15803d" />
            <path d="M38 48 Q50 56 62 48" stroke="#713f12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <polygon points="50,12 54,16 46,16" fill="#fde047" />
            <polygon points="22,40 26,44 26,36" fill="#fde047" />
            <polygon points="78,40 74,44 74,36" fill="#fde047" />
            <rect x="12" y="72" width="76" height="18" rx="3" fill="#14532d" stroke="#facc15" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="500">
              AZTEC GEMS
            </text>
          </svg>
        </div>
      );

    case "madame":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#3b0f54] via-[#240833] to-[#12041a]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <circle cx="50" cy="42" r="20" fill="#a855f7" opacity="0.8" stroke="#e9d5ff" strokeWidth="2" />
            <circle cx="45" cy="38" r="6" fill="#ffffff" opacity="0.6" />
            <path d="M38 60 L62 60 L56 68 L44 68 Z" fill="#d97706" />
            <circle cx="50" cy="42" r="30" fill="#c084fc" opacity="0.15" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#f5d0fe" fontSize="7.5" fontWeight="500">
              MADAME DESTINY
            </text>
          </svg>
        </div>
      );

    case "lion":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#4d240a] via-[#2e1405] to-[#170802]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <circle cx="50" cy="40" r="22" fill="#d97706" stroke="#fde047" strokeWidth="2" />
            <circle cx="40" cy="36" r="3.5" fill="#dc2626" />
            <circle cx="60" cy="36" r="3.5" fill="#dc2626" />
            <ellipse cx="50" cy="46" rx="8" ry="5" fill="#92400e" />
            <path d="M28 40 Q24 25 36 26 Q42 16 50 20 Q58 16 64 26 Q76 25 72 40" stroke="#fde047" strokeWidth="2" fill="none" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#78350f" stroke="#fde047" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="7" fontWeight="500">
              5 LIONS MEGAWAYS
            </text>
          </svg>
          {game.badge && (
            <div className="absolute top-1 left-1 rounded bg-amber-500 px-1 py-0.2 text-[7px] font-medium text-black shadow">
              {game.badge}
            </div>
          )}
        </div>
      );

    case "dragon":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#0c2e47] via-[#071d2e] to-[#030e17]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <path d="M25 50 Q40 20 60 35 Q80 50 65 65 Q45 55 35 60 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="34" cy="46" r="3" fill="#fde047" />
            <path d="M26 44 Q18 40 16 48" stroke="#fbbf24" strokeWidth="2" fill="none" />
            <circle cx="75" cy="38" r="6" fill="#f59e0b" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="500">
              FLOATING DRAGON
            </text>
          </svg>
        </div>
      );

    case "midas":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#422d08] via-[#291b04] to-[#140d02]">
          <svg viewBox="0 0 100 100" className="h-full w-full object-cover">
            <polygon points="32,26 40,36 50,22 60,36 68,26 68,40 32,40" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="50" cy="46" r="14" fill="#fed7aa" />
            <path d="M38 48 C38 64 62 64 62 48 Z" fill="#eab308" />
            <rect x="10" y="72" width="80" height="18" rx="3" fill="#713f12" stroke="#fde047" strokeWidth="1.5" />
            <text x="50" y="84" textAnchor="middle" fill="#fef08a" fontSize="7" fontWeight="500">
              THE HAND OF MIDAS
            </text>
          </svg>
        </div>
      );
      return (
        <div
          className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b ${game.bgGradient}`}
        >
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-2xl drop-shadow" style={{ color: accentColor }}>
              🎰
            </span>
            <span className="mt-1 line-clamp-2 text-[9px] font-medium text-white drop-shadow">
              {game.title}
            </span>
          </div>
          {game.badge && (
            <div className="absolute top-1 left-1 rounded bg-amber-500 px-1 py-0.5 text-[7px] font-medium text-black shadow">
              {game.badge}
            </div>
          )}
        </div>
      );
  }
}

/**
 * กริดเกมค่าย — 4 คอลัมน์มือถือ · 8 คอลัมน์ desktop (LobbySlotProviderView, /slots/[provider])
 * ภาพ Thumbnail คมชัด, ปุ่มหัวใจมุมขวาบน, ชื่อเกมสีขาวด้านล่าง
 */
export function ProviderGameGrid({
  games,
  onPlayGame,
}: ProviderGameGridProps) {
  // ติดตามสถานะ favorite ของแต่ละเกม
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    games.forEach((g) => {
      if (g.isFavorite) initial[g.id] = true;
    });
    return initial;
  });

  const toggleFavorite = (gameId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [gameId]: !prev[gameId],
    }));
  };

  if (games.length === 0) {
    return (
      <div className="my-12 flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#121127] text-2xl text-[var(--text-muted)]">
          🔍
        </div>
        <h3 className="mt-3 text-base font-medium text-white">ไม่พบเกมที่ค้นหา</h3>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          ลองค้นหาด้วยคำค้นอื่น หรือล้างช่องค้นหาเพื่อดูเกมทั้งหมด
        </p>
      </div>
    );
  }

  return (
    <div className="my-4">
      {/* กริด 4 คอลัมน์บนมือถือ ตามภาพตัวอย่าง */}
      <div className="provider-game-grid grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
        {games.map((game) => {
          const isFav = !!favorites[game.id];

          return (
            <div
              key={game.id}
              className="group flex flex-col cursor-pointer select-none transition-transform duration-150 active:scale-95"
              onClick={() => onPlayGame?.(game)}
            >
              {/* 1. Thumbnail Card (สี่เหลี่ยมจัตุรัสขอบมน borderless) */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-panel)] bg-[#121127] shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:brightness-110 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                {/* ภาพ Thumbnail อาร์ตเวิร์ก */}
                <GameThumbnailArtwork game={game} />

                {/* ปุ่มหัวใจ Favorite มุมขวาบน */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(game.id, e)}
                  aria-label={isFav ? "นำออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}
                  className="absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-xs transition-all hover:bg-black/60 hover:text-white active:scale-90 sm:h-6 sm:w-6"
                >
                  <HeartIcon isFilled={isFav} className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 2. ชื่อเกมด้านล่าง */}
              <p className="mt-1.5 line-clamp-2 min-h-[28px] text-[10px] sm:text-[11.5px] font-medium tracking-tight text-[var(--text-primary)] text-center leading-tight transition-colors group-hover:text-white">
                {game.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
