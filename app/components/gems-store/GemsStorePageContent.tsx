"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GEMS_STORE_GEM_ASSET } from "@/app/data/gemsStoreMockData";
import type { GemsStoreData } from "@/lib/api/gemsStore";
import { useGemsStore } from "@/app/hooks/api/member";
import { ResourceGate } from "../ui/ResourceGate";
import { GemsStoreSummaryCard } from "./GemsStoreSummaryCard";
import { GemsRedeemConfirmDialog } from "./GemsRedeemConfirmDialog";
import { ChevronDownIcon } from "../ui/Icons";
import {
  COSMIC_BTN_CONFIRM_COMPACT,
  COSMIC_BTN_CONFIRM_TEXT,
  COSMIC_BTN_GLASS_PILL_SM,
  COSMIC_PANEL_GLASS,
} from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";
import { formatGemsBalance, formatGemsCredits } from "@/lib/format";
import type { GemsStorePackage } from "@/app/types/reward";

/**
 * เนื้อหาหน้าร้านค้า Gems — ใช้ใน /gems-store และ DesktopHubModal
 */
export function GemsStorePageContent({
  initialBalance,
  embedded = false,
}: {
  initialBalance?: number;
  embedded?: boolean;
}) {
  const gemsStore = useGemsStore();
  return (
    <ResourceGate resource={gemsStore} loadingLabel="กำลังโหลดร้านค้าเพชร…" errorTitle="โหลดร้านค้าเพชรไม่สำเร็จ">
      {(data) => (
        <GemsStoreView gemsStore={data} initialBalance={initialBalance} embedded={embedded} />
      )}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — ยอดเพชรเริ่มต้นจาก API แล้วหักในเครื่องหลังแลก */
function GemsStoreView({
  gemsStore,
  initialBalance,
  embedded,
}: {
  gemsStore: GemsStoreData;
  initialBalance?: number;
  embedded: boolean;
}) {
  const [gemsBalance, setGemsBalance] = useState(initialBalance ?? gemsStore.balance);
  const [termsOpen, setTermsOpen] = useState(false);
  const [confirmPkg, setConfirmPkg] = useState<GemsStorePackage | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);

  const openRedeemConfirm = (pkg: GemsStorePackage) => {
    if (gemsBalance < pkg.gemsCost) return;
    setConfirmPkg(pkg);
  };

  const handleConfirmRedeem = async () => {
    if (!confirmPkg || gemsBalance < confirmPkg.gemsCost) return;
    setRedeemLoading(true);
    try {
      setGemsBalance((prev) => prev - confirmPkg.gemsCost);
      setConfirmPkg(null);
    } finally {
      setRedeemLoading(false);
    }
  };

  const flatHub = embedded;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:gap-5",
        flatHub ? "gems-store-hub gems-store-hub--flat pb-2" : "pb-4",
      )}
    >
      <header className={cn(!embedded && "flex flex-col")}>
        <GemsStoreSummaryCard gemsBalance={gemsBalance} store={gemsStore} />
      </header>

      <section aria-labelledby="gems-store-redeem-heading">
        <h2
          id="gems-store-redeem-heading"
          className="mb-2.5 px-0.5 text-xs font-medium text-[var(--text-secondary)] sm:text-[13px]"
        >
          แลกเครดิต
        </h2>
        <div className="gems-store-redeem-grid grid grid-cols-4 gap-1.5 sm:gap-2 lg:gap-3">
          {gemsStore.packages.map((pkg) => {
            const affordable = gemsBalance >= pkg.gemsCost;
            return (
              <GemsRedeemCard
                key={pkg.id}
                pkg={pkg}
                affordable={affordable}
                flat={flatHub}
                onRedeem={() => openRedeemConfirm(pkg)}
              />
            );
          })}
        </div>
      </section>

      {!flatHub ? (
        <section className={`gems-store-terms overflow-hidden ${COSMIC_PANEL_GLASS}`}>
          <button
            type="button"
            onClick={() => setTermsOpen((open) => !open)}
            className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/20"
            aria-expanded={termsOpen}
          >
            <span className="glass-card--soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-[var(--text-muted)]">
              i
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">เงื่อนไขการแลกรางวัล</span>
            <ChevronDownIcon
              className={`h-4 w-4 text-[var(--icon-default)] transition-transform ${
                termsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {termsOpen ? (
            <ul className="space-y-2 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              {gemsStore.terms.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[var(--border-active)]" aria-hidden="true">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <GemsRedeemConfirmDialog
        open={confirmPkg != null}
        onOpenChange={(next) => {
          if (!next && !redeemLoading) setConfirmPkg(null);
        }}
        pkg={confirmPkg}
        gemsBalance={gemsBalance}
        loading={redeemLoading}
        onConfirm={handleConfirmRedeem}
      />
    </div>
  );
}

function GemsRedeemCard({
  pkg,
  affordable,
  flat = false,
  onRedeem,
}: {
  pkg: GemsStorePackage;
  affordable: boolean;
  flat?: boolean;
  onRedeem: () => void;
}) {
  const redeemLabel = affordable ? "แลก" : "ไม่พอ";
  const redeemAria = affordable ? `แลกรางวัล ${formatGemsCredits(pkg.credits)}` : "Gems ไม่เพียงพอ";
  const gemAsset = GEMS_STORE_GEM_ASSET;

  return (
    <article
      className={cn(
        "gems-store-redeem-card flex min-h-0 flex-col gap-1.5 p-1.5 sm:gap-2 sm:p-2.5",
        flat && "gems-store-redeem-card--flat",
        affordable && "is-active",
        !affordable && "opacity-85",
      )}
    >
      <div
        className={cn(
          "gems-store-redeem-card__inner flex min-h-0 flex-1 flex-col",
          flat && "hub-modal-card",
          affordable && flat && "is-active",
        )}
      >
        <p className="gems-store-redeem-card__title">{formatGemsCredits(pkg.credits)}</p>
        <div className="gems-store-redeem-card__art mt-1.5 sm:mt-2">
          <Image
            src={pkg.coinSrc}
            alt=""
            fill
            sizes="(min-width: 640px) 88px, 22vw"
            className="object-contain object-center"
          />
        </div>
        <p className="gems-store-redeem-card__cost cosmic-type-sheet-desc mt-1.5 flex items-center justify-center gap-1 font-medium sm:mt-2">
          <span className="gems-store-redeem-card__cost-icon" aria-hidden="true">
            <Image src={gemAsset} alt="" fill sizes="14px" className="object-contain" />
          </span>
          <span className="gems-store-redeem-card__cost-value tabular-nums">{formatGemsBalance(pkg.gemsCost)}</span>
        </p>
      </div>
      <button
        type="button"
        disabled={!affordable}
        onClick={onRedeem}
        aria-label={redeemAria}
        className={
          affordable
            ? COSMIC_BTN_CONFIRM_COMPACT
            : `${COSMIC_BTN_GLASS_PILL_SM} flex w-full min-h-8 items-center justify-center !px-1 !py-1.5 !text-xs text-[var(--text-secondary)]`
        }
      >
        <span className={COSMIC_BTN_CONFIRM_TEXT}>
          <span className="sm:hidden">{redeemLabel}</span>
          <span className="hidden sm:inline">{affordable ? "แลกรางวัล" : "Gems ไม่เพียงพอ"}</span>
        </span>
      </button>
    </article>
  );
}
