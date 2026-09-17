import React from "react";
import { ChevronRightIcon } from "../ui/Icons";

/**
 * แถวเมนูโปรไฟล์ — ไอคอน + หัวข้อ + คำอธิบาย + chevron
 */
export function ProfileMenuRow({
  icon,
  title,
  description,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex w-full items-center gap-3 py-3.5 text-left transition-colors hover:bg-[var(--surface-selected)]/40 first:pt-0 last:pb-0";

  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mid)] text-[var(--icon-default)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[var(--text-primary)]">{title}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[var(--text-muted)]">{description}</span>
        )}
      </span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--icon-default)]" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

/**
 * กลุ่มเมนูในการ์ดเดียวกัน
 */
export function ProfileMenuCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-3">
      <h2 className="mb-1 text-sm font-bold text-[var(--text-primary)]">{title}</h2>
      <div className="divide-y divide-[var(--border-subtle)]/60">{children}</div>
    </section>
  );
}
