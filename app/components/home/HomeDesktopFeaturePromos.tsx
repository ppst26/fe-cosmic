import React from "react";
import Link from "next/link";
import { HubNavLink } from "@/app/components/hub/HubNavLink";
import { hrefToHubId } from "@/app/components/hub/hubModalRegistry";
import { ChevronRightIcon } from "../ui/Icons";
import { DESKTOP_FEATURE_PROMOS } from "@/app/data/desktopLobbyMockData";

/**
 * การ์ดโปรโม 3 ใบใต้กริด — desktop mock
 * ถูกเรียกใช้ใน app/page.tsx
 */
export function HomeDesktopFeaturePromos() {
  return (
    <section
      className="home-desktop-feature-promos mt-6 hidden w-full min-w-0 lg:grid lg:grid-cols-3 lg:gap-3"
      aria-label="โปรโมชันและกิจกรรม"
    >
      {DESKTOP_FEATURE_PROMOS.map((item) => {
        const className = `home-desktop-feature-promos__card home-desktop-feature-promos__card--${item.tone}`;
        const cardInner = (
          <>
            <div className="min-w-0">
              <p className="text-base font-extrabold text-white">{item.title}</p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.subtitle}</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 shrink-0 opacity-80" />
          </>
        );

        return hrefToHubId(item.href) ? (
          <HubNavLink key={item.id} href={item.href} className={className}>
            {cardInner}
          </HubNavLink>
        ) : (
          <Link key={item.id} href={item.href} className={className}>
            {cardInner}
          </Link>
        );
      })}
    </section>
  );
}
