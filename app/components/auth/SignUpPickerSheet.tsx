"use client";

import React, { useEffect } from "react";
import { signUpCoverToneClass, SignUpCoverTone } from "../../data/signupMockData";

interface SignUpPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** ชื่อสำหรับ screen reader */
  ariaLabel: string;
  children: React.ReactNode;
}

/**
 * Sheet เลือกแบบ grid — ต้อง render เป็นลูกของ Dialog.Content (ห้าม portal ไป body เพราะ Radix inert)
 * ถูกเรียกจาก SignUpBottomDrawer
 */
export function SignUpPickerSheet({
  isOpen,
  onClose,
  ariaLabel,
  children,
}: SignUpPickerSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-auto lg:items-center lg:justify-center lg:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--surface-end)]/80 backdrop-blur-sm animate-in fade-in-0 lg:bg-black/50"
        aria-label="ปิดตัวเลือก"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="sign-up-picker-sheet relative z-10 flex max-h-[min(72dvh,520px)] w-full flex-col overflow-hidden rounded-t-[var(--radius-panel)] bg-[var(--surface-mid)] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.45)] animate-in slide-in-from-bottom duration-300 lg:max-h-[min(70dvh,420px)] lg:max-w-sm lg:rounded-[var(--radius-panel)] lg:shadow-[0_0_32px_rgba(119,112,183,0.18),0_16px_40px_rgba(0,0,0,0.5)] lg:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-2 lg:hidden">
          <span
            className="h-1 w-10 rounded-full bg-[var(--border-subtle)]"
            aria-hidden="true"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * ปุ่มใน grid 4 คอลัมน์ — ธนาคาร / ช่องทาง
 */
export function SignUpPickerGridItem({
  label,
  coverTone,
  selected,
  onSelect,
}: {
  label: string;
  coverTone: SignUpCoverTone;
  selected?: boolean;
  onSelect: () => void;
}) {
  const shortLabel = label.length <= 6 ? label : label.slice(0, 4);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-[var(--radius-panel)] bg-[var(--surface-hover)] p-2 transition-colors outline-none hover:bg-[var(--surface-selected)] focus-visible:outline-none ${
        selected ? "bg-[var(--surface-selected)] shadow-[inset_0_0_0_1px_var(--border-active)]" : ""
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full text-[9px] font-extrabold uppercase text-[var(--text-primary)] ${signUpCoverToneClass(coverTone)}`}
      >
        {shortLabel.slice(0, 3)}
      </span>
      <span className="line-clamp-2 text-center text-[10px] leading-tight text-[var(--text-secondary)]">
        {label}
      </span>
    </button>
  );
}
