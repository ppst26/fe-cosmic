"use client";

import React from "react";
import { Dialog } from "radix-ui";
import { ResponsiveSheetHeader, ResponsiveSheetTitleNotch } from "../ui/ResponsiveSheetHeader";
import { responsiveSheetContentClass, responsiveSheetOverlayClass } from "../ui/responsiveSheetDialog";
import { THEMES, type ThemeOption } from "@/lib/themes";
import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface ThemePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThemeGrid({
  title,
  themes,
  activeTheme,
  onSelect,
}: {
  title: string;
  themes: ThemeOption[];
  activeTheme: string;
  onSelect: (key: string) => void;
}) {
  const t = useT("common");
  return (
    <section className="mt-4 first:mt-0">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="h-4 w-1.5 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
        <h3 className="text-sm font-semibold tracking-wide text-[var(--text-secondary)]">{title}</h3>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list">
        {themes.map((theme) => {
          const selected = activeTheme === theme.key;
          return (
            <li key={theme.key}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(theme.key)}
                className={cn(
                  "group relative block w-full cursor-pointer overflow-hidden rounded-2xl border-0 p-0 text-left outline-none transition-transform duration-[var(--motion-fast)] focus-visible:shadow-[0_0_0_2px_var(--focus-ring)]",
                  selected ? "shadow-[0_0_0_2px_var(--border-active)]" : "hover:scale-[1.02]",
                )}
              >
                <span className="flex h-9 w-full">
                  {theme.colors.map((c, i) => (
                    <span key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span
                  className="flex items-center justify-between gap-2 p-2.5"
                  style={{ backgroundColor: theme.bgColor }}
                >
                  <span className="min-w-0">
                    <span
                      className="block truncate text-xs font-bold"
                      style={{ color: theme.isDark ? "#ffffff" : "#1f2937" }}
                    >
                      {theme.name}
                    </span>
                    <span
                      className="block text-[10px]"
                      style={{ color: theme.isDark ? "#a1a1aa" : "#6b7280" }}
                    >
                      {theme.isDark ? t("theme.darkLabel") : t("theme.lightLabel")}
                    </span>
                  </span>
                  {selected ? (
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: theme.colors[0], color: "#ffffff" }}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Sheet เลือกธีมสี — เปิดจากปุ่มลอยล่างขวา (FloatingActions)
 * เลือกแล้ว setTheme (data-theme บน <html> + localStorage) และปิด sheet
 */
export function ThemePickerSheet({ isOpen, onClose }: ThemePickerSheetProps) {
  const t = useT("common");
  const { theme, setTheme } = useTheme();

  const pick = (key: string) => {
    setTheme(key);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={responsiveSheetOverlayClass()} />
        <Dialog.Content
          aria-describedby="theme-picker-desc"
          className={responsiveSheetContentClass(
            "flex max-h-[min(85dvh,680px)] min-h-0 flex-col overflow-hidden gap-0",
          )}
        >
          <ResponsiveSheetTitleNotch className="shrink-0">
            <ResponsiveSheetHeader
              closeAriaLabel={t("theme.close")}
              title={
                <Dialog.Title className="cosmic-type-sheet-title text-xl sm:text-2xl">
                  {t("theme.title")}
                </Dialog.Title>
              }
              subtitle={
                <p id="theme-picker-desc" className="cosmic-type-sheet-desc mt-1">
                  {t("theme.description")}
                </p>
              }
            />
          </ResponsiveSheetTitleNotch>

          <div className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pb-1 pt-3">
            <ThemeGrid
              title={t("theme.dark")}
              themes={THEMES.filter((x) => x.isDark)}
              activeTheme={theme}
              onSelect={pick}
            />
            <ThemeGrid
              title={t("theme.light")}
              themes={THEMES.filter((x) => !x.isDark)}
              activeTheme={theme}
              onSelect={pick}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
