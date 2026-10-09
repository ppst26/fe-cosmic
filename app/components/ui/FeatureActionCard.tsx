import React from "react";
import Link from "@/lib/i18n/navigation";
import { HubNavLink } from "../hub/HubNavLink";
import { hrefToHubId } from "../hub/hubModalRegistry";
import { FeatureActionItem } from "../../types/lobby";
import { FeatureActionIcon } from "./FeatureActionIcon";

interface FeatureActionCardProps {
  item: FeatureActionItem;
}

function FeatureActionCtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (hrefToHubId(href)) {
    return (
      <HubNavLink href={href} className={className}>
        {children}
      </HubNavLink>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * FeatureActionCard — glass card + CTA ขาว/รอง (ร้านค้าเพชร / ภารกิจ / วงล้อ)
 * ถูกเรียกใช้โดย FeatureActionCards.tsx
 */
export function FeatureActionCard({ item }: FeatureActionCardProps) {
  const secondaryHref = item.secondaryHref ?? item.href;

  return (
    <article className="glass-card glass-card--feature-action flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-left">
          <h3 className="glass-card__title">{item.title}</h3>
          <p className="glass-card__desc">{item.description}</p>
        </div>
        <FeatureActionIcon
          id={item.icon}
          className="h-10 w-10 shrink-0 text-[var(--icon-default)] sm:h-11 sm:w-11"
        />
      </div>

      <div className="feature-action-card__ctas mt-auto flex flex-wrap gap-2">
        <FeatureActionCtaLink
          href={item.href}
          className="cosmic-cta-white cosmic-cta-white--sm"
        >
          {item.ctaPrimaryLabel}
        </FeatureActionCtaLink>
        <FeatureActionCtaLink
          href={secondaryHref}
          className="cosmic-cta-muted"
        >
          {item.ctaSecondaryLabel}
        </FeatureActionCtaLink>
      </div>
    </article>
  );
}
