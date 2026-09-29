"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  GEMS_STORE_BALANCE_MOCK,
  GEMS_STORE_GEM_ASSET,
  GEMS_STORE_PACKAGES,
  GEMS_STORE_TERMS,
  formatGemsBalance,
  formatGemsCredits,
  type GemsStorePackage,
} from "@/app/data/gemsStoreMockData";
import { GemsStoreSummaryCard } from "./GemsStoreSummaryCard";
import { ChevronDownIcon } from "../ui/Icons";
import {
  COSMIC_BTN_GLASS_PILL_SM,
  COSMIC_BTN_NAV,
  COSMIC_PANEL_GLASS,
} from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

/**
 * เนื้อหาหน้าร้านค้า Gems — ใช้ใน /gems-store และ DesktopHubModal
 */
export function GemsStorePageContent({
  initialBalance = GEMS_STORE_BALANCE_MOCK,
  embedded = false,
}: {
  initialBalance?: number;
  embedded?: boolean;
}) {
  const [gemsBalance, setGemsBalance] = useState(initialBalance);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleRedeem = (pkg: GemsStorePackage) => {
    if (gemsBalance < pkg.gemsCost) return;
    setGemsBalance((prev) => prev - pkg.gemsCost);
  };

  const flatHub = embedded;

  return (
    <div
      className={cn("flex flex-col gap-4 pb-4 sm:gap-5", flatHub && "gems-store-hub gems-store-hub--flat")}
    >
      <header className={cn(!embedded && "flex flex-col")}>
        <GemsStoreSummaryCard gemsBalance={gemsBalance} />
      </header>

      <section aria-labelledby="gems-store-redeem-heading">
        <h2
          id="gems-store-redeem-heading"
          className="mb-2.5 px-0.5 text-xs font-medium text-[var(--text-secondary)] sm:text-[13px]"
        >
          แลกเครดิต
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:grid-cols-4 lg:gap-3">
          {GEMS_STORE_PACKAGES.map((pkg) => {
            const affordable = gemsBalance >= pkg.gemsCost;
            return (
              <GemsRedeemCard
                key={pkg.id}
                pkg={pkg}
                affordable={affordable}
                flat={flatHub}
                onRedeem={() => handleRedeem(pkg)}
              />
            );
          })}
        </div>
      </section>

      <section
        className={
          flatHub
            ? "gems-store-terms overflow-hidden border-t border-[var(--border-subtle)]/45 pt-1"
            : `overflow-hidden ${COSMIC_PANEL_GLASS}`
        }
      >
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
        {termsOpen && (
          <ul className="space-y-2 border-t border-[var(--border-subtle)]/40 px-4 py-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {GEMS_STORE_TERMS.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--border-active)]" aria-hidden="true">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
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

  return (
    <article
      className={cn(
        "gems-store-redeem-card flex min-h-0 flex-col p-2 sm:p-2.5",
        flat ? "gems-store-redeem-card--flat hub-modal-card" : COSMIC_PANEL_GLASS,
        affordable && "is-active",
        !affordable && "opacity-85",
      )}
    >
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="relative mb-1.5 h-11 w-full max-w-[4.5rem] sm:mb-2 sm:h-14 sm:max-w-[5.5rem]">
          <Image
            src={pkg.coinSrc}
            alt=""
            fill
            sizes="(min-width: 640px) 88px, 22vw"
            className="object-contain object-center"
          />
        </div>
        <p className="w-full text-[11px] font-medium leading-tight text-[var(--text-primary)] sm:text-sm">
          {formatGemsCredits(pkg.credits)}
        </p>
        <p className="mt-1 flex items-center justify-center gap-1 text-[10px] font-medium text-[var(--text-secondary)] sm:text-xs">
          <span className="relative h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5">
            <Image src={GEMS_STORE_GEM_ASSET} alt="" fill sizes="14px" className="object-contain" />
          </span>
          <span className="tabular-nums truncate">{formatGemsBalance(pkg.gemsCost)}</span>
        </p>
      </div>
      <button
        type="button"
        disabled={!affordable}
        onClick={onRedeem}
        aria-label={redeemAria}
        className={
          affordable
            ? `${COSMIC_BTN_NAV} cosmic-btn-nav--sm mt-2 flex w-full min-h-8 items-center justify-center !px-1 !py-1.5 !text-[10px] sm:mt-2.5 sm:!text-xs`
            : `${COSMIC_BTN_GLASS_PILL_SM} mt-2 flex w-full min-h-8 items-center justify-center !px-1 !py-1.5 !text-[10px] text-[var(--text-secondary)] sm:mt-2.5 sm:!text-xs`
        }
      >
        <span className="sm:hidden">{redeemLabel}</span>
        <span className="hidden sm:inline">{affordable ? "แลกรางวัล" : "Gems ไม่เพียงพอ"}</span>
      </button>
    </article>
  );
}
