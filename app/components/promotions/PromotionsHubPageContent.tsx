"use client";

import React, { useMemo, useState } from "react";
import Link from "@/lib/i18n/navigation";
import { matchesPromoHubCategory } from "@/lib/promotions/promotionFilters";
import type {
  PromoHubCategoryFilterId,
  PromoHubFeaturedItem,
  PromoHubHero,
  PromotionDetailId,
} from "@/app/types/promotions";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";
import { PromotionsMobileFeed } from "./PromotionsMobileFeed";
import { PromoHubDesktopMasterDetail } from "./PromoHubDesktopMasterDetail";
import { PromotionsCatalogProvider, usePromotionsCatalog } from "./PromotionsCatalogProvider";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";
import { ErrorState, LoadingState } from "../ui/StatusState";
import { PromoHubPillLabel, promoCardButtonClass } from "./promoHubCardPrimitives";
import { promotionDetailHref } from "./promotionDetailHref";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * เนื้อหาหน้าโปรโมชั่น — ใช้ใน /promotions (กิจกรรมอยู่ที่ /event) · กดโปรเปิดหน้ารายละเอียด /promotions/[id]
 */
export function PromotionsHubPageContent({ embedded = false }: { embedded?: boolean }) {
  return (
    <PromotionsCatalogProvider>
      <PromotionsHubPageContentInner embedded={embedded} />
    </PromotionsCatalogProvider>
  );
}

function PromotionsHubPageContentInner({ embedded = false }: { embedded?: boolean }) {
  const t = useT("promotions");
  const { catalog, loading, error: loadError, reload } = usePromotionsCatalog();
  const [categoryFilter, setCategoryFilter] = useState<PromoHubCategoryFilterId>("all");

  const hero = catalog?.hero;
  const featured = catalog?.featured ?? [];

  const showHero = useMemo(
    () => (hero ? matchesPromoHubCategory(hero.categories, categoryFilter) : false),
    [hero, categoryFilter],
  );

  const featuredItems = useMemo(
    () => featured.filter((item) => matchesPromoHubCategory(item.categories, categoryFilter)),
    [featured, categoryFilter],
  );

  const hasAnyPromo = showHero || featuredItems.length > 0;
  const showDesktopHub = embedded;
  const hubTabs = catalog?.hubCategoryTabs ?? [];

  return (
    <>
      {loading ? <LoadingState label={t("loading")} /> : null}
      {!loading && loadError && !catalog ? (
        <ErrorState
          variant="card"
          title={t("loadError")}
          description={t("loadErrorDesc")}
          primaryAction={{ label: t("retry"), onClick: reload }}
        />
      ) : null}

      {catalog && showDesktopHub ? (
        <div className="hidden pb-2 lg:block">
          <PromoHubDesktopMasterDetail kind="promotions" />
        </div>
      ) : null}

      {catalog ? (
        <div className="lg:hidden">
          <PromotionsMobileFeed />
        </div>
      ) : null}

      {catalog && !showDesktopHub ? (
        <div className="hidden flex-col gap-5 pb-4 lg:flex">
          <header className="flex flex-col gap-3">
            <PromotionsCategoryTabs
              activeId={categoryFilter}
              onSelect={setCategoryFilter}
              hubCategoryTabs={hubTabs}
            />
          </header>

          {!hasAnyPromo ? (
            <p className={`${COSMIC_PANEL_GLASS} px-4 py-8 text-center text-sm text-[var(--text-secondary)]`}>
              {t("empty.categoryHint")}
            </p>
          ) : null}

          {showHero && hero ? (
            <PromoHubHeroBanner hero={hero} />
          ) : null}

          {featuredItems.length > 0 ? (
            <section aria-labelledby="promo-for-you-heading" className="flex flex-col gap-3">
              <h2 id="promo-for-you-heading" className="text-base font-medium text-[var(--text-primary)] sm:text-lg">
                {t("forYou")}
              </h2>
              <ul className="flex flex-col gap-3">
                {featuredItems.map((item) => (
                  <li key={item.id}>
                    <FeaturedPromoCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

    </>
  );
}

function PromoHubHeroBanner({ hero }: { hero: PromoHubHero }) {
  return (
    <Link
      href={promotionDetailHref(hero.detailId)}
      className={promoCardButtonClass("min-h-[168px] sm:min-h-[188px]")}
      aria-label={`${hero.title} — ${hero.ctaLabel}`}
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
          <h2 className="text-lg font-medium leading-snug text-[var(--text-primary)] drop-shadow-sm sm:text-xl">
            {hero.title}
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">{hero.subtitle}</p>
          <div className="mt-3">
            <PromoHubPillLabel label={hero.ctaLabel} />
          </div>
        </div>
        <PromoHeroCharacterGraphic className="pointer-events-none w-[42%] max-w-[160px] shrink-0 self-end sm:max-w-[190px]" />
      </div>
    </Link>
  );
}

function FeaturedPromoCard({ item }: { item: PromoHubFeaturedItem }) {
  const graphic = featuredGraphicForDetail(item.detailId);

  return (
    <Link
      href={promotionDetailHref(item.detailId)}
      className={promoCardButtonClass()}
      aria-label={`${item.title} — ${item.ctaLabel}`}
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
          <h3 className="text-sm font-medium leading-snug text-[var(--text-primary)] sm:text-base">{item.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-[13px]">{item.subtitle}</p>
          <div className="mt-2.5">
            <PromoHubPillLabel label={item.ctaLabel} />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end pr-0.5">{graphic}</div>
      </div>
    </Link>
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
