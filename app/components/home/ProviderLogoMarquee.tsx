"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomeProviderLogoItem } from "@/app/data/homeProviderLogosData";

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
    <div className="provider-logo-marquee__group" aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <Link
          key={`${groupKey}-${item.id}`}
          href={item.href}
          className="provider-logo-marquee__link"
          aria-label={`ผู้ให้บริการ ${item.name}`}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          <Image
            src={item.logoSrc}
            alt=""
            width={152}
            height={40}
            className="provider-logo-marquee__img"
            sizes="152px"
          />
        </Link>
      ))}
    </div>
  );

  return (
    <div className="provider-logo-marquee" aria-label="ผู้ให้บริการเกม">
      <div className="provider-logo-marquee__track">
        {renderGroup("a")}
        {renderGroup("b", true)}
      </div>
    </div>
  );
}
