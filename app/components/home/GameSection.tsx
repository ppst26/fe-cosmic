import React from "react";
import { GameSectionData } from "../../types/lobby";
import { Carousel } from "../ui/Carousel";
import { GameCard } from "../ui/GameCard";
import { SectionIcon } from "../ui/SectionIcon";
import MotionReveal from "../ui/MotionReveal";
import { HOME_LOBBY_GAME_CAROUSEL_MAX } from "@/lib/uiConstants";

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
  const { id, title, icon, viewAllHref, games, carouselMax } = section;
  const limit = carouselMax ?? HOME_LOBBY_GAME_CAROUSEL_MAX;
  const carouselGames = games.slice(0, limit);

  return (
    <MotionReveal>
    <Carousel
      title={title}
      icon={<SectionIcon id={icon} className="h-[1.35rem] w-[1.35rem] text-[var(--icon-default)] sm:h-6 sm:w-6" />}
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
    </MotionReveal>
  );
}
