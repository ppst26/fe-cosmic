"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { CopyIcon, ProfileAvatarIcon } from "../ui/Icons";

/**
 * หัวการ์ดโปรไฟล์ — avatar, ชื่อ, วันสมัคร, ไอดีเกม
 */
export function ProfileHubHeader({
  profile,
  variant = "default",
}: {
  profile: ProfileUser;
  variant?: "default" | "sheet";
}) {
  const isSheet = variant === "sheet";
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
    <section
      className={`profile-hub-header flex gap-3 ${isSheet ? "profile-hub-header--sheet pb-0" : "pb-3"}`}
    >
      <div
        className={`profile-hub-header__avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          isSheet
            ? "bg-white/15 text-white"
            : "bg-[var(--surface-hover)] text-[var(--icon-default)]"
        }`}
      >
        <ProfileAvatarIcon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`profile-hub-header__name truncate text-sm font-medium ${
            isSheet ? "text-white" : "text-[var(--text-primary)]"
          }`}
        >
          สวัสดี {profile.displayName}
        </p>
        <p
          className={`profile-hub-header__meta mt-0.5 text-[11px] leading-snug ${
            isSheet ? "text-white/75" : "text-[var(--text-secondary)]"
          }`}
        >
          เข้าร่วมเมื่อ: {profile.joinedLabel}
        </p>
        <div className="profile-hub-header__id mt-1 flex items-center gap-1.5">
          <span
            className={`truncate text-[11px] ${isSheet ? "text-white/65" : "text-[var(--text-muted)]"}`}
          >
            ID ผู้เล่น: {profile.memberId}
          </span>
          <button
            type="button"
            onClick={() => void handleCopyId()}
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${
              isSheet
                ? "text-white/85 hover:bg-white/10 hover:text-white"
                : "text-[var(--icon-default)] hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)]"
            }`}
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
