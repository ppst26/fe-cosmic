"use client";

import React, { useState } from "react";
import Link from "@/lib/i18n/navigation";
import type { PromotionDetailBlock } from "@/app/types/promotions";
import { usePromotionDetail } from "@/app/hooks/api/promotions";
import {
  getPromotionTargets,
  MOCK_PROGRESS_RATIO,
  useMyPromotions,
  type ClaimedPromotion,
} from "@/lib/promotions/myPromotions";
import { formatBaht, formatDateTimeShort } from "@/lib/format";
import { COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";
import { ChevronRightIcon } from "../ui/Icons";
import { promotionDetailHref } from "./promotionDetailHref";
import { useT } from "@/lib/i18n/I18nProvider";

const DAY_MS = 24 * 60 * 60 * 1000;

/** ตัด emoji ออกจากข้อความเงื่อนไข (เหมือน PromotionDetailPanel) */
function plain(text: string): string {
  return text.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * โปรโมชั่นของฉัน — รายการโปรที่กดรับ + เงื่อนไข + progress ฝาก / เทิร์นโอเวอร์
 * ใช้ในหน้า /promotions (แท็บ "โปรโมชั่นของฉัน")
 */
export function MyPromotionsPanel() {
  const t = useT("promotions");
  const items = useMyPromotions();

  if (items.length === 0) {
    return (
      <div className="my-promo-empty flex flex-col items-center gap-3 px-4 py-10 text-center">
        <p className="text-base font-medium text-[var(--text-primary)]">{t("my.empty")}</p>
        <p className="text-sm text-[var(--text-secondary)]">{t("my.emptyDesc")}</p>
      </div>
    );
  }

  return (
    <section className="my-promo-list flex flex-col gap-3 pb-4" aria-label={t("my.title")}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-base font-medium text-[var(--text-primary)] sm:text-lg">{t("my.title")}</h2>
        <span className="text-xs text-[var(--text-muted)]">{t("my.count", { n: items.length })}</span>
      </div>
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <MyPromotionCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function MyPromotionCard({ item }: { item: ClaimedPromotion }) {
  const t = useT("promotions");
  const [open, setOpen] = useState(false);
  const targets = getPromotionTargets(item.id);
  const completed =
    (!targets.deposit || MOCK_PROGRESS_RATIO.deposit >= 1) &&
    (!targets.turnover || MOCK_PROGRESS_RATIO.turnover >= 1);
  const expires = new Date(new Date(item.claimedAt).getTime() + targets.validDays * DAY_MS).toISOString();

  return (
    <article className="my-promo-card glass-card--soft h-full rounded-[var(--radius-panel)] p-3.5 sm:p-4">
      <header className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-sm font-medium leading-snug text-[var(--text-primary)] sm:text-base">
          {item.title}
        </h3>
        <span
          className={`my-promo-card__status shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            completed ? "is-completed" : "is-active"
          }`}
        >
          {completed ? t("my.completed") : t("my.active")}
        </span>
      </header>
      <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-muted)] sm:text-xs">
        {t("my.claimedAt", { date: formatDateTimeShort(item.claimedAt, " · ") })} ·{" "}
        {t("my.expiresAt", { date: formatDateTimeShort(expires, " · ") })}
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {targets.deposit ? (
          <ProgressRow label={t("my.deposit")} ratio={MOCK_PROGRESS_RATIO.deposit} target={targets.deposit} />
        ) : null}
        {targets.turnover ? (
          <ProgressRow label={t("my.turnover")} ratio={MOCK_PROGRESS_RATIO.turnover} target={targets.turnover} />
        ) : null}
      </div>

      <button
        type="button"
        className="my-promo-card__toggle mt-3 flex w-full items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-2.5 text-xs font-medium text-[var(--text-secondary)]"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? t("my.hideConditions") : t("my.showConditions")}
        <ChevronRightIcon className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open ? <ConditionList id={item.id} /> : null}
    </article>
  );
}

function ProgressRow({ label, ratio, target }: { label: string; ratio: number; target: number }) {
  const t = useT("promotions");
  const current = Math.round(target * Math.min(ratio, 1));
  const pct = Math.round(Math.min(ratio, 1) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="tabular-nums text-[var(--text-primary)]">
          {formatBaht(current)} / {formatBaht(target)}
        </span>
      </div>
      <div
        className="my-promo-progress mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="my-promo-progress__fill h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] tabular-nums text-[var(--text-muted)]">
        {pct}%{pct < 100 ? ` · ${t("my.remaining", { amount: formatBaht(target - current) })}` : ""}
      </p>
    </div>
  );
}

function ConditionList({ id }: { id: ClaimedPromotion["id"] }) {
  const t = useT("promotions");
  const detail = usePromotionDetail(id);
  const blocks: PromotionDetailBlock[] = detail.data?.blocks ?? [];

  return (
    <div className="my-promo-card__conditions mt-2 flex flex-col gap-2.5">
      {blocks.map((block, index) => (
        <div key={`${block.title}-${index}`}>
          <p className="text-xs font-medium text-[var(--text-primary)]">{plain(block.title)}</p>
          {block.description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">{plain(block.description)}</p>
          ) : null}
          {block.bullets?.length ? (
            <ul className="mt-1 space-y-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {block.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[var(--accent-primary)]" aria-hidden="true">•</span>
                  <span>{plain(line)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      <Link
        href={promotionDetailHref(id)}
        className={`${COSMIC_BTN_PRIMARY} btn-primary--sm !h-9 mt-1 flex items-center justify-center !px-5 !text-sm self-center`}
      >
        {t("my.viewDetail")}
      </Link>
    </div>
  );
}
