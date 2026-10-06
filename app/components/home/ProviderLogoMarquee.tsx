"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomeProviderLogoItem } from "@/app/types/providers";

interface ProviderLogoMarqueeProps {
  items: HomeProviderLogoItem[];
}

/**
 * แถวโลโก้ค่ายเลื่อนอัตโนมัติ — grayscale ปกติ · hover โลโก้ขาว
 * ถูกเรียกใช้โดย ProvidersSection.tsx
 */
export function ProviderLogoMarquee({ items }: ProviderLogoMarqueeProps) {
  if (items.length === 0) return null;

  const renderGroup = (groupKey: string, ariaHidden?: boolean) => (
    <div
      className="provider-logo-marquee__group flex shrink-0 items-center gap-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.375rem,1vw,0.75rem)]"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item) => (
        <Link
          key={`${groupKey}-${item.id}`}
          href={item.href}
          className="provider-logo-marquee__link flex h-10 w-[clamp(6.25rem,13vw,9.5rem)] shrink-0 items-center justify-center"
          aria-label={`ผู้ให้บริการ ${item.name}`}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          <Image
            src={item.logoSrc}
            alt=""
            width={152}
            height={40}
            className="provider-logo-marquee__img w-auto h-full max-w-full object-contain"
            sizes="152px"
          />
        </Link>
      ))}
    </div>
  );

  return (
    <div
      className="provider-logo-marquee relative w-full overflow-hidden py-2"
      aria-label="ผู้ให้บริการเกม"
    >
      <div className="provider-logo-marquee__track flex">
        {renderGroup("a")}
        {renderGroup("b", true)}
      </div>
    </div>
  );
}
