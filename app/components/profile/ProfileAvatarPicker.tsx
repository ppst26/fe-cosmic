"use client";

import React, { useState } from "react";
import { Dialog } from "radix-ui";
import type { ProfileUser } from "@/app/types/auth";
import { AVATAR_PRESETS, avatarPresetImageUrl } from "@/app/data/avatarPresets";
import { updateProfileAvatarPreset } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import {
  responsiveSheetCloseButtonClass,
  responsiveSheetContentClass,
  responsiveSheetOverlayClass,
} from "../ui/responsiveSheetDialog";
import { CloseIcon } from "../ui/Icons";

interface ProfileAvatarPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPresetId: string;
  onSaved: (profile: ProfileUser) => void;
}

/**
 * เลือก avatar preset — บันทึกผ่าน PATCH /api/auth/profile
 * เปิดจาก ProfileHubHeader
 */
export function ProfileAvatarPicker({
  open,
  onOpenChange,
  currentPresetId,
  onSaved,
}: ProfileAvatarPickerProps) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useT("profile");

  const handleSelect = async (presetId: string) => {
    if (presetId === currentPresetId || savingId) return;
    setError(null);
    setSavingId(presetId);
    const profile = await updateProfileAvatarPreset(presetId);
    setSavingId(null);
    if (!profile) {
      setError(t("avatar.saveFailed"));
      return;
    }
    onSaved(profile);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass("z-[70]")} />
        <Dialog.Content
          aria-describedby={undefined}
          className={responsiveSheetContentClass(
            "z-[70] flex max-h-[min(85dvh,520px)] min-h-0 flex-col gap-3 px-4 pb-5 pt-3 sm:px-5",
            { variant: "default" },
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <Dialog.Title className="text-lg font-medium text-[var(--text-primary)]">
              {t("avatar.pickerTitle")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className={responsiveSheetCloseButtonClass()}
                aria-label={t("avatar.close")}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {t("avatar.pickerDescription")}
          </p>

          {error ? (
            <p className="text-xs text-[var(--destructive)]" role="alert">{error}</p>
          ) : null}

          <ul
            className="grid min-h-0 flex-1 grid-cols-3 gap-3 overflow-y-auto py-1 sm:grid-cols-4"
            role="list"
          >
            {AVATAR_PRESETS.map((preset) => {
              const selected = preset.id === currentPresetId;
              const isSaving = savingId === preset.id;
              return (
                <li key={preset.id}>
                  <button
                    type="button"
                    disabled={Boolean(savingId)}
                    onClick={() => void handleSelect(preset.id)}
                    className={cn(
                      "flex w-full flex-col items-center gap-1.5 rounded-[var(--radius-panel)] p-2 transition-colors",
                      selected
                        ? "bg-[var(--surface-selected)] ring-2 ring-[var(--focus-ring)]"
                        : "bg-[var(--surface-hover)] hover:bg-[var(--surface-mid)]",
                      savingId && !isSaving && "opacity-60",
                    )}
                    aria-pressed={selected}
                    aria-busy={isSaving}
                  >
                    <img
                      src={avatarPresetImageUrl(preset.id, 128)}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover"
                      loading="lazy"
                    />
                    <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                      {t("avatar.presetName", { n: preset.number })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
