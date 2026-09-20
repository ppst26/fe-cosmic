"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { LobbyTournamentSectionItem } from "@/app/types/lobby";
import { MenuItemIcon } from "../layout/MenuItemIcon";
import { SectionHeader } from "../ui/SectionHeader";

interface TournamentsSectionProps {
  items: LobbyTournamentSectionItem[];
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * กิจกรรม — carousel การ์ดรูปเต็ม (หลัง Hall of Fame)
 * ข้อความอยู่ในไฟล์ภาพ public/tournament แล้ว ไม่ทับหัวข้อซ้ำ
 * ถูกเรียกใช้ใน HomeLobbyPage
 */
export function TournamentsSection({
  items,
  title = "กิจกรรม",
  viewAllHref = "/event",
  viewAllLabel = "See all",
}: TournamentsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="tournaments-section mt-10 w-full min-w-0 sm:mt-12"
      aria-labelledby="lobby-tournaments-section-title"
    >
      <SectionHeader
        icon={<MenuItemIcon iconId="activities" className="h-6 w-6 text-[var(--icon-default)]" />}
        title={title}
        titleId="lobby-tournaments-section-title"
        actionContent={
          <Link href={viewAllHref} className="glass-control glass-pill tournaments-section__view-all">
            {viewAllLabel}
            <span className="tournaments-section__view-all-chevron" aria-hidden="true">›</span>
          </Link>
        }
      />

      <div className="carousel-track carousel-tournaments-feature">
        {items.map((item) => {
          const image = (
            <Image
              src={item.imageSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 88vw"
              className="tournament-feature-card__image object-cover object-center"
              priority={item.id === items[0]?.id}
            />
          );

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="tournament-feature-card tournament-feature-card__link"
                aria-label={`${item.brandLabel}: ${item.description}`}
              >
                {image}
              </Link>
            );
          }

          return (
            <article key={item.id} className="tournament-feature-card" aria-label={item.brandLabel}>
              {image}
            </article>
          );
        })}
      </div>
    </section>
  );
}
