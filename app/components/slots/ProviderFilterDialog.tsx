"use client";

import React, { useMemo, useState } from "react";
import { Dialog } from "radix-ui";
import {
  CheckIcon,
  ChevronRightIcon,
  EyeIcon,
  FilterProvidersGridIcon,
  GamepadIcon,
} from "../ui/Icons";
import { COSMIC_BTN_GLASS_ICON } from "../ui/cosmicButtonClasses";
import { getTabIcon, type GenericFilterTabItem } from "./SlotFilterTabs";
import { ModalTitleLeadingMenuIcon } from "../ui/ModalTitleLeadingIcon";

const PROVIDER_TAB_IDS = new Set(["all-in-one", "all-providers"]);

type FilterDialogView = "root" | "providers" | "categories";

function splitFilterTabs(tabs: GenericFilterTabItem[]) {
  const providerTabs = tabs.filter((tab) => PROVIDER_TAB_IDS.has(tab.id));
  const categoryTabs = tabs.filter((tab) => !PROVIDER_TAB_IDS.has(tab.id));
  return { providerTabs, categoryTabs };
}

function labelForTab(tabs: GenericFilterTabItem[], id: string): string {
  return tabs.find((tab) => tab.id === id)?.label ?? "—";
}

export interface ProviderFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabs: GenericFilterTabItem[];
  activeTabId: string;
  onApply: (tabId: string) => void;
  /** ชื่อแถวหมวดย่อย (สล็อต = ฟีเจอร์, คาสิโน = ประเภทโต๊ะ ฯลฯ) */
  categoryGroupLabel?: string;
}

/**
 * Dialog ตัวกรองค่ายเกม — ใช้ mock tabs ที่มีอยู่ แบ่งเป็น ค่ายเกม / หมวดย่อย
 * ถูกเรียกจาก ProviderCategoryToolbar
 */
export function ProviderFilterDialog({
  open,
  onOpenChange,
  tabs,
  activeTabId,
  onApply,
  categoryGroupLabel = "หมวดย่อย",
}: ProviderFilterDialogProps) {
  const { providerTabs, categoryTabs } = useMemo(() => splitFilterTabs(tabs), [tabs]);
  const [view, setView] = useState<FilterDialogView>("root");
  const [pendingTabId, setPendingTabId] = useState(activeTabId);
  const [hideUnavailable, setHideUnavailable] = useState(false);

  const resetDialogState = (nextActiveId: string) => {
    setView("root");
    setPendingTabId(nextActiveId);
    setHideUnavailable(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetDialogState(activeTabId);
    }
    onOpenChange(nextOpen);
  };

  const applyAndClose = () => {
    onApply(pendingTabId);
    onOpenChange(false);
  };

  const providerSummary = PROVIDER_TAB_IDS.has(pendingTabId)
    ? labelForTab(providerTabs, pendingTabId)
    : labelForTab(providerTabs, "all-in-one");

  const categorySummary = !PROVIDER_TAB_IDS.has(pendingTabId)
    ? labelForTab(categoryTabs, pendingTabId)
    : "—";

  const subTabs = view === "providers" ? providerTabs : categoryTabs;
  const subTitle = view === "providers" ? "ค่ายเกม" : categoryGroupLabel;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="cosmic-dialog-overlay fixed inset-0 z-[68] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          aria-describedby={undefined}
          className="provider-filter-dialog cosmic-modal-shell fixed left-1/2 top-1/2 z-[72] flex max-h-[min(85dvh,520px)] w-[min(calc(100vw-2rem),360px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-[var(--text-primary)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
        >
          <header className="provider-filter-dialog__header">
            {view === "root" ? (
              <span className="provider-filter-dialog__header-spacer" aria-hidden="true" />
            ) : (
              <button
                type="button"
                className={`${COSMIC_BTN_GLASS_ICON} provider-filter-dialog__header-btn text-[var(--icon-default)]`}
                aria-label="กลับ"
                onClick={() => setView("root")}
              >
                <ChevronRightIcon className="h-4 w-4 rotate-180" />
              </button>
            )}

            <Dialog.Title className="provider-filter-dialog__title inline-flex items-center justify-center gap-2">
              <ModalTitleLeadingMenuIcon iconId="slots" desktopOnly />
              <span>{view === "root" ? "FILTER" : subTitle}</span>
            </Dialog.Title>

            <button
              type="button"
              className={`${COSMIC_BTN_GLASS_ICON} provider-filter-dialog__header-btn text-[var(--icon-active)]`}
              aria-label="ใช้ตัวกรอง"
              onClick={applyAndClose}
            >
              <CheckIcon className="h-[18px] w-[18px]" />
            </button>
          </header>

          {view === "root" ? (
            <>
              <ul className="provider-filter-dialog__list">
                <li>
                  <button
                    type="button"
                    className="provider-filter-dialog__row"
                    onClick={() => setView("providers")}
                  >
                    <span className="provider-filter-dialog__row-icon" aria-hidden="true">
                      <FilterProvidersGridIcon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="provider-filter-dialog__row-body">
                      <span className="provider-filter-dialog__row-label">ค่ายเกม</span>
                      <span className="provider-filter-dialog__row-value">{providerSummary}</span>
                    </span>
                    <ChevronRightIcon className="provider-filter-dialog__row-chevron" />
                  </button>
                </li>
                {categoryTabs.length > 0 ? (
                  <li>
                    <button
                      type="button"
                      className="provider-filter-dialog__row"
                      onClick={() => setView("categories")}
                    >
                      <span className="provider-filter-dialog__row-icon" aria-hidden="true">
                        <GamepadIcon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="provider-filter-dialog__row-body">
                        <span className="provider-filter-dialog__row-label">{categoryGroupLabel}</span>
                        {categorySummary !== "—" ? (
                          <span className="provider-filter-dialog__row-value">{categorySummary}</span>
                        ) : null}
                      </span>
                      <ChevronRightIcon className="provider-filter-dialog__row-chevron" />
                    </button>
                  </li>
                ) : null}
              </ul>

              <div className="provider-filter-dialog__footer">
                <div className="provider-filter-dialog__toggle-row">
                  <span className="provider-filter-dialog__row-icon" aria-hidden="true">
                    <EyeIcon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="provider-filter-dialog__toggle-label">ซ่อนรายการไม่พร้อมใช้</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={hideUnavailable}
                    className={`provider-filter-dialog__switch ${hideUnavailable ? "is-on" : ""}`}
                    onClick={() => setHideUnavailable((on) => !on)}
                  >
                    <span className="provider-filter-dialog__switch-knob" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <ul className="provider-filter-dialog__list provider-filter-dialog__list--sub">
              {subTabs.map((tab) => {
                const selected = tab.id === pendingTabId;
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      className={`provider-filter-dialog__option ${selected ? "is-selected" : ""}`}
                      onClick={() => {
                        setPendingTabId(tab.id);
                        setView("root");
                      }}
                    >
                      <span className="provider-filter-dialog__option-icon" aria-hidden="true">
                        {getTabIcon(tab.iconId, "h-5 w-5")}
                      </span>
                      <span className="provider-filter-dialog__option-label">{tab.label}</span>
                      {selected ? (
                        <CheckIcon className="provider-filter-dialog__option-check" />
                      ) : (
                        <span className="provider-filter-dialog__option-check-placeholder" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
