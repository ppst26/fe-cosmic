"use client";

import React from "react";
import type { ApiResource } from "@/app/hooks/useApi";
import { ErrorState, LoadingState } from "./StatusState";
import { LoginPrompt } from "./LoginPrompt";
import { useApiErrorText } from "@/app/hooks/useApiErrorText";
import { useT } from "@/lib/i18n/I18nProvider";

interface ResourceGateProps<T> {
  resource: ApiResource<T>;
  /** render เมื่อมีข้อมูล (ระหว่าง refresh ยังแสดงค่าเดิม) */
  children: (data: T) => React.ReactNode;
  loadingLabel?: string;
  errorTitle?: string;
  /** แทน LoadingState เริ่มต้น เช่น skeleton ขนาดเท่าเนื้อหาจริง (กัน layout ขยับ) */
  loadingFallback?: React.ReactNode;
  /** แสดงเมื่อ idle (ยังไม่ login) — ค่าเริ่มต้นเป็นการ์ดชวนเข้าสู่ระบบ · ส่ง null เพื่อซ่อน */
  idleFallback?: React.ReactNode;
  className?: string;
}

/**
 * แสดงข้อมูลจาก useApi ครบ 3 สถานะ — กำลังโหลด · โหลดไม่สำเร็จ (ปุ่มลองใหม่) · มีข้อมูล
 * ใช้ใน sheet ฝาก/ถอน และหน้าที่อ่านข้อมูลผู้ใช้ผ่าน app/hooks/api/*
 */
export function ResourceGate<T>({
  resource,
  children,
  loadingLabel,
  errorTitle,
  loadingFallback,
  idleFallback,
  className,
}: ResourceGateProps<T>) {
  const t = useT("common");
  const apiErrorText = useApiErrorText();
  if (resource.data !== null) return <>{children(resource.data)}</>;
  if (resource.status === "idle") {
    return <>{idleFallback === undefined ? <LoginPrompt className={className} /> : idleFallback}</>;
  }
  if (resource.status === "error") {
    return (
      <ErrorState
        className={className}
        title={errorTitle ?? t("loadFailed")}
        description={apiErrorText(resource.error?.message)}
        primaryAction={{ label: t("retry"), onClick: resource.refresh }}
      />
    );
  }
  return <>{loadingFallback ?? <LoadingState className={className} label={loadingLabel ?? t("loading")} />}</>;
}
