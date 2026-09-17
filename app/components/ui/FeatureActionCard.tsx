import React from "react";
import Link from "next/link";
import { HubNavLink } from "../hub/HubNavLink";
import { hrefToHubId } from "../hub/hubModalRegistry";
import { FeatureActionItem } from "../../types/lobby";
import { FeatureActionIcon } from "./FeatureActionIcon";

interface FeatureActionCardProps {
  item: FeatureActionItem;
}

/**
 * FeatureActionCard — หัวข้อซ้าย ไอคอนเรียบขวา (ร้านค้าเพชร / ภารกิจ / วงล้อ)
 * ถูกเรียกใช้โดย FeatureActionCards.tsx
 */
export function FeatureActionCard({ item }: FeatureActionCardProps) {
  const className =
    "surface flex min-h-[92px] items-center justify-between gap-3 rounded-[var(--radius-panel)] px-5 py-4 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-hover)]";
  const inner = (
    <>
      <span className="text-lg font-bold leading-snug text-[var(--text-primary)] sm:text-xl">
        {item.title}
      </span>
      <FeatureActionIcon id={item.icon} className="h-10 w-10 shrink-0 text-[var(--icon-default)]" />
    </>
  );

  if (hrefToHubId(item.href)) {
    return (
      <HubNavLink href={item.href} className={className}>
        {inner}
      </HubNavLink>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  );
}
