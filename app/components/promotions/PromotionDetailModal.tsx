"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import {
  getPromotionDetail,
  type PromotionDetailBlock,
  type PromotionDetailBlockIcon,
  type PromotionDetailContent,
  type PromotionDetailId,
} from "@/app/data/promotionDetailMockData";
import { ChevronDownIcon, CloseIcon } from "../ui/Icons";

interface PromotionDetailModalProps {
  detailId: PromotionDetailId | null;
  onClose: () => void;
}

/**
 * Modal รายละเอียดโปรโมชั่น — เปิดจากปุ่ม「ดูรายละเอียด」ในหน้า /promotions
 */
export function PromotionDetailModal({ detailId, onClose }: PromotionDetailModalProps) {
  const open = detailId !== null;
  const content = detailId ? getPromotionDetail(detailId) : null;

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[65] bg-black/78 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

        {content && (
          <Dialog.Content
            aria-describedby={undefined}
            className="cosmic-modal-shell fixed left-1/2 top-1/2 z-[80] flex max-h-[min(92dvh,680px)] w-[min(calc(100vw-1.25rem),420px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-[#0d0b1a] text-[var(--text-primary)] shadow-[0_0_40px_rgba(124,58,237,0.22),0_24px_56px_rgba(0,0,0,0.6)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
          >
            <div className="relative shrink-0 px-3 pb-2 pt-3">
              <div className="mx-auto flex max-w-[92%] justify-center">
                <div
                  className="relative w-full max-w-[280px] px-6 py-2.5 text-center"
                  style={{
                    background: "linear-gradient(180deg, #6d28d9 0%, #4c1d95 55%, #3b0764 100%)",
                    clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                  }}
                >
                  <Dialog.Title className="text-sm font-extrabold tracking-wide text-white sm:text-base">
                    รายละเอียดโปรโมชั่น
                  </Dialog.Title>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1240]/90 text-[var(--icon-default)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)]"
                  aria-label="ปิดรายละเอียดโปรโมชั่น"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1 [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.45)_transparent]">
              <PromotionDetailBanner content={content} />
              <PromotionDetailAccordion key={content.id} body={content} />
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PromotionDetailBanner({ content }: { content: PromotionDetailContent }) {
  return (
    <section
      className="cosmic-inset-card relative overflow-hidden px-4 py-5"
      aria-label={content.bannerTitle}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 70% 35%, rgba(124,58,237,0.4) 0%, rgba(13,11,26,0.95) 55%, rgba(9,11,24,1) 100%)",
        }}
      />
      <div className="relative z-[1] flex items-center gap-3">
        <PromotionDetailBannerArt art={content.bannerArt} className="h-[72px] w-[72px] shrink-0 sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1">
          <h2
            className="text-lg font-extrabold leading-snug sm:text-xl"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fde047 85%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {content.bannerTitle}
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">{content.bannerSubtitle}</p>
        </div>
      </div>
    </section>
  );
}

function PromotionDetailAccordion({ body }: { body: PromotionDetailContent }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="cosmic-inset-card mt-3 overflow-hidden bg-[#121027]/90">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/15"
        aria-expanded={expanded}
      >
        <span className="text-sm font-extrabold text-[var(--text-primary)]">รายละเอียด</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-[var(--icon-default)] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-4 px-4 py-4">
          {body.blocks.map((block, index) => (
            <PromotionDetailBlockRow key={`${block.title}-${index}`} block={block} />
          ))}
          <p className="pt-1 text-center text-[10px] text-[var(--text-muted)]">{body.footerNote}</p>
        </div>
      )}
    </section>
  );
}

function PromotionDetailBlockRow({ block }: { block: PromotionDetailBlock }) {
  return (
    <>
      {block.showDividerBefore && <hr className="border-[var(--border-subtle)]/35" />}
      <div className="flex gap-3">
        <PromotionDetailBlockIcon icon={block.icon} className="mt-0.5 h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-[#c4b5fd]">{block.title}</h3>
          {block.description && (
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{block.description}</p>
          )}
          {block.bullets && block.bullets.length > 0 && (
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              {block.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[#a78bfa]" aria-hidden="true">
                    •
                  </span>
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

function PromotionDetailBlockIcon({ icon, className }: { icon: PromotionDetailBlockIcon; className?: string }) {
  const base = `${className} flex items-center justify-center rounded-full border border-[#7c3aed]/40 bg-[#1e1b4b]/80`;
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

function PromotionDetailBannerArt({ art, className }: { art: PromotionDetailBlockIcon; className?: string }) {
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
  return <PromotionDetailBlockIcon icon={art} className={className} />;
}
