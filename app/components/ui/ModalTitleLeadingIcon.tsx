"use client";

import React from "react";
import { Menu3DIcon } from "./Menu3DIcon";
import { cn } from "@/lib/utils";

/** ขนาดไอคอนนำหน้าหัวข้อ modal / sheet บน desktop */
export const MODAL_TITLE_LEADING_ICON_CLASS =
  "h-10 w-10 shrink-0 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] sm:h-11 sm:w-11";

type LeadingWrapProps = {
  desktopOnly?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * ห่อไอคอนหัวข้อ — desktopOnly ซ่อนบนมือถือ (hub modal ชิดซ้าย)
 */
function ModalTitleLeadingWrap({ desktopOnly = false, className, children }: LeadingWrapProps) {
  return (
    <span
      className={cn("modal-title-leading flex shrink-0 items-center", desktopOnly && "hidden lg:flex", className)}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

/**
 * ไอคอน 3D เมนูนำหน้าหัวข้อ modal
 */
export function ModalTitleLeadingMenuIcon({
  iconId,
  desktopOnly = false,
  className,
}: {
  iconId: string;
  desktopOnly?: boolean;
  className?: string;
}) {
  return (
    <ModalTitleLeadingWrap desktopOnly={desktopOnly} className={className}>
      <Menu3DIcon iconId={iconId} className={MODAL_TITLE_LEADING_ICON_CLASS} size={44} />
    </ModalTitleLeadingWrap>
  );
}

/**
 * รูป asset นำหน้าหัวข้อ modal (เช่น wallet ฝาก-ถอน)
 */
export function ModalTitleLeadingAssetIcon({
  src,
  desktopOnly = false,
  className,
}: {
  src: string;
  desktopOnly?: boolean;
  className?: string;
}) {
  return (
    <ModalTitleLeadingWrap desktopOnly={desktopOnly} className={className}>
      <img src={src} alt="" className={MODAL_TITLE_LEADING_ICON_CLASS} />
    </ModalTitleLeadingWrap>
  );
}

type ModalDesktopTitleBlockProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  titleIconId?: string;
  titleIconSrc?: string;
  /** แสดงไอคอนเฉพาะ lg+ (sheet ที่ยังเป็น bottom sheet บนมือถือ) */
  iconDesktopOnly?: boolean;
  className?: string;
};

/**
 * บล็อกหัวข้อ + ไอคอนซ้าย — ใช้ใน drawer ที่ไม่ได้ผ่าน ResponsiveSheetHeader
 */
export function ModalDesktopTitleBlock({
  title,
  subtitle,
  titleIconId,
  titleIconSrc,
  iconDesktopOnly = true,
  className,
}: ModalDesktopTitleBlockProps) {
  const hasIcon = Boolean(titleIconId || titleIconSrc);

  return (
    <div className={cn(hasIcon && "flex items-start gap-2.5 lg:items-center", className)}>
      {titleIconId ? (
        <ModalTitleLeadingMenuIcon iconId={titleIconId} desktopOnly={iconDesktopOnly} />
      ) : null}
      {titleIconSrc ? (
        <ModalTitleLeadingAssetIcon src={titleIconSrc} desktopOnly={iconDesktopOnly} />
      ) : null}
      <div className="min-w-0">
        {title}
        {subtitle}
      </div>
    </div>
  );
}
