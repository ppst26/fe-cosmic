"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { ResponsiveSheetHeader, ResponsiveSheetTitleNotch } from "../ui/ResponsiveSheetHeader";
import { COSMIC_SHEET_SOFT_GLASS_INTERACTIVE } from "../ui/cosmicButtonClasses";
import { responsiveSheetContentClass, responsiveSheetOverlayClass } from "../ui/responsiveSheetDialog";
import { LocaleFlag } from "./LocaleFlag";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale, useSwitchLocale } from "@/lib/i18n/navigation";
import { clearLayerParams } from "@/lib/overlayUrl";
import { cn } from "@/lib/utils";

interface LanguagePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sheet เลือกภาษา (ธง + ชื่อภาษาในภาษานั้น) — เปิดจากไทล์ "ภาษา" ใน RightMenuDrawer
 * เลือกภาษาอื่น → ตั้ง cookie แล้วโหลดหน้าเดิมในภาษาใหม่ (ตัด ?layer=language ออก)
 */
export function LanguagePickerSheet({ isOpen, onClose }: LanguagePickerSheetProps) {
  const t = useT("common");
  const current = useLocale();
  const switchLocale = useSwitchLocale();

  const select = (code: Locale) => {
    if (code === current) {
      onClose();
      return;
    }
    const params = new URLSearchParams(window.location.search);
    clearLayerParams(params, "language");
    const qs = params.toString();
    switchLocale(code, `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass()} />
        <Dialog.Content
          aria-describedby="language-picker-desc"
          className={responsiveSheetContentClass("max-h-[min(85dvh,640px)] overflow-y-auto")}
        >
          <ResponsiveSheetTitleNotch>
            <ResponsiveSheetHeader
              closeAriaLabel={t("languagePicker.close")}
              title={
                <Dialog.Title className="cosmic-type-sheet-title text-xl sm:text-2xl">
                  {t("languagePicker.title")}
                </Dialog.Title>
              }
              subtitle={
                <p id="language-picker-desc" className="cosmic-type-sheet-desc mt-1">
                  {t("languagePicker.description")}
                </p>
              }
            />
          </ResponsiveSheetTitleNotch>

          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2" role="list">
            {LOCALES.map((code) => {
              const selected = code === current;
              return (
                <li key={code}>
                  <button
                    type="button"
                    lang={code}
                    aria-pressed={selected}
                    onClick={() => select(code)}
                    className={cn(
                      COSMIC_SHEET_SOFT_GLASS_INTERACTIVE,
                      "flex min-h-14 w-full items-center gap-3 px-3.5 py-2.5 text-left outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--border-active)]",
                      selected && "shadow-[inset_0_0_0_2px_var(--border-active)]",
                    )}
                  >
                    <LocaleFlag locale={code} className="h-8 w-8" />
                    <span className="min-w-0 flex-1 truncate text-base font-medium text-[var(--text-primary)]">
                      {LOCALE_LABELS[code].native}
                    </span>
                    {selected ? <CheckIcon className="h-5 w-5 shrink-0 text-[var(--border-active)]" /> : null}
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
