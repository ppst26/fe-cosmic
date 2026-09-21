"use client";

import React from "react";
import Link from "next/link";
import {
  FOOTER_COPYRIGHT,
  FOOTER_DESKTOP_COLUMNS,
  FOOTER_DESKTOP_SOCIAL,
  FOOTER_PAYMENT_LABELS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TAGLINE,
  FOOTER_TRUST_BADGES,
  type FooterSocialIcon,
} from "@/app/data/footerMockData";
import {
  COSMIC_BTN_GLASS_PILL,
  COSMIC_BTN_NAV,
  COSMIC_SHEET_SOFT_GLASS,
} from "@/app/components/ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

interface CosmicFooterProps {
  className?: string;
}

/**
 * ส่วนท้ายเว็บ cosmicbet — มือถือแบบเดิม · desktop อิง Dexsport (คอลัมน์ลิงก์ + trust + legal)
 */
export function CosmicFooter({ className = "" }: CosmicFooterProps) {
  return (
    <footer className={`cosmic-footer ${className}`.trim()} aria-label="ส่วนท้ายเว็บไซต์ cosmicbet">
      <div className="cosmic-footer__container">
        <CosmicFooterMobile />
        <CosmicFooterDesktop />
      </div>
    </footer>
  );
}

/** Footer มือถือ — พันธมิตรซ่อน · แบรนด์ + ติดต่อ */
function CosmicFooterMobile() {
  return (
    <div className="lg:hidden">
      <div className="cosmic-footer__main grid grid-cols-1 gap-5 pt-5">
        <div className="cosmic-footer__brand min-w-0 max-lg:text-center">
          <Link href="/" className="cosmic-footer__brandmark" aria-label="cosmicbet หน้าหลัก">
            cosmic<span>bet</span>
          </Link>
          <p className="cosmic-footer__brand-text text-base font-medium">{FOOTER_TAGLINE}</p>
        </div>

        <section
          className="cosmic-footer__contact min-w-0"
          aria-labelledby="cosmic-footer-contact-title"
        >
          <div className="cosmic-footer__contact-group">
            <h3 id="cosmic-footer-contact-title" className="cosmic-footer__heading-sm text-sm font-medium">
              ติดต่อเรา
            </h3>
            <div className="cosmic-footer__social">
              {FOOTER_SOCIAL_LINKS.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`cosmic-footer__social-btn ${
                    index === 0
                      ? `${COSMIC_BTN_NAV} cosmic-btn-nav--lg cosmic-footer__social-btn--nav`
                      : `${COSMIC_BTN_GLASS_PILL} cosmic-footer__social-btn--glass`
                  }`}
                >
                  {item.label === "LINE" ? <LineIcon /> : <TelegramIcon />}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="cosmic-footer__contact-group">
            <h3 className="cosmic-footer__heading-sm text-sm font-medium">ช่องทางชำระเงิน</h3>
            <ul className="cosmic-footer__payments">
              {FOOTER_PAYMENT_LABELS.map((label) => (
                <li key={label} className={`cosmic-footer__payment-chip ${COSMIC_SHEET_SOFT_GLASS}`}>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="cosmic-footer__bottom text-xs font-medium min-[600px]:text-xs">
        <p>{FOOTER_COPYRIGHT}</p>
      </div>
    </div>
  );
}

/** Footer desktop — โลโก้ + social · 6 คอลัมน์ · trust · CTA · copyright */
function CosmicFooterDesktop() {
  return (
    <div className="cosmic-footer__dex hidden lg:flex lg:flex-col lg:gap-8 lg:px-0 lg:py-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="cosmic-footer__brandmark text-2xl font-semibold tracking-tight"
            aria-label="cosmicbet หน้าหลัก"
          >
            cosmic<span>bet</span>
          </Link>
          <span
            className="rounded-full bg-[color-mix(in_srgb,var(--action-solid)_35%,#2a1848)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]"
          >
            Web3
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label="โซเชียล">
          {FOOTER_DESKTOP_SOCIAL.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full",
                "border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-elevated)_70%,transparent)]",
                "text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]",
              )}
              aria-label={item.label}
            >
              <FooterSocialGlyph icon={item.icon} />
            </Link>
          ))}
        </nav>
      </div>

      <nav
        className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-6"
        aria-label="ลิงก์ส่วนท้ายเว็บ"
      >
        {FOOTER_DESKTOP_COLUMNS.map((column) => (
          <div key={column.title} className="min-w-0">
            <h3 className="mb-3 text-base font-semibold text-[var(--text-primary)]">{column.title}</h3>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center py-0.5 text-sm leading-snug text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--border-subtle)] pt-6">
        <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
          {FOOTER_TRUST_BADGES.map((badge) => (
            <li key={badge.name} className="flex items-center gap-2.5 text-[var(--text-muted)]">
              <span
                className="inline-flex size-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,#22c55e_25%,transparent)] text-xs text-emerald-400"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-xs leading-snug">
                {badge.label}
                <strong className="mt-0.5 block text-sm font-semibold text-[var(--text-primary)]">
                  {badge.name}
                </strong>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/support"
            className={cn(
              COSMIC_BTN_GLASS_PILL,
              "inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-medium text-[var(--text-primary)]",
            )}
          >
            ชุมชน
          </Link>
          <Link
            href="/support"
            className={cn(
              COSMIC_BTN_NAV,
              "cosmic-btn-nav--lg inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium",
            )}
          >
            <HeadsetIcon />
            แชทออนไลน์
          </Link>
        </div>
      </div>

      <div className="cosmic-footer__bottom !mt-0 border-t border-[var(--border-subtle)] pt-5 !text-sm !text-[var(--text-secondary)]">
        <p>{FOOTER_COPYRIGHT}</p>
      </div>
    </div>
  );
}

function FooterSocialGlyph({ icon }: { icon: FooterSocialIcon["icon"] }) {
  const common = "size-4 shrink-0";
  switch (icon) {
    case "telegram":
      return <TelegramIcon className={common} />;
    case "line":
      return <LineIcon className={common} />;
    case "x":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.7l-5.2-6.8L5.4 22H2.3l7.3-8.4L.8 2h6.9l4.7 6.2L18.9 2zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20z" />
        </svg>
      );
    case "discord":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M20.3 4.4A17.2 17.2 0 0 0 15.5 3c-.2.4-.5 1-.7 1.4a15.8 15.8 0 0 0-4.8 0C9.8 4 9.5 3.4 9.3 3a17.5 17.5 0 0 0-4.8 1.4C2.2 8.2 1.6 12 1.9 15.7a17.4 17.4 0 0 0 5.3 2.7c.4-.6.8-1.1 1.1-1.8-.6-.2-1.2-.5-1.7-.9.1-.1.3-.2.4-.3 3.2 1.5 6.7 1.5 9.8 0l.4.3c-.5.3-1.1.6-1.7.9.3.7.7 1.2 1.1 1.8a17.3 17.3 0 0 0 5.3-2.7c.4-4.3-.2-8.1-2.6-11.3zM8.7 13.6c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9zm6.6 0c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M23 12.3c0-.8-.1-1.6-.3-2.3-.2-.9-.9-1.6-1.8-1.8C19.2 7.8 12 7.8 12 7.8s-7.2 0-8.9.4c-.9.2-1.6.9-1.8 1.8-.2.7-.3 1.5-.3 2.3s.1 1.6.3 2.3c.2.9.9 1.6 1.8 1.8 1.7.4 8.9.4 8.9.4s7.2 0 8.9-.4c.9-.2 1.6-.9 1.8-1.8.2-.7.3-1.5.3-2.3zM9.8 15.5v-7l6.2 3.5-6.2 3.5z"
          />
        </svg>
      );
    default:
      return null;
  }
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? ""} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 11c0 5-5 8-10 10v-4C5 17 3 14 3 10s4-7 9-7 8 3 8 8Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10h10M7 13h6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? ""} aria-hidden="true" viewBox="0 0 24 24">
      <path d="m3 10 18-7-4 18-6-6-4 2 1-5 9-6-6 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" strokeLinecap="round" />
      <rect x="2" y="14" width="4" height="6" rx="1" />
      <rect x="18" y="14" width="4" height="6" rx="1" />
    </svg>
  );
}
