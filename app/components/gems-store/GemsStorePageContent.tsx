"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  GEMS_STORE_BALANCE_MOCK,
  GEMS_STORE_EXCHANGE_RATE_LABEL,
  GEMS_STORE_GEM_ASSET,
  GEMS_STORE_PACKAGES,
  GEMS_STORE_TERMS,
  formatGemsAmount,
  formatGemsBalance,
  formatGemsCredits,
  type GemsStorePackage,
} from "@/app/data/gemsStoreMockData";
import { ChevronDownIcon } from "../ui/Icons";
import {
  COSMIC_BTN_GLASS_PILL,
  COSMIC_BTN_GLASS_PILL_SM,
  COSMIC_BTN_NAV,
  COSMIC_PANEL_GLASS,
} from "../ui/cosmicButtonClasses";

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
      className={`flex flex-col gap-5 pb-4 ${flatHub ? "gems-store-hub gems-store-hub--flat" : ""}`}
    >
      {!embedded ? (
        <header className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 pr-1">
              <h1 className="text-xl font-medium text-[var(--text-primary)] sm:text-2xl">
                ร้านค้า <span className="text-[var(--accent-highlight)]">Gems</span>
              </h1>
              <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                ใช้ Gems แลกรับเครดิตเข้ากระเป๋าของคุณ
              </p>
            </div>

          <aside
            className={`flex shrink-0 items-center gap-2.5 px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${COSMIC_PANEL_GLASS}`}
            aria-label="ยอด Gems ของคุณ"
          >
            <div className="relative h-16 w-16 shrink-0 sm:h-28 sm:w-28">
              <Image
                src={GEMS_STORE_GEM_ASSET}
                alt=""
                fill
                sizes="56px"
                className="object-contain object-center drop-shadow-[0_4px_12px_rgba(124,58,237,0.35)]"
                priority
              />
            </div>
            <div className="min-w-0 text-right">
              <p className="text-[10px] font-medium text-[var(--text-secondary)] sm:text-[11px]">
                Gems ของคุณ
              </p>
              <p className="text-lg font-medium tabular-nums leading-tight text-[var(--text-primary)] sm:text-xl">
                {formatGemsBalance(gemsBalance)}
              </p>
              <p className="text-[9px] text-[var(--text-muted)] sm:text-[10px]">ยอดตัวอย่าง</p>
            </div>
          </aside>
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">{GEMS_STORE_EXCHANGE_RATE_LABEL}</p>
      </header>
      ) : null}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
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
          <span className="glass-card--soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-[var(--text-muted)]">
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
  return (
    <article
      className={`gems-store-redeem-card flex flex-col p-2.5 sm:p-3 ${
        flat ? "gems-store-redeem-card--flat hub-modal-card" : COSMIC_PANEL_GLASS
      }${affordable ? " is-active" : ""}${affordable ? "" : " opacity-85"}`}
    >
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="relative mb-2 h-14 w-full max-w-[100px] sm:h-16 sm:max-w-[112px]">
          <Image
            src={pkg.coinSrc}
            alt=""
            fill
            sizes="(min-width: 640px) 112px, 28vw"
            className="object-contain object-center"
          />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] sm:text-base">
          {formatGemsCredits(pkg.credits)}
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[var(--text-secondary)] sm:text-xs">
          <span className="relative h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4">
            <Image src={GEMS_STORE_GEM_ASSET} alt="" fill sizes="16px" className="object-contain" />
          </span>
          {formatGemsAmount(pkg.gemsCost)}
        </p>
      </div>
      <button
        type="button"
        disabled={!affordable}
        onClick={onRedeem}
        className={
          affordable
            ? `${COSMIC_BTN_NAV} cosmic-btn-nav--sm mt-3 flex w-full items-center justify-center !py-2 !text-[10px] sm:!text-xs`
            : `${COSMIC_BTN_GLASS_PILL_SM} mt-3 flex w-full items-center justify-center !py-2 !text-[10px] text-[var(--text-muted)] sm:!text-xs`
        }
      >
        {affordable ? "แลกรางวัล" : "Gems ไม่เพียงพอ"}
      </button>
    </article>
  );
}
