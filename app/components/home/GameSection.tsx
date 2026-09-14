import React from "react";
import { GameSectionData } from "../../types/lobby";
import { Carousel } from "../ui/Carousel";
import { GameCard } from "../ui/GameCard";
import { SectionIcon } from "../ui/SectionIcon";

interface GameSectionProps {
  section: GameSectionData;
  className?: string;
}

/**
 * GameSection — แถวเกมหนึ่งหมวด (เกมยอดฮิต / SLOTS / คาสิโน / ยิงปลา / กีฬา)
 * SectionHeader + View All + arrows และ carousel การ์ดเกม 3 ใบต่อแถวบนมือถือ
 * Render จาก GAME_SECTIONS_DATA ใน app/page.tsx — ไม่คัดลอก markup ทีละหมวด
 */
export function GameSection({ section, className = "mt-6 sm:mt-8" }: GameSectionProps) {
  const { id, title, icon, viewAllHref, games } = section;

  return (
    <Carousel
      title={title}
      icon={<SectionIcon id={icon} className="h-6 w-6 text-[var(--icon-default)]" />}
      viewAllHref={viewAllHref}
      trackClassName="carousel-games"
      className={className}
      isEmpty={games.length === 0}
      emptyMessage="ยังไม่มีเกมในหมวดนี้"
    >
      {games.map((game) => (
        <GameCard key={`${id}-${game.id}`} game={game} />
      ))}
    </Carousel>
  );
}
