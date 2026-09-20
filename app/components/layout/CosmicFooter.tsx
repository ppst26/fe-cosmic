"use client";

import React from "react";
import Link from "next/link";
import {
  FOOTER_COPYRIGHT,
  FOOTER_LEGAL_LINKS,
  FOOTER_PARTNER_NAMES,
  FOOTER_PAYMENT_LABELS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TAGLINE,
} from "@/app/data/footerMockData";
import {
  COSMIC_BTN_GLASS_PILL,
  COSMIC_BTN_NAV,
  COSMIC_SHEET_SOFT_GLASS,
} from "@/app/components/ui/cosmicButtonClasses";

interface CosmicFooterProps {
  className?: string;
}

/**
 * ส่วนท้ายเว็บ cosmicbet — แปลจาก demo HTML responsive footer
 * ใช้ใน root layout (แสดงทุกหน้า)
 */
export function CosmicFooter({ className = "" }: CosmicFooterProps) {
  return (
    <footer className={`cosmic-footer ${className}`.trim()} aria-label="ส่วนท้ายเว็บไซต์ cosmicbet">
      <div className="cosmic-footer__container">
        <section
          className="cosmic-footer__partners max-lg:hidden"
          aria-labelledby="cosmic-footer-partners-title"
        >
          <h2 id="cosmic-footer-partners-title" className="cosmic-footer__heading-lg text-xl font-medium">
            พันธมิตรของเรา
          </h2>
          <ul className="cosmic-footer__provider-list">
            {FOOTER_PARTNER_NAMES.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        <div className="cosmic-footer__main">
          <div className="cosmic-footer__brand max-lg:text-center">
            <Link href="/" className="cosmic-footer__brandmark" aria-label="cosmicbet หน้าหลัก">
              cosmic<span>bet</span>
            </Link>
            <p className="cosmic-footer__brand-text text-base font-medium">{FOOTER_TAGLINE}</p>
          </div>

          <section className="cosmic-footer__contact" aria-labelledby="cosmic-footer-contact-title">
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
          <nav className="cosmic-footer__legal" aria-label="ข้อกำหนดและนโยบาย">
            {FOOTER_LEGAL_LINKS.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function LineIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 11c0 5-5 8-10 10v-4C5 17 3 14 3 10s4-7 9-7 8 3 8 8Z" />
      <path d="M7 10h10M7 13h6" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m3 10 18-7-4 18-6-6-4 2 1-5 9-6-6 9" />
    </svg>
  );
}
