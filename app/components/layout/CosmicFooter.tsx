"use client";

import React from "react";
import Link from "next/link";
import {
  FOOTER_COPYRIGHT,
  FOOTER_GAME_LINKS,
  FOOTER_INFO_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_PARTNER_NAMES,
  FOOTER_PAYMENT_LABELS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TAGLINE,
} from "@/app/data/footerMockData";

interface CosmicFooterProps {
  className?: string;
}

/**
 * ส่วนท้ายเว็บ cosmicbet — แปลจาก demo HTML responsive footer
 * ใช้ใน root layout (แสดงทุกหน้า)
 */
export function CosmicFooter({ className = "" }: CosmicFooterProps) {
  const taglineLines = FOOTER_TAGLINE.split("\n");

  return (
    <footer className={`cosmic-footer ${className}`.trim()} aria-label="ส่วนท้ายเว็บไซต์ cosmicbet">
      <div className="cosmic-footer__container">
        <section className="cosmic-footer__partners" aria-labelledby="cosmic-footer-partners-title">
          <h2 id="cosmic-footer-partners-title" className="cosmic-footer__heading-lg">
            พันธมิตรของเรา
          </h2>
          <ul className="cosmic-footer__provider-list">
            {FOOTER_PARTNER_NAMES.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>

        <div className="cosmic-footer__main">
          <div className="cosmic-footer__brand">
            <Link href="/" className="cosmic-footer__brandmark" aria-label="cosmicbet หน้าหลัก">
              cosmic<span>bet</span>
            </Link>
            <p className="cosmic-footer__brand-text">
              {taglineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <nav aria-label="เกม">
            <h3 className="cosmic-footer__heading-sm">เกม</h3>
            <ul className="cosmic-footer__links">
              {FOOTER_GAME_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="ข้อมูล">
            <h3 className="cosmic-footer__heading-sm">ข้อมูล</h3>
            <ul className="cosmic-footer__links">
              {FOOTER_INFO_LINKS.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="cosmic-footer__contact" aria-labelledby="cosmic-footer-contact-title">
            <h3 id="cosmic-footer-contact-title" className="cosmic-footer__heading-sm">
              ติดต่อเรา
            </h3>
            <div className="cosmic-footer__social">
              {FOOTER_SOCIAL_LINKS.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label === "LINE" ? <LineIcon /> : <TelegramIcon />}
                  {item.label}
                </Link>
              ))}
            </div>
            <h3 className="cosmic-footer__heading-sm">ช่องทางชำระเงิน</h3>
            <ul className="cosmic-footer__payments">
              {FOOTER_PAYMENT_LABELS.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="cosmic-footer__bottom">
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
