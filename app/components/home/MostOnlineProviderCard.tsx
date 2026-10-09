"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { Heart, Users } from "lucide-react";
import type { MostOnlineLobbyItem } from "@/app/types/lobby";
import { cn } from "@/lib/utils";
import { useFluctuatingOnlineCount } from "@/app/hooks/useFluctuatingOnlineCount";
import { valueClass } from "@/lib/semanticValue";
import { FlameIcon } from "../ui/Icons";

interface MostOnlineProviderCardProps {
  item: MostOnlineLobbyItem;
  className?: string;
}

/**
 * การ์ดค่ายในแถบออนไลน์มากที่สุด — รูป · ป้าย HOT · โปรด · แถบยอดออนไลน์
 * ถูกเรียกใช้ใน MostOnlineProvidersSection.tsx
 */
export function MostOnlineProviderCard({ item, className }: MostOnlineProviderCardProps) {
  const [favorited, setFavorited] = useState(false);
  const displayCount = useFluctuatingOnlineCount({ id: item.id, onlineCount: item.onlineCount });
  const onlineLabel = displayCount.toLocaleString("en-US");
  const prevCountRef = useRef(displayCount);
  const [countTick, setCountTick] = useState(false);

  useEffect(() => {
    if (prevCountRef.current === displayCount) return;
    prevCountRef.current = displayCount;
    setCountTick(true);
    const timer = window.setTimeout(() => setCountTick(false), 280);
    return () => window.clearTimeout(timer);
  }, [displayCount]);

  return (
    <article
      className={cn(
        "most-online-card group flex min-w-0 flex-col overflow-hidden rounded-sm border border-white/8 bg-[var(--surface-mid)] my-2",
        className,
      )}
    >
      <div className="relative aspect-[4/5] w-full min-h-0 overflow-hidden">
        <Link href={item.href} className="absolute inset-0 z-0 block" aria-label={`${item.brandName} — ${item.tagline}`}>
          <Image
            src={item.coverSrc}
            alt=""
            fill
            sizes="(max-width: 1023px) 33vw, 180px"
            className="object-cover object-center transition duration-200 group-hover:brightness-[1.06]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--surface-deep)]/90 to-transparent"
            aria-hidden
          />
        </Link>

        {item.showHot ? (
          <span
            className="pointer-events-none absolute right-1 top-1 z-10 inline-flex items-center gap-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-elevated)] px-1 py-0.5 text-[8px] font-medium uppercase tracking-wide text-[var(--text-primary)] shadow-sm max-lg:right-1 max-lg:top-1 sm:right-2 sm:top-2 sm:px-1.5 sm:text-[10px]"
          >
            <FlameIcon className="h-2.5 w-2.5 text-[var(--icon-active)] sm:h-3 sm:w-3" aria-hidden />
            HOT
          </span>
        ) : null}

        <button
          type="button"
          className="absolute bottom-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/12 bg-[var(--surface-deep)]/75 text-white/85 transition hover:border-white/25 hover:text-white sm:bottom-2 sm:right-2 sm:h-8 sm:w-8"
          aria-label={favorited ? "เอาออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
          aria-pressed={favorited}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setFavorited((prev) => !prev);
          }}
        >
          <Heart className={cn("h-3 w-3 sm:h-4 sm:w-4", favorited && "fill-[var(--icon-active)] text-[var(--icon-active)]")} />
        </button>
      </div>

      <div className="most-online-card__live-bar flex items-center justify-between gap-2 px-2 py-2 sm:px-2.5 sm:py-2.5">
        <span className="most-online-live-dot" aria-hidden />
        <span className="sr-only">กำลังเล่นอยู่ {onlineLabel} คน</span>
        <span
          className={cn(
            "most-online-card__count-cluster inline-flex min-w-0 items-center gap-1.5 sm:gap-2",
            countTick && "is-tick",
          )}
        >
          <span className="most-online-card__count-icon-wrap" aria-hidden>
            <Users className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} />
          </span>
          <span className={valueClass("success", "most-online-card__count truncate tabular-nums")}>
            {onlineLabel}
          </span>
        </span>
      </div>
    </article>
  );
}
