import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProviderItem } from "../../types/lobby";

interface ProviderCardProps {
  provider: ProviderItem;
}

/**
 * ProviderCard — ช่องแนวนอนพื้นเข้มเตี้ย โลโก้ object-fit: contain, padding 16–20px ไม่ตัดโลโก้
 * ถ้าไม่มี logoSrc แสดงชื่อค่ายแทน (ห้ามวาดโลโก้เลียนแบบเอง)
 * ถูกเรียกใช้โดย ProvidersSection.tsx
 */
export function ProviderCard({ provider }: ProviderCardProps) {
  const { name, href, logoSrc } = provider;

  return (
    <Link
      href={href}
      aria-label={`ผู้ให้บริการ ${name}`}
      className="relative flex h-16 items-center justify-center rounded-[var(--radius-card)] bg-[var(--surface-mid)] px-4 py-4 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-hover)] sm:h-20 sm:px-5"
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 33vw"
          className="object-contain p-4 sm:p-5"
        />
      ) : (
        <span className="line-clamp-1 text-center text-[13px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)] sm:text-sm">
          {name}
        </span>
      )}
    </Link>
  );
}
