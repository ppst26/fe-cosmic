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

/**
 * รูปย่อกิจกรรม — gradient mock ตามประเภท (ใช้ใน list ซ้าย / การ์ดมือถือ)
 */
export function ActivityHubThumb({
  tone,
  className,
  overlay,
}: {
  tone: ActivityThumbTone;
  className?: string;
  overlay?: string;
}) {
  const gradient = thumbGradientForTone(tone);

  return (
    <div
      className={`activity-hub-thumb relative shrink-0 overflow-hidden rounded-[var(--radius-control)] ${className ?? ""}`}
      style={{ background: gradient }}
      aria-hidden={overlay ? undefined : true}
    >
      <ActivityThumbArt tone={tone} />
      {overlay ? (
        <span className="activity-hub-thumb__overlay">{overlay}</span>
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
}: {
  activeId: ActivityHubCategoryTab;
  onSelect: (id: ActivityHubCategoryTab) => void;
  tabs?: { id: ActivityHubCategoryTab; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="หมวดกิจกรรม">
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={`activity-hub-cat-tab rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm ${
              selected ? "activity-hub-cat-tab--active" : ""
            }`}
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
}: {
  progress: NonNullable<ActivityHubItem["progress"]>;
}) {
  const pct =
    progress.bonusCap > 0
      ? Math.min(100, (progress.bonusEarned / progress.bonusCap) * 100)
      : 0;

  return (
    <section className="activity-hub-progress hub-desktop-field px-4 py-3 sm:px-5 sm:py-4">
      <h3 className="text-center text-sm font-medium text-[var(--text-primary)] sm:text-base">
        ยอดเทิร์นของคุณ
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="text-center sm:text-left">
          <p className="text-[11px] text-[var(--text-secondary)] sm:text-xs">ยอดเทิร์นปัจจุบัน</p>
          <p className="mt-0.5 text-sm font-medium tabular-nums text-[var(--text-primary)]">
            {formatActivityCredits(progress.currentTurn)}
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-[11px] text-[var(--text-secondary)] sm:text-xs">เป้าหมายลำดับที่ 1</p>
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
          <p className="mt-1 text-center text-[11px] font-medium tabular-nums text-[var(--text-secondary)]">
            จำนวนรางวัล {formatActivityNumber(progress.bonusEarned)} / {formatActivityNumber(progress.bonusCap)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ActivityTierTable({ rows }: { rows: ActivityTierRow[] }) {
  return (
    <div className="activity-hub-tier-table-wrap overflow-x-auto">
      <table className="activity-hub-tier-table w-full min-w-[520px] border-collapse text-left text-xs sm:text-sm">
        <thead>
          <tr className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-[11px]">
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
                <ActivityClaimButton state={row.claimState} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityClaimButton({ state }: { state: ActivityTierRow["claimState"] }) {
  if (state === "claimable") {
    return (
      <button type="button" className="activity-hub-claim-btn activity-hub-claim-btn--ready">
        รับรางวัล
      </button>
    );
  }
  if (state === "claimed") {
    return (
      <span className="activity-hub-claim-btn activity-hub-claim-btn--done">รับแล้ว</span>
    );
  }
  return (
    <span className="activity-hub-claim-btn activity-hub-claim-btn--locked">ไม่ผ่านเงื่อนไข</span>
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
              <span className="text-[#a78bfa]" aria-hidden="true">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ActivityDetailBody({
  item,
  showTitle = true,
}: {
  item: ActivityHubItem;
  showTitle?: boolean;
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
      <div className="flex flex-col gap-3">
        {showTitle ? (
          <h2 className="text-base font-medium leading-snug text-[var(--text-primary)] sm:text-lg">
            {item.title}
          </h2>
        ) : null}
        {item.detailKind === "turn-tier" && item.categoryTabs ? (
          <ActivityCategoryTabs activeId={category} onSelect={setCategory} tabs={ACTIVITY_HUB_CATEGORY_TABS.filter((t) => item.categoryTabs?.includes(t.id))} />
        ) : null}
      </div>

      {item.detailKind === "turn-tier" && item.progress ? (
        <>
          <ActivityTurnProgressCard progress={item.progress} />
          <ActivityTierTable rows={tiers} />
        </>
      ) : (
        <ActivityInfoDetail item={item} />
      )}
    </div>
  );
}
