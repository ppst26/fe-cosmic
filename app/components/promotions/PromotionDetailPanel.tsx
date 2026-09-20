"use client";

import React from "react";
import type {
  PromotionDetailBlock,
  PromotionDetailBlockIcon,
  PromotionDetailContent,
} from "@/app/data/promotionDetailMockData";

export type PromotionDetailPanelVariant = "modal" | "hub";

interface PromotionDetailPanelProps {
  content: PromotionDetailContent;
  variant?: PromotionDetailPanelVariant;
}

/**
 * เนื้อหารายละเอียดโปรโมชั่น — ใช้ใน PromotionDetailModal และ PromotionsDesktopHubLayout (panel ขวา)
 */
export function PromotionDetailPanel({ content, variant = "modal" }: PromotionDetailPanelProps) {
  const isHub = variant === "hub";

  return (
    <div
      className={
        isHub
          ? "promotion-detail-panel promotion-detail-panel--hub"
          : "promotion-detail-panel promotion-detail-panel--modal"
      }
    >
      <PromotionDetailBanner content={content} isHub={isHub} />
      {isHub ? (
        <PromotionDetailBodyExpanded body={content} isHub={isHub} />
      ) : (
        <PromotionDetailDetailsSection body={content} />
      )}
    </div>
  );
}

function PromotionDetailBanner({
  content,
  isHub,
}: {
  content: PromotionDetailContent;
  isHub: boolean;
}) {
  return (
    <section
      className={
        isHub
          ? "promotion-detail-panel__banner relative overflow-hidden px-4 py-4"
          : "promotion-detail-panel__banner glass-card--soft relative overflow-hidden px-4 py-5"
      }
      aria-label={content.bannerTitle}
    >
      {!isHub ? <div className="promotion-detail-panel__banner-glow" aria-hidden="true" /> : null}
      <div className="relative z-[1] flex items-center gap-3">
        <PromotionDetailBannerArt
          art={content.bannerArt}
          className="h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]"
          isHub={isHub}
        />
        <div className="min-w-0 flex-1">
          <h2
            className={
              isHub
                ? "text-lg font-medium leading-snug text-[var(--text-primary)] sm:text-xl"
                : "promotion-detail-panel__banner-title text-lg sm:text-xl"
            }
          >
            {content.bannerTitle}
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">{content.bannerSubtitle}</p>
        </div>
      </div>
    </section>
  );
}

/** บล็อกรายละเอียดใน modal — แสดงเต็ม ไม่มี accordion */
function PromotionDetailDetailsSection({ body }: { body: PromotionDetailContent }) {
  return (
    <section className="promotion-detail-panel__details glass-card--soft" aria-label="รายละเอียดโปรโมชั่น">
      <h3 className="promotion-detail-panel__details-heading">รายละเอียด</h3>
      <hr className="promotion-detail-panel__divider" />
      <PromotionDetailBodyExpanded body={body} isHub={false} />
    </section>
  );
}

function PromotionDetailBodyExpanded({
  body,
  isHub,
}: {
  body: PromotionDetailContent;
  isHub: boolean;
}) {
  return (
    <section
      className={
        isHub
          ? "promotion-detail-panel__body mt-4 space-y-4"
          : "promotion-detail-panel__accordion-body"
      }
      aria-label="รายละเอียดโปรโมชั่น"
    >
      {isHub ? (
        <h3 className="text-sm font-medium text-[var(--text-primary)]">รายละเอียด</h3>
      ) : null}
      <div className={isHub ? "space-y-4" : "promotion-detail-panel__blocks"}>
        {body.blocks.map((block, index) => (
          <PromotionDetailBlockRow key={`${block.title}-${index}`} block={block} isHub={isHub} />
        ))}
      </div>
      <p className="promotion-detail-panel__footer">{body.footerNote}</p>
    </section>
  );
}

function PromotionDetailBlockRow({
  block,
  isHub,
}: {
  block: PromotionDetailBlock;
  isHub: boolean;
}) {
  return (
    <>
      {block.showDividerBefore && <hr className="promotion-detail-panel__divider" />}
      <div className="flex gap-3">
        <PromotionDetailBlockIcon icon={block.icon} className="mt-0.5 h-9 w-9 shrink-0" isHub={isHub} />
        <div className="min-w-0 flex-1">
          <h3
            className={
              isHub
                ? "text-sm font-medium text-[var(--accent-muted)]"
                : "promotion-detail-panel__block-title text-sm font-medium"
            }
          >
            {block.title}
          </h3>
          {block.description && (
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{block.description}</p>
          )}
          {block.bullets && block.bullets.length > 0 && (
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              {block.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[var(--accent-primary)]" aria-hidden="true">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function PromotionDetailBlockIcon({
  icon,
  className,
  isHub,
}: {
  icon: PromotionDetailBlockIcon;
  className?: string;
  isHub?: boolean;
}) {
  const base = `${className} promo-detail-block-icon flex items-center justify-center ${
    isHub
      ? "rounded-full border border-[color-mix(in_srgb,var(--accent-primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--surface-mid)_88%,black)]"
      : ""
  }`;
  if (icon === "shield") {
    return (
      <span className={base} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M12 3 19 6.5V12c0 4.5-3.2 7.8-7 9-3.8-1.2-7-4.5-7-9V6.5L12 3Z" fill="#fde047" opacity="0.9" />
          <path d="M9.5 12 11 13.5 14.5 10" stroke="#422006" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (icon === "gift") {
    return (
      <span className={base} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <rect x="4" y="10" width="16" height="10" rx="1.5" fill="#7c3aed" />
          <rect x="11" y="10" width="2" height="10" fill="#c4b5fd" />
          <path d="M12 10V6M8 6h8a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4Z" fill="#f97316" />
        </svg>
      </span>
    );
  }
  if (icon === "info") {
    return (
      <span className={base} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <circle cx="12" cy="12" r="9" fill="none" stroke="#a78bfa" strokeWidth="1.75" />
          <path d="M12 10v6M12 7h.01" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (icon === "coin") {
    return (
      <span className={base} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <circle cx="12" cy="12" r="8" fill="#fde047" stroke="#ca8a04" strokeWidth="1.25" />
          <path d="M12 8v8M9 12h6" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (icon === "referral") {
    return (
      <span className={base} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M4 10 10 7v10l-6-3V10Z" fill="#7c3aed" />
          <path d="M10 8 18 5v10l-8-3V8Z" fill="#a78bfa" />
        </svg>
      </span>
    );
  }
  if (icon === "calendar") {
    return (
      <span className={base} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <rect x="4" y="6" width="16" height="14" rx="2" fill="#312e81" stroke="#a78bfa" strokeWidth="1.25" />
          <path d="M4 10h16" stroke="#a78bfa" strokeWidth="1.25" />
          <path d="M9 4v4M15 4v4" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className={base} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" fill="#4c1d95" stroke="#fde047" strokeWidth="1.25" />
        <circle cx="12" cy="12" r="2" fill="#fde047" />
      </svg>
    </span>
  );
}

function PromotionDetailBannerArt({
  art,
  className,
  isHub,
}: {
  art: PromotionDetailBlockIcon;
  className?: string;
  isHub?: boolean;
}) {
  if (art === "shield") {
    return (
      <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
        <path d="M8 62 40 74 72 62 40 18Z" fill="#1e1b4b" opacity="0.55" />
        <path
          d="M40 10 68 22 V44 C68 58 40 72 40 72 C40 72 12 58 12 44 V22 Z"
          fill="url(#promoModalShield)"
          stroke="#fde047"
          strokeWidth="2"
        />
        <path d="M34 44 38 48 46 38" stroke="#422006" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M36 30 40 24 44 30 40 34 Z" fill="#fde047" />
        <path d="M18 28 26 22 22 34 Z" fill="#67e8f9" opacity="0.85" />
        <defs>
          <linearGradient id="promoModalShield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return <PromotionDetailBlockIcon icon={art} className={className} isHub={isHub} />;
}
