"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Gem, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
// สไตล์วงล้อโหลดเฉพาะหน้า /wheel — ไม่อยู่ใน globals.css แล้ว (ใช้ที่นี่ที่เดียว)
import "@/app/styles/lucky-wheel.css";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelData } from "@/lib/api/wheel";
import { ResourceGate } from "../ui/ResourceGate";
import { ArrowLeftIcon } from "../ui/Icons";
import { CosmicFortuneWheel } from "./CosmicFortuneWheel";
import { resolveWheelTheme } from "@/lib/domain/wheelTheme";
import { LuckyWheelLiveWinners } from "./LuckyWheelLiveWinners";
import { LuckyWheelPrizeHistory } from "./LuckyWheelPrizeHistory";
import { formatGemsBalance } from "@/lib/format";
import type { WheelPrizeHistoryRow, WheelSegment, WheelSpinMethod } from "@/app/types/reward";
import { valueClass } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * หน้าเล่นวงล้อพารวย — โหลดข้อมูลวงล้อแล้วส่งให้ LuckyWheelPlay (state เริ่มต้นมาจากข้อมูลที่โหลดแล้ว)
 */
export function LuckyWheelPageContent({ embedded = false }: { embedded?: boolean }) {
  const t = useT("rewards");
  const wheel = useWheel();
  return (
    <ResourceGate resource={wheel} loadingLabel={t("wheel.loading")} errorTitle={t("wheel.loadError")}>
      {(data) => <LuckyWheelPlay wheel={data} embedded={embedded} />}
    </ResourceGate>
  );
}

/**
 * ตัวเล่นวงล้อพารวย — รองรับ Mobile-first layout ตรงตาม mockup
 */
function LuckyWheelPlay({ wheel, embedded }: { wheel: WheelData; embedded: boolean }) {
  const t = useT("rewards");
  const segmentDeg = 360 / wheel.segments.length;
  /** เวลาหมุนจากธีม — ใช้ทั้ง transition ของวงและจังหวะประกาศผล */
  const spinDurationMs = resolveWheelTheme(wheel.theme).spinDurationMs;
  const [gemsBalance, setGemsBalance] = useState(wheel.initialGems);
  const [ticketCount, setTicketCount] = useState(wheel.initialTickets);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [recentHistoryRows, setRecentHistoryRows] = useState<WheelPrizeHistoryRow[]>([]);

  const currentGemsCost = wheel.gemsPerSpin;
  const currentTicketCost = wheel.ticketsPerSpin;

  const canAffordGems = gemsBalance >= currentGemsCost;
  const canAffordTicket = ticketCount >= currentTicketCost && ticketCount > 0;

  const handleSpin = useCallback((spinMethod: WheelSpinMethod) => {
    if (spinning || !(spinMethod === "gems" ? canAffordGems : canAffordTicket)) return;

    const targetIndex = Math.floor(Math.random() * wheel.segments.length);
    const segment: WheelSegment = wheel.segments[targetIndex];
    const extraTurns = 5 * 360;
    const targetAngle = 360 - targetIndex * segmentDeg - segmentDeg / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetAngle - currentMod + 360) % 360;
    const nextRotation = rotation + extraTurns + delta;

    if (spinMethod === "gems") {
      setGemsBalance((b) => Math.max(0, b - currentGemsCost));
    } else {
      setTicketCount((t) => Math.max(0, t - currentTicketCost));
    }

    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setLastWin(t("wheel.winMessage", { prize: segment.label }));
      const row: WheelPrizeHistoryRow = {
        id: `ph-${Date.now()}`,
        atLabel: t("wheel.justNow"),
        prizeKind: segment.kind,
        prizeName: t(`wheel.prizeKind.${segment.kind}`),
        amount: segment.label.replace(/[^\d.]/g, "") || "—",
        method: spinMethod,
      };
      setRecentHistoryRows((prev) => [row, ...prev].slice(0, 5));
    }, spinDurationMs);
  }, [t, spinDurationMs, canAffordGems, canAffordTicket, currentGemsCost, currentTicketCost, rotation, segmentDeg, spinning, wheel.segments]);

  return (
    <div className={`lucky-wheel-page ${embedded ? "lucky-wheel-page--embedded" : ""}`}>
      {/* 1. Header — ย้อนกลับ + หัวข้อกลาง */}
      <div className="w-full px-1 py-1 sm:px-2">
        <div className="relative flex items-center justify-between gap-3">
          <Link
            href="/"
            className="cosmic-back-btn"
            aria-label={t("wheel.backHome")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center">
            <h1 className="text-base font-medium leading-tight text-white sm:text-lg">{t("wheel.title")}</h1>
            <p className="hidden text-xs text-[var(--text-secondary)] sm:block sm:text-[13px]">
              {t("wheel.subtitle")}
            </p>
          </div>
          <div className="h-10 w-10 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* 2–4. วงล้อกลาง · desktop ตารางซ้าย–ขวา */}
      <div
        className={cn(
          "lucky-wheel-page__stage w-full",
          "lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,26rem)_minmax(0,15rem)] lg:items-center lg:justify-center lg:gap-x-5",
          "xl:grid-cols-[17rem_minmax(0,28rem)_17rem] xl:gap-x-6",
        )}
      >
        <aside className="hidden min-w-0 self-center lg:block">
          <LuckyWheelPrizeHistory extraRows={recentHistoryRows} variant="sidebar" />
        </aside>

        <div className="flex min-w-0 w-full flex-col items-center">
        <div className="relative flex w-full max-w-[420px] flex-col items-center justify-center pt-2 sm:max-w-[460px]">
          {/* การ์ดยอดคงเหลือ — เพชร (ซ้าย, กดไปร้านเพชร) · ตั๋ว (ขวา) */}
          <div className="wheel-balance-row">
            <Link href="/gems-store" className="wheel-balance wheel-balance--link" aria-label={t("wheel.gemsBalanceAria")}>
              <span className="wheel-balance__icon wheel-balance__icon--gems" aria-hidden="true">
                <Image src="/assets/gems/diamond.avif" alt="" width={800} height={800} className="wheel-balance__img" />
              </span>
              <span className="wheel-balance__label">{t("wheel.gemsLabel")}</span>
              <span className="wheel-balance__value">{formatGemsBalance(gemsBalance)}</span>
            </Link>
            <div className="wheel-balance" aria-label={t("wheel.ticketsAria")}>
              <span className="wheel-balance__icon wheel-balance__icon--ticket" aria-hidden="true">
                <Image src="/menu-icon/coupon.webp" alt="" width={96} height={96} className="wheel-balance__img" />
              </span>
              <span className="wheel-balance__label">{t("wheel.ticketLabel")}</span>
              <span className="wheel-balance__value">{ticketCount}</span>
            </div>
          </div>
          <CosmicFortuneWheel
            segments={wheel.segments}
            rotationDeg={rotation}
            spinning={spinning}
            theme={wheel.theme}
          />

          {/* Indicator dots 2 จุด ใต้วงล้อ */}
          <div className="mt-2 flex items-center justify-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
          </div>
        </div>

        {/* ปุ่มหมุน 2 ปุ่ม — ซ้ายใช้เพชร (ม่วง) · ขวาใช้ตั๋ว (เหลือง) · สไตล์ 3D ใน .wheel-spin-btn */}
        <div className="wheel-spin-actions">
          {(
            [
              { id: "gems" as const, Icon: Gem, cost: wheel.gemsPerSpin.toFixed(2), ok: canAffordGems, aria: t("wheel.useGems", { amount: wheel.gemsPerSpin.toFixed(2) }) },
              { id: "ticket" as const, Icon: Ticket, cost: String(wheel.ticketsPerSpin), ok: canAffordTicket, aria: t("wheel.useTickets", { count: wheel.ticketsPerSpin }) },
            ] as const
          ).map(({ id, Icon, cost, ok, aria }) => (
            <button
              key={id}
              type="button"
              disabled={spinning}
              data-dimmed={!ok}
              aria-label={`${t("wheel.spinNow")} — ${aria}`}
              onClick={() => handleSpin(id)}
              className={`wheel-spin-btn wheel-spin-btn--${id}`}
            >
              <span className="wheel-spin-btn__title">{spinning ? t("wheel.spinning") : t("wheel.spinNow")}</span>
              <span className="wheel-spin-btn__cost">
                <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
                {cost}
              </span>
            </button>
          ))}
        </div>

        <div className="flex w-full max-w-[340px] flex-col items-center">
          {!canAffordGems ? (
            <Link href="/gems-store" className="mt-2.5 text-xs font-medium text-purple-300 underline decoration-purple-400/40 underline-offset-4 transition-colors hover:text-purple-200 hover:decoration-purple-300">
              {t("wheel.notEnoughGems")}
            </Link>
          ) : !canAffordTicket ? (
            <span className="mt-2.5 text-xs text-[var(--text-secondary)]">{t("wheel.noTickets")}</span>
          ) : (
            <span className="mt-2.5 text-xs text-[var(--text-secondary)]">{t("wheel.hint")}</span>
          )}

          {lastWin ? (
            <div className={valueClass("reward", "mt-2 text-center text-xs animate-fade-in")} role="status">
              {lastWin}
            </div>
          ) : null}
        </div>
        </div>

        <aside className="hidden min-w-0 self-center lg:block">
          <LuckyWheelLiveWinners variant="sidebar" />
        </aside>
      </div>

      {/* มือถือ — ตารางใต้วงล้อ */}
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 pt-4 lg:hidden">
        <LuckyWheelPrizeHistory extraRows={recentHistoryRows} />
        <LuckyWheelLiveWinners />
      </div>

      <p className="pt-2 text-center text-xs text-[var(--text-secondary)]">
        {t("wheel.sampleNote")}
      </p>
    </div>
  );
}
