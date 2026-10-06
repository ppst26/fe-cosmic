"use client";

import React from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  REWARD_FREESPINS_COMING_SOON_LABEL,
} from "@/app/data/rewardFeaturesMockData";

import { Menu3DIcon } from "@/app/components/ui/Menu3DIcon";

import { cn } from "@/lib/utils";
import type { RewardHubShortcut } from "@/app/types/reward";

/**

 * แถบไอคอน 3 ช่อง — หน้า /reward และ sub-route ที่เกี่ยวข้อง

 */

export function RewardHubShortcutRow({ shortcuts }: { shortcuts: RewardHubShortcut[] }) {

  const pathname = usePathname();

  const isActive = (shortcut: RewardHubShortcut) =>

    !shortcut.comingSoon && pathname === shortcut.href;

  return (

    <nav

      className="reward-hub-shortcuts mx-3 grid grid-cols-3 gap-2 sm:mx-4 sm:gap-2.5"

      aria-label="เมนูรางวัล"

    >

      {shortcuts.map((item) => {

        const active = isActive(item);

        const inactive = item.comingSoon === true;

        const inner = (

          <>

            <Menu3DIcon

              iconId={item.iconId}

              size={40}

              className={cn(

                "h-9 w-9 sm:h-10 sm:w-10",

                inactive && "opacity-45 grayscale-[0.35]",

              )}

            />

            <span

              className={cn(

                "line-clamp-2 text-[10px] font-medium leading-tight sm:text-[11px]",

                inactive ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]",

              )}

            >

              {item.label}

            </span>

            {inactive ? (

              <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--accent-muted)]">

                {REWARD_FREESPINS_COMING_SOON_LABEL}

              </span>

            ) : null}

          </>

        );

        const tileClass = cn(

          "reward-hub-shortcut flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center",

          active && "reward-hub-shortcut--active",

          inactive && "reward-hub-shortcut--inactive cursor-not-allowed",

        );

        if (inactive) {

          return (

            <div

              key={item.id}

              className={tileClass}

              aria-disabled="true"

              title={REWARD_FREESPINS_COMING_SOON_LABEL}

            >

              {inner}

            </div>

          );

        }

        return (

          <Link key={item.id} href={item.href} className={tileClass}>

            {inner}

          </Link>

        );

      })}

    </nav>

  );

}

