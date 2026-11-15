"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import type { HomeProviderLogoItem } from "@/app/types/providers";

interface ProviderLogoMarqueeProps {
  items: HomeProviderLogoItem[];
}

/**
 * แถวโลโก้ค่ายเลื่อนอัตโนมัติ — โลโก้สีจริง ระยะห่างกว้าง
 * ถูกเรียกใช้โดย ProvidersSection.tsx
 */
export function ProviderLogoMarquee({ items }: ProviderLogoMarqueeProps) {
  const t = useT("home");
  if (items.length === 0) return null;

  const renderGroup = (groupKey: string, ariaHidden?: boolean) => (
    <div
      className="provider-logo-marquee__group flex shrink-0 items-center gap-[clamp(3rem,9vw,4.5rem)] px-[clamp(1.5rem,4.5vw,2.25rem)]"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item) => (
        <Link
          key={`${groupKey}-${item.id}`}
          href={item.href}
          className="provider-logo-marquee__link flex h-10 w-[clamp(6.25rem,13vw,9.5rem)] shrink-0 items-center justify-center"
          aria-label={t("providers.logoAriaLabel", { name: item.name })}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          <Image
            src={item.logoSrc}
            alt=""
            width={152}
            height={40}
            className="provider-logo-marquee__img w-auto h-full max-w-full object-contain"
          />
        </Link>
      ))}
    </div>
  );

  return (
    <div
      className="provider-logo-marquee relative w-full overflow-hidden py-2"
      aria-label={t("providers.marqueeAriaLabel")}
    >
      <div className="provider-logo-marquee__track flex">
        {renderGroup("a")}
        {renderGroup("b", true)}
      </div>
    </div>
  );
}
