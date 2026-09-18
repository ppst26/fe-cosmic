import React from "react";
import { GameSectionData } from "../../types/lobby";
import { HOME_LOBBY_GAME_CAROUSEL_MAX } from "../../data/lobbyMockData";
import { Carousel } from "../ui/Carousel";
import { GameCard } from "../ui/GameCard";
import { SectionIcon } from "../ui/SectionIcon";

interface GameSectionProps {
  section: GameSectionData;
  className?: string;
}

/**
 * GameSection — แถวเกมหนึ่งหมวด (เกมยอดฮิต / SLOTS / คาสิโน / ยิงปลา / กีฬา)
 * SectionHeader + View All + arrows — desktop (lg+): 7 ใบต่อแถว
 * Render จาก GAME_SECTIONS_DATA ใน app/page.tsx — ไม่คัดลอก markup ทีละหมวด
 */
export function GameSection({ section, className = "mt-6 sm:mt-8" }: GameSectionProps) {
  const { id, title, icon, viewAllHref, games } = section;
  const carouselGames = games.slice(0, HOME_LOBBY_GAME_CAROUSEL_MAX);

  return (
    <Carousel
      title={title}
      icon={<SectionIcon id={icon} className="h-6 w-6 text-[var(--icon-default)]" />}
      viewAllHref={viewAllHref}
      trackClassName="carousel-games"
      className={className}
      isEmpty={carouselGames.length === 0}
      emptyMessage="ยังไม่มีเกมในหมวดนี้"
    >
      {carouselGames.map((game) => (
        <GameCard key={`${id}-${game.id}`} game={game} />
      ))}
    </Carousel>
  );
}
