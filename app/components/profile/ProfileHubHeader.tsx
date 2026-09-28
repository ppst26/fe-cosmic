"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { getSignUpBankById, signUpCoverToneClass } from "@/app/data/signupMockData";
import { CopyIcon, ProfileAvatarIcon } from "../ui/Icons";

/**
 * แสดงเบอร์โทรแบบตัวเลขต่อกัน (ไม่ mask) ในหัว sheet
 */
function formatPhoneForHeader(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits || phone;
}

/**
 * หัวการ์ดโปรไฟล์ — sheet: avatar + เบอร์ + ธนาคาร · default: ชื่อ + วันสมัคร + ID
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

  if (isSheet) {
    const bank = getSignUpBankById(profile.bankId);
    const bankMarkLabel = (bank?.label ?? profile.bankLabel).slice(0, 3);
    const bankToneClass = signUpCoverToneClass(bank?.coverTone ?? "emerald");

    return (
      <section className="profile-hub-header profile-hub-header--sheet flex items-center gap-3 pb-0">
        <div
          className="profile-hub-header__avatar profile-hub-header__avatar--sheet flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-hover)] text-[var(--icon-default)] shadow-[0_4px_14px_rgb(0_0_0_/_0.18)]"
          aria-hidden="true"
        >
          <ProfileAvatarIcon className="h-8 w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="profile-hub-header__phone truncate text-xl font-medium leading-tight tracking-tight text-[var(--text-primary)] tabular-nums">
            {formatPhoneForHeader(profile.phone)}
          </p>
          <div className="profile-hub-header__bank mt-1.5 flex min-w-0 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-medium uppercase text-white ${bankToneClass}`}
              title={profile.bankLabel}
              aria-hidden="true"
            >
              {bankMarkLabel}
            </span>
            <span className="profile-hub-header__account truncate text-sm font-medium tabular-nums text-[var(--text-secondary)]">
              {profile.bankAccountNumber}
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-hub-header flex gap-3 pb-3">
      <div
        className="profile-hub-header__avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--icon-default)]"
      >
        <ProfileAvatarIcon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="profile-hub-header__name truncate text-sm font-medium text-[var(--text-primary)]">
          สวัสดี {profile.displayName}
        </p>
        <p className="profile-hub-header__meta mt-0.5 text-[11px] leading-snug text-[var(--text-secondary)]">
          เข้าร่วมเมื่อ: {profile.joinedLabel}
        </p>
        <div className="profile-hub-header__id mt-1 flex items-center gap-1.5">
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
