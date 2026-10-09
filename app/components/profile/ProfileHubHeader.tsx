"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import type { ProfileUser } from "@/app/types/auth";
import { getSignUpBankById, signUpCoverToneClass } from "@/app/data/signupMockData";
import { CopyIcon } from "../ui/Icons";
import { UserAvatar } from "./UserAvatar";
import { ProfileAvatarPicker } from "./ProfileAvatarPicker";
import { cn } from "@/lib/utils";
import { formatJoinedDate } from "@/lib/auth/profileFormat";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale } from "@/lib/i18n/navigation";

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
  onProfileUpdated,
}: {
  profile: ProfileUser;
  variant?: "default" | "sheet";
  onProfileUpdated?: (profile: ProfileUser) => void;
}) {
  const isSheet = variant === "sheet";
  const [pickerOpen, setPickerOpen] = useState(false);
  const { showToast } = useToast();
  const t = useT("profile");
  const locale = useLocale();
  /** th ใช้ joinedLabel จาก server ตามเดิม · ภาษาอื่นจัดรูปวันที่ใหม่ตามภาษา */
  const joinedLabel = locale === "th" ? profile.joinedLabel : formatJoinedDate(profile.createdAt, locale);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.memberId);
      showToast(t("hub.playerIdCopied"), "success", 2500);
    } catch {
      showToast(t("hub.copyPlayerIdFailed"), "error");
    }
  };

  const avatarButton = (
    <button
      type="button"
      onClick={() => setPickerOpen(true)}
      className={cn(
        "group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]",
        isSheet ? "rounded-xl" : "rounded-full",
      )}
      aria-label={t("avatar.change")}
    >
      <UserAvatar
        profile={profile}
        size={isSheet ? "lg" : "md"}
        className={cn(
          isSheet && "shadow-[0_4px_14px_rgb(0_0_0_/_0.18)]",
          "ring-2 ring-transparent transition-[box-shadow,ring-color] group-hover:ring-[var(--border-active)]",
        )}
      />
    </button>
  );

  const picker = (
    <ProfileAvatarPicker
      open={pickerOpen}
      onOpenChange={setPickerOpen}
      currentPresetId={profile.avatarPresetId}
      onSaved={(next) => onProfileUpdated?.(next)}
    />
  );

  if (isSheet) {
    const bank = getSignUpBankById(profile.bankId);
    const bankMarkLabel = (bank?.label ?? profile.bankLabel).slice(0, 3);
    const bankToneClass = signUpCoverToneClass(bank?.coverTone ?? "emerald");

    return (
      <>
        <section className="profile-hub-header profile-hub-header--sheet flex items-center gap-3 pb-0">
          {avatarButton}

          <div className="min-w-0 flex-1">
            <p className="profile-hub-header__phone truncate text-xl font-medium leading-tight tracking-tight text-[var(--text-primary)] tabular-nums">
              {formatPhoneForHeader(profile.phone)}
            </p>
            <div className="profile-hub-header__bank mt-1.5 flex min-w-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium uppercase leading-none text-white ${bankToneClass}`}
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
        {picker}
      </>
    );
  }

  return (
    <>
      <section className="profile-hub-header flex gap-3 pb-3">
        {avatarButton}

        <div className="min-w-0 flex-1">
          <p className="profile-hub-header__name truncate text-sm font-medium text-[var(--text-primary)]">
            {t("hub.greeting", { name: profile.displayName })}
          </p>
          <p className="profile-hub-header__meta mt-0.5 text-xs leading-normal text-[var(--text-secondary)]">
            {t("hub.joinedAt", { date: joinedLabel })}
          </p>
          <div className="profile-hub-header__id mt-1 flex items-center gap-1.5">
            <span className="truncate text-xs text-[var(--text-secondary)]">
              {t("hub.playerId", { id: profile.memberId })}
            </span>
            <button
              type="button"
              onClick={() => void handleCopyId()}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--icon-default)] hover:bg-[var(--surface-hover)] hover:text-[var(--icon-active)]"
              aria-label={t("hub.copyPlayerId")}
            >
              <CopyIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>
      {picker}
    </>
  );
}
