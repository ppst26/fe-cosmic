"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { CopyIcon, VerifiedCheckIcon } from "../ui/Icons";
import { UserAvatar } from "./UserAvatar";
import {
  COSMIC_BTN_GLASS_ICON,
  COSMIC_PANEL_GLASS,
} from "../ui/cosmicButtonClasses";

/**
 * สรุปโปรไฟล์ — avatar, เบอร์, ID, badge ยืนยัน
 */
export function ProfileSummaryCard({ profile }: { profile: ProfileUser }) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.memberId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  return (
    <section className={`${COSMIC_PANEL_GLASS} flex gap-4 px-4 py-4`}>
      <UserAvatar profile={profile} size="lg" className="!h-16 !w-16 !rounded-[var(--radius-panel)]" />

      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="truncate text-lg font-medium text-[var(--text-primary)]">
          {profile.phoneMasked}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">
            ID: {profile.memberId}
          </span>
          <button
            type="button"
            onClick={() => void handleCopyId()}
            className={`${COSMIC_BTN_GLASS_ICON} !h-7 !w-7 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]`}
            aria-label={copied ? "คัดลอกแล้ว" : "คัดลอก ID"}
          >
            <CopyIcon className="h-4 w-4" />
          </button>
          {copied && (
            <span className="text-xs text-[var(--success)]" role="status">
              คัดลอกแล้ว
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--success)]">
          <VerifiedCheckIcon className="h-3 w-3" />
          ยืนยันเบอร์แล้ว
        </span>
      </div>
    </section>
  );
}
