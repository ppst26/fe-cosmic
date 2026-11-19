"use client";

import React from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import type { HomeLobbyTournamentItem } from "@/app/types/lobby";
import { cn } from "@/lib/utils";

interface ActivityThumbCardProps {
  item: HomeLobbyTournamentItem;
  /** ค่า sizes ของรูป (next/image) */
  sizes: string;
  className?: string;
}

/**
 * การ์ดกิจกรรม/ทายผลหน้าแรก — การ์ดทึบครอบทั้งรูป thumbnail (จัตุรัส) และชื่อกิจกรรมด้านล่าง
 * ใช้ใน JackpotSection (มือถือ) และ TournamentsSection (desktop)
 */
export function ActivityThumbCard({ item, sizes, className }: ActivityThumbCardProps) {
  const body = (
    <>
      <span className="activity-thumb-card__media">
        <Image src={item.imageSrc} alt="" fill sizes={sizes} className="activity-thumb-card__image" />
      </span>
      <span className="activity-thumb-card__title cosmic-type-body">{item.title}</span>
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={item.title}
        className={cn("activity-thumb-card activity-thumb-card--link motion-press", className)}
      >
        {body}
      </Link>
    );
  }

  return (
    <article className={cn("activity-thumb-card", className)} aria-label={item.title}>
      {body}
    </article>
  );
}
