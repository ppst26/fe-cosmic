"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { CopyIcon, ProfileAvatarIcon } from "../ui/Icons";

/**
 * หัวการ์ดโปรไฟล์ — avatar, ชื่อ, วันสมัคร, ไอดีเกม
 */
export function ProfileHubHeader({ profile }: { profile: ProfileUser }) {
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
    <section className="flex gap-3 pb-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--icon-default)]">
        <ProfileAvatarIcon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-[var(--text-primary)]">
          สวัสดี {profile.displayName}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-[var(--text-secondary)]">
          เข้าร่วมเมื่อ: {profile.joinedLabel}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="truncate text-[11px] text-[var(--text-muted)]">
            ID ผู้เล่น: {profile.memberId}
          </span>
          <button
            type="button"
            onClick={() => void handleCopyId()}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--icon-default)] hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)]"
            aria-label={copied ? "คัดลอกแล้ว" : "คัดลอกไอดีผู้เล่น"}
          >
            <CopyIcon className="h-3 w-3" />
          </button>
          {copied && (
            <span className="text-[10px] text-[var(--success)]" role="status">
              คัดลอกแล้ว
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
