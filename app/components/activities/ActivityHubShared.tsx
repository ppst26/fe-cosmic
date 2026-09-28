"use client";

import React from "react";
import type {
  ActivityHubCategoryTab,
  ActivityHubItem,
  ActivityThumbTone,
  ActivityTierRow,
} from "@/app/data/activitiesHubMockData";
import {
  ACTIVITY_HUB_CATEGORY_TABS,
  formatActivityCredits,
  formatActivityNumber,
} from "@/app/data/activitiesHubMockData";
import { COSMIC_BTN_GLASS_PILL, COSMIC_BTN_GLASS_PILL_SM, COSMIC_BTN_PRIMARY } from "../ui/cosmicButtonClasses";

/**
 * รูปย่อกิจกรรม — รูปภาพจริง (ถ้ามี) หรือ gradient mock (ใช้ใน list ซ้าย / การ์ดมือถือ)
 */
export function ActivityHubThumb({
  tone,
  className,
  overlay,
  imageUrl,
}: {
  tone?: ActivityThumbTone;
  className?: string;
  overlay?: string;
  imageUrl?: string;
}) {
  const gradient = tone ? thumbGradientForTone(tone) : "linear-gradient(135deg, #2c1a56 0%, #100a24 100%)";

  return (
    <div
      className={`activity-hub-thumb relative shrink-0 overflow-hidden rounded-[var(--radius-control)] border border-white/8 ${className ?? ""}`}
      style={{ background: gradient }}
      aria-hidden={overlay ? undefined : true}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <ActivityThumbArt tone={tone ?? "turn"} />
      )}
      {overlay ? (
        <span className="activity-hub-thumb__overlay font-medium text-xs">{overlay}</span>
      ) : null}
    </div>
  );
}

function thumbGradientForTone(tone: ActivityThumbTone): string {
  switch (tone) {
    case "turn":
      return "linear-gradient(135deg, #7f1d1d 0%, #450a0a 55%, #1c1917 100%)";
    case "xl-win":
      return "linear-gradient(135deg, #6d28d9 0%, #312e81 100%)";
    case "check-in":
      return "linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)";
    case "football":
      return "linear-gradient(135deg, #166534 0%, #14532d 100%)";
    case "mascot":
      return "linear-gradient(135deg, #db2777 0%, #831843 100%)";
    case "cashback":
      return "linear-gradient(135deg, #b45309 0%, #78350f 100%)";
    default:
      return "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)";
  }
}

function ActivityThumbArt({ tone }: { tone: ActivityThumbTone }) {
  if (tone === "turn") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full p-2 opacity-90">
        <text x="40" y="44" textAnchor="middle" fill="#fde047" fontSize="22" fontWeight="500">T</text>
        <circle cx="40" cy="40" r="28" fill="none" stroke="#fca5a5" strokeWidth="2" opacity="0.6" />
      </svg>
    );
  }
  if (tone === "football") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 m-auto h-12 w-12 opacity-90">
        <circle cx="40" cy="40" r="18" fill="#bbf7d0" />
        <path d="M40 22 L48 32 L40 42 L32 32 Z" fill="#166534" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full opacity-35">
      <circle cx="56" cy="28" r="16" fill="#fff" />
    </svg>
  );
}

export function ActivityCategoryTabs({
  activeId,
  onSelect,
  tabs = ACTIVITY_HUB_CATEGORY_TABS,
  flat = false,
}: {
  activeId: ActivityHubCategoryTab;
  onSelect: (id: ActivityHubCategoryTab) => void;
  tabs?: { id: ActivityHubCategoryTab; label: string }[];
  flat?: boolean;
}) {
  return (
    <div
      className="promo-hub-category-tabs activities-hub-cat-tabs flex flex-wrap gap-2"
      role="tablist"
      aria-label="หมวดกิจกรรม"
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={
              flat
                ? `${COSMIC_BTN_GLASS_PILL} !px-3 !py-1.5 !text-xs sm:!text-sm ${selected ? "is-active" : ""}`
                : [
                    "glass-card--soft rounded-[var(--radius-pill)] px-4 py-1.5 text-xs font-medium transition-[background,color,box-shadow] duration-[var(--motion-fast)] sm:text-sm",
                    selected
                      ? "is-active text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  ].join(" ")
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function ActivityTurnProgressCard({
  progress,
  flat = false,
}: {
  progress: NonNullable<ActivityHubItem["progress"]>;
  flat?: boolean;
}) {
  const pct =
    progress.bonusCap > 0
      ? Math.min(100, (progress.bonusEarned / progress.bonusCap) * 100)
      : 0;

  return (
    <section
      className={`activity-hub-progress px-0 py-3 sm:py-4 ${
        flat ? "activity-hub-progress--flat border-b border-[var(--border-subtle)]/45" : "glass-card--soft rounded-[var(--radius-panel)] px-4 sm:px-5"
      }`}
    >
      <h3 className="text-center text-sm font-medium text-[var(--text-primary)] sm:text-base">
        ยอดเทิร์นของคุณ
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="text-center sm:text-left">
          <p className="text-xs text-[var(--text-secondary)] sm:text-[13px]">ยอดเทิร์นปัจจุบัน</p>
          <p className="mt-0.5 text-sm font-medium tabular-nums text-[var(--text-primary)]">
            {formatActivityCredits(progress.currentTurn)}
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-xs text-[var(--text-secondary)] sm:text-[13px]">เป้าหมายลำดับที่ 1</p>
          <p className="mt-0.5 text-sm font-medium tabular-nums text-[var(--text-primary)]">
            {formatActivityCredits(progress.rank1Target)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="activity-hub-progress__trophy shrink-0" aria-hidden="true">🏆</span>
        <div className="min-w-0 flex-1">
          <div className="activity-hub-progress__track h-2 overflow-hidden rounded-full">
            <div className="activity-hub-progress__fill h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-center text-xs font-medium tabular-nums text-[var(--text-secondary)]">
            จำนวนรางวัล {formatActivityNumber(progress.bonusEarned)} / {formatActivityNumber(progress.bonusCap)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ActivityTierTable({ rows, flat = false }: { rows: ActivityTierRow[]; flat?: boolean }) {
  return (
    <div
      className={`activity-hub-tier-table-wrap overflow-x-auto ${
        flat ? "activity-hub-tier-table-wrap--flat pt-2" : "glass-card--soft rounded-[var(--radius-panel)] p-1 sm:p-2"
      }`}
    >
      <table className="activity-hub-tier-table w-full min-w-[520px] border-collapse text-left text-xs sm:text-sm">
        <thead>
          <tr className="text-[11.5px] font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:text-xs">
            <th scope="col" className="px-2 py-2 sm:px-3">ลำดับ</th>
            <th scope="col" className="px-2 py-2 sm:px-3">เทิร์น</th>
            <th scope="col" className="px-2 py-2 text-center sm:px-3">โบนัส</th>
            <th scope="col" className="px-2 py-2 text-right sm:px-3">รับรางวัล</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rank} className="activity-hub-tier-table__row border-t border-[var(--border-subtle)]/25">
              <td className="px-2 py-2.5 font-medium tabular-nums text-[var(--text-primary)] sm:px-3">
                {row.rank}
              </td>
              <td className="px-2 py-2.5 tabular-nums text-[var(--text-secondary)] sm:px-3">
                {formatActivityNumber(row.turnRequired)}
              </td>
              <td className="px-2 py-2.5 text-center font-medium tabular-nums text-[#fde047] sm:px-3">
                {formatActivityNumber(row.bonus)}
              </td>
              <td className="px-2 py-2.5 text-right sm:px-3">
                <ActivityClaimButton state={row.claimState} flat={flat} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityClaimButton({
  state,
  flat = false,
}: {
  state: ActivityTierRow["claimState"];
  flat?: boolean;
}) {
  const base =
    "activity-hub-claim-btn inline-flex min-w-[5.5rem] justify-center px-2 py-1.5 text-xs font-medium leading-tight sm:text-[13px]";

  if (state === "claimable") {
    return (
      <button
        type="button"
        className={
          flat
            ? `${COSMIC_BTN_GLASS_PILL_SM} ${base} !w-full is-active`
            : `${base} rounded-[var(--radius-control)] ${COSMIC_BTN_PRIMARY}`
        }
      >
        รับรางวัล
      </button>
    );
  }
  if (state === "claimed") {
    return (
      <span
        className={
          flat
            ? `${COSMIC_BTN_GLASS_PILL_SM} ${base} !w-full text-[var(--success)]`
            : `${base} glass-card--soft rounded-[var(--radius-control)] text-[var(--success)]`
        }
      >
        รับแล้ว
      </span>
    );
  }
  return (
    <span className={`${base} text-[var(--text-muted)] opacity-90`}>ไม่ผ่านเงื่อนไข</span>
  );
}

export function ActivityInfoDetail({ item }: { item: ActivityHubItem }) {
  return (
    <div className="flex flex-col gap-4">
      {item.infoSummary ? (
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.infoSummary}</p>
      ) : null}
      {item.infoBullets && item.infoBullets.length > 0 ? (
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {item.infoBullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-[var(--accent-primary)]" aria-hidden="true">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ActivityRulesSection({
  rules,
  period,
  className = "",
}: {
  rules?: string[];
  period?: string;
  className?: string;
}) {
  if (!rules || rules.length === 0) return null;

  return (
    <section
      className={`activity-hub-rules-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)]/35 bg-[var(--surface-mid)]/40 p-4 sm:p-5 ${className}`}
      aria-label="กติกาและเงื่อนไขกิจกรรม"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)]/30 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span>
          <h3 className="text-sm font-medium tracking-tight text-[var(--text-primary)] sm:text-base">
            กติกาและเงื่อนไขกิจกรรม
          </h3>
        </div>
        {period ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] border border-white/8">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-highlight)]" aria-hidden="true" />
            <span>{period}</span>
          </span>
        ) : null}
      </div>

      <ol className="mt-3.5 space-y-2.5 text-xs text-[var(--text-secondary)] sm:text-[13px] leading-relaxed">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 select-none items-center justify-center rounded-full bg-white/6 text-xs font-medium text-[var(--accent-primary)] tabular-nums border border-white/6">
              {idx + 1}
            </span>
            <span className="flex-1 pt-0.5">{rule}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ActivityDetailBody({
  item,
  showTitle = true,
  flat = false,
}: {
  item: ActivityHubItem;
  showTitle?: boolean;
  /** desktop hub sheet — ไม่ห่อการ์ดซ้อน */
  flat?: boolean;
}) {
  const [category, setCategory] = React.useState<ActivityHubCategoryTab>(
    item.categoryTabs?.[0] ?? "slots",
  );

  const tiers =
    item.detailKind === "turn-tier"
      ? item.tiersByCategory?.[category] ?? []
      : [];

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {/* ภาพปกกิจกรรมขนาดใหญ่ (ถ้ามี imageUrl) */}
      {item.imageUrl ? (
        <div className="relative w-full overflow-hidden rounded-[var(--radius-control)] border border-white/10 aspect-[21/8] max-h-44 sm:max-h-52 bg-black/40 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d091a] via-transparent to-transparent opacity-80" />
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {showTitle ? (
          <h2 className="text-base font-medium leading-snug text-[var(--text-primary)] sm:text-lg">
            {item.title}
          </h2>
        ) : null}
        {item.detailKind === "turn-tier" && item.categoryTabs ? (
          <ActivityCategoryTabs
            activeId={category}
            onSelect={setCategory}
            flat={flat}
            tabs={ACTIVITY_HUB_CATEGORY_TABS.filter((t) => item.categoryTabs?.includes(t.id))}
          />
        ) : null}
      </div>

      {item.detailKind === "turn-tier" && item.progress ? (
        <>
          <ActivityTurnProgressCard progress={item.progress} flat={flat} />
          <ActivityTierTable rows={tiers} flat={flat} />
        </>
      ) : (
        <ActivityInfoDetail item={item} />
      )}

      {/* กติกาและเงื่อนไขกิจกรรม */}
      <ActivityRulesSection rules={item.rules} period={item.period} />
    </div>
  );
}
