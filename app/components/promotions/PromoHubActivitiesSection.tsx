"use client";

import React from "react";
import { PROMOTIONS_HUB_ACTIVITIES } from "@/app/data/promotionsHubMockData";
import type { PromotionDetailId } from "@/app/data/promotionDetailMockData";
import { ChevronRightIcon } from "../ui/Icons";
import { PromoHubPillLabel, promoCardButtonClass } from "./promoHubCardPrimitives";

type ActivityItem = (typeof PROMOTIONS_HUB_ACTIVITIES)[number];

/**
 * ส่วนกิจกรรมแนวนอน — ใช้ในหน้า /activities (มือถือ)
 */
export function PromoHubActivitiesSection({
  activityItems,
  onOpenDetail,
}: {
  activityItems: ActivityItem[];
  onOpenDetail: (id: PromotionDetailId) => void;
}) {
  return (
    <section aria-labelledby="daily-activities-heading" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            id="daily-activities-heading"
            className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg"
          >
            กิจกรรม ลุ้นสนุกทุกวัน
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)] sm:text-sm">
            เลื่อนดู แล้วเลือกกิจกรรมที่คุณชอบ
          </p>
        </div>
        <ChevronRightIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--icon-default)]" aria-hidden="true" />
      </div>

      <div
        className="-mx-[var(--page-gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--page-gutter)] pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="กิจกรรมรายวัน"
      >
        {activityItems.map((activity) => (
          <ActivityPromoCard key={activity.id} activity={activity} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </section>
  );
}

export function ActivityPromoCard({
  activity,
  onOpenDetail,
}: {
  activity: ActivityItem;
  onOpenDetail: (id: PromotionDetailId) => void;
}) {
  const graphic =
    activity.detailId === "promo-check-in" ? (
      <CheckInActivityGraphic className="h-[100px] w-full max-w-[140px]" />
    ) : (
      <LuckyWheelActivityGraphic className="h-[100px] w-full max-w-[140px]" />
    );

  return (
    <button
      type="button"
      role="listitem"
      className={promoCardButtonClass(
        "flex w-[min(78vw,280px)] shrink-0 snap-start flex-col bg-[var(--surface-mid)]/55",
      )}
      aria-label={`${activity.title} — ${activity.ctaLabel}`}
      onClick={() => onOpenDetail(activity.detailId)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(109,40,217,0.35) 0%, rgba(13,12,34,0.92) 65%)",
        }}
      />
      <div className="relative z-[1] flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
        <div className="mx-auto flex min-h-[100px] w-full items-center justify-center">{graphic}</div>
        <h3 className="mt-2 text-sm font-extrabold text-[var(--text-primary)]">{activity.title}</h3>
        <p className="mt-0.5 text-[11px] text-[var(--text-secondary)] sm:text-xs">{activity.subtitle}</p>
        <div className="mt-auto flex justify-end pt-3">
          <PromoHubPillLabel label={activity.ctaLabel} />
        </div>
      </div>
    </button>
  );
}

function CheckInActivityGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <rect x="40" y="24" width="72" height="64" rx="8" fill="#312e81" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="40" y="24" width="72" height="16" rx="8" fill="#5b21b6" />
      <circle cx="76" cy="58" r="14" fill="#facc15" />
      <path d="M70 58 L74 62 82 52" stroke="#422006" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="98" y="52" width="28" height="28" rx="6" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1.5" />
      <path d="M106 62 h12 M106 68 h8" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LuckyWheelActivityGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <circle cx="80" cy="62" r="38" fill="#4c1d95" stroke="#fde047" strokeWidth="2" />
      <circle cx="80" cy="62" r="6" fill="#fde047" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="80"
          y1="62"
          x2={80 + 38 * Math.cos((deg * Math.PI) / 180)}
          y2={62 + 38 * Math.sin((deg * Math.PI) / 180)}
          stroke="#a78bfa"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="118" cy="38" r="5" fill="#fde047" />
      <circle cx="48" cy="88" r="4" fill="#facc15" />
      <rect x="118" y="72" width="22" height="22" rx="4" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1" />
    </svg>
  );
}
