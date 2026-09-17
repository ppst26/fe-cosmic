"use client";

import React, { useState } from "react";
import {
  PROMOTIONS_HUB_ACTIVITIES,
  PROMOTIONS_HUB_FEATURED,
  PROMOTIONS_HUB_HERO,
  type PromoHubFeaturedItem,
} from "@/app/data/promotionsHubMockData";
import type { PromotionDetailId } from "@/app/data/promotionDetailMockData";
import { PromotionDetailModal } from "./PromotionDetailModal";
import { ChevronRightIcon } from "../ui/Icons";

/**
 * เนื้อหาหน้าโปรโมชั่นและกิจกรรม — ใช้ใน /promotions
 */
export function PromotionsHubPageContent() {
  const [detailId, setDetailId] = useState<PromotionDetailId | null>(null);

  const openDetail = (id: PromotionDetailId) => setDetailId(id);
  const closeDetail = () => setDetailId(null);

  return (
    <>
      <div className="flex flex-col gap-5 pb-4">
        <PromoHubHeroBanner hero={PROMOTIONS_HUB_HERO} onOpenDetail={openDetail} />

        <section aria-labelledby="promo-for-you-heading" className="flex flex-col gap-3">
          <h2 id="promo-for-you-heading" className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">
            โปรโมชั่นสำหรับคุณ
          </h2>
          <ul className="flex flex-col gap-3">
            {PROMOTIONS_HUB_FEATURED.map((item) => (
              <li key={item.id}>
                <FeaturedPromoCard item={item} onOpenDetail={openDetail} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="daily-activities-heading" className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 id="daily-activities-heading" className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">
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
            {PROMOTIONS_HUB_ACTIVITIES.map((activity) => (
              <ActivityPromoCard key={activity.id} activity={activity} onOpenDetail={openDetail} />
            ))}
          </div>
        </section>
      </div>

      <PromotionDetailModal detailId={detailId} onClose={closeDetail} />
    </>
  );
}

function PromoHubPillLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1a1240]/80 px-3 py-1.5 text-[11px] font-bold text-[var(--text-primary)] sm:text-xs">
      {label}
      <ChevronRightIcon className="h-3.5 w-3.5" />
    </span>
  );
}

function promoCardButtonClass(extra?: string) {
  return [
    "cosmic-inset-card relative w-full overflow-hidden text-left transition-colors",
    "cursor-pointer hover:bg-[var(--surface-selected)]/15 active:scale-[0.995]",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function PromoHubHeroBanner({
  hero,
  onOpenDetail,
}: {
  hero: typeof PROMOTIONS_HUB_HERO;
  onOpenDetail: (id: PromotionDetailId) => void;
}) {
  return (
    <button
      type="button"
      className={promoCardButtonClass("min-h-[168px] sm:min-h-[188px] bg-[var(--surface-mid)]/40")}
      aria-label={`${hero.title} — ${hero.ctaLabel}`}
      onClick={() => onOpenDetail(hero.detailId)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 75% 35%, rgba(124,58,237,0.45) 0%, rgba(30,27,75,0.9) 45%, rgba(9,11,24,1) 100%)",
        }}
      />
      <div className="relative z-[1] flex h-full min-h-[168px] items-stretch sm:min-h-[188px]">
        <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-5 sm:py-5">
          <h1 className="text-lg font-extrabold leading-snug text-[var(--text-primary)] drop-shadow-sm sm:text-xl">
            {hero.title}
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">{hero.subtitle}</p>
          <div className="mt-3">
            <PromoHubPillLabel label={hero.ctaLabel} />
          </div>
        </div>
        <PromoHeroCharacterGraphic className="pointer-events-none w-[42%] max-w-[160px] shrink-0 self-end sm:max-w-[190px]" />
      </div>
    </button>
  );
}

function FeaturedPromoCard({
  item,
  onOpenDetail,
}: {
  item: PromoHubFeaturedItem;
  onOpenDetail: (id: PromotionDetailId) => void;
}) {
  const graphic = featuredGraphicForDetail(item.detailId);

  return (
    <button
      type="button"
      className={promoCardButtonClass("bg-[var(--surface-mid)]/50")}
      aria-label={`${item.title} — ${item.ctaLabel}`}
      onClick={() => onOpenDetail(item.detailId)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(105deg, rgba(13,12,34,0.95) 0%, rgba(13,12,34,0.75) 55%, rgba(76,29,149,0.25) 100%)",
        }}
      />
      <div className="relative z-[1] flex items-center gap-2 px-3 py-3.5 sm:gap-3 sm:px-4 sm:py-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold leading-snug text-[var(--text-primary)] sm:text-base">{item.title}</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-secondary)] sm:text-xs">{item.subtitle}</p>
          <div className="mt-2.5">
            <PromoHubPillLabel label={item.ctaLabel} />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end pr-0.5">{graphic}</div>
      </div>
    </button>
  );
}

function featuredGraphicForDetail(detailId: PromotionDetailId) {
  if (detailId === "promo-cashback") {
    return <CashbackCoinGraphic className="h-[88px] w-[88px] sm:h-[96px] sm:w-[96px]" />;
  }
  if (detailId === "promo-refer-friends") {
    return <ReferralMegaphoneGraphic className="h-[88px] w-[88px] sm:h-[96px] sm:w-[96px]" />;
  }
  return <VipShieldGraphic className="h-[88px] w-[88px] sm:h-[96px] sm:w-[96px]" />;
}

function ActivityPromoCard({
  activity,
  onOpenDetail,
}: {
  activity: (typeof PROMOTIONS_HUB_ACTIVITIES)[number];
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

function PromoHeroCharacterGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="promoHeroGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="180" rx="70" ry="18" fill="#000" opacity="0.35" />
      <circle cx="130" cy="90" r="55" fill="url(#promoHeroGlow)" />
      <circle cx="105" cy="72" r="28" fill="#fecdd3" />
      <path d="M78 68 Q105 42 132 68 Q128 95 105 98 Q82 95 78 68 Z" fill="#1e1b4b" />
      <path d="M88 58 Q105 48 122 58" stroke="#f472b6" strokeWidth="4" fill="none" />
      <ellipse cx="96" cy="72" rx="4" ry="5" fill="#881337" />
      <ellipse cx="114" cy="72" rx="4" ry="5" fill="#881337" />
      <path d="M78 95 L132 95 L125 175 L85 175 Z" fill="#312e81" />
      <path d="M85 110 L125 110 L118 140 L92 140 Z" fill="#7c3aed" opacity="0.85" />
      <circle cx="145" cy="55" r="8" fill="#facc15" opacity="0.9" />
      <circle cx="160" cy="75" r="6" fill="#a78bfa" opacity="0.8" />
      <circle cx="155" cy="100" r="5" fill="#fde047" opacity="0.75" />
    </svg>
  );
}

function CashbackCoinGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <circle cx="48" cy="48" r="36" fill="none" stroke="#7c3aed" strokeWidth="3" opacity="0.5" strokeDasharray="8 6" />
      <path
        d="M48 12 A36 36 0 0 1 84 48"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M48 84 A36 36 0 0 1 12 48"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="48" cy="48" r="22" fill="url(#cashCoinGrad)" stroke="#fde047" strokeWidth="2" />
      <path d="M48 38 L51 46 59 46 53 51 55 59 48 54 41 59 43 51 37 46 45 46 Z" fill="#92400e" />
      <defs>
        <linearGradient id="cashCoinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ReferralMegaphoneGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M18 40 L48 28 L48 68 L18 56 Z" fill="#6d28d9" stroke="#c4b5fd" strokeWidth="1.5" />
      <path d="M48 32 L72 22 L72 74 L48 64 Z" fill="#7c3aed" />
      <rect x="12" y="44" width="8" height="8" rx="2" fill="#a78bfa" />
      <circle cx="78" cy="32" r="6" fill="#fde047" />
      <circle cx="82" cy="52" r="5" fill="#facc15" />
      <circle cx="70" cy="62" r="4" fill="#fde047" opacity="0.85" />
      <circle cx="62" cy="38" r="7" fill="#312e81" stroke="#c4b5fd" strokeWidth="1.5" />
      <circle cx="62" cy="35" r="3" fill="#fecdd3" />
    </svg>
  );
}

function VipShieldGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M48 14 L76 26 V48 C76 64 48 82 48 82 C48 82 20 64 20 48 V26 Z" fill="url(#vipShield)" stroke="#fde047" strokeWidth="2" />
      <path d="M42 48 L46 52 L54 42" stroke="#422006" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 34 L48 28 L52 34 L48 38 Z" fill="#fde047" />
      <path d="M10 78 L48 88 L86 78 L48 92 Z" fill="#1e1b4b" opacity="0.6" />
      <defs>
        <linearGradient id="vipShield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
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
