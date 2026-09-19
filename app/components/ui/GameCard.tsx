import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GameItem } from "../../types/lobby";

interface GameCardProps {
  game: GameItem;
}

/**
 * GameCard — ภาพปกมุมโค้ง aspect 3/4 ที่กดได้ ไม่ซ้อนกรอบ card อีกชั้น (design.md หมวด 7)
 * ถ้ามี coverSrc ใช้ภาพจริง (lazy) — ถ้าไม่มี แสดง placeholder ที่สื่อชนิดข้อมูล: ค่าย + ชื่อเกม
 * ถูกเรียกใช้โดย GameSection.tsx
 */
export function GameCard({ game }: GameCardProps) {
  const { title, provider, href, coverSrc, coverTone = "indigo", badge } = game;

  return (
    <Link
      href={href}
      aria-label={`${title} — ${provider}`}
      className="group relative block aspect-[3/4] w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] bg-[var(--surface-mid)] transition-[filter] duration-[var(--motion-fast)] hover:brightness-110"
    >
      {coverSrc ? (
        <Image
          src={coverSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 11vw, (min-width: 768px) 18vw, 33vw"
          className="object-cover"
        />
      ) : (
        // Placeholder ปกเกม: ชื่อค่ายด้านบน ชื่อเกมกลางภาพ
        <div
          className={`cover-tone-${coverTone} flex h-full w-full flex-col items-center px-2.5 pt-2.5 pb-3 text-center text-white`}
          aria-hidden="true"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-white/80 line-clamp-1">
            {provider}
          </span>
          <span className="mt-2.5 text-base font-medium uppercase leading-[1.1] tracking-tight sm:text-lg line-clamp-3">
            {title}
          </span>
        </div>
      )}

      {/* ป้าย EXCLUSIVE ฯลฯ ด้านล่างกลางการ์ด */}
      {badge && (
        <span
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-[var(--radius-control)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-[var(--surface-end)]"
          style={{ background: "var(--gold-gradient)" }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
