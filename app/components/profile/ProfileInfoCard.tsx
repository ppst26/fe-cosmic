import React from "react";
import { COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";

/**
 * การ์ดข้อมูลแบบ label / value แถวละบรรทัด
 */
export function ProfileInfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <section className={`${COSMIC_PANEL_GLASS} px-4 py-3`}>
      <h2 className="mb-3 text-sm font-medium text-[var(--text-primary)]">{title}</h2>
      <dl className="divide-y divide-[var(--border-subtle)]/60">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <dt className="shrink-0 text-sm text-[var(--text-secondary)]">{row.label}</dt>
            <dd className="truncate text-right text-sm font-medium text-[var(--text-primary)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
