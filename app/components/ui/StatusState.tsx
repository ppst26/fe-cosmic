import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * สถานะกลางของหน้า/ส่วนข้อมูล — โหลด · ว่าง · ผิดพลาด · skeleton (สีทึบตาม design.md)
 * ใช้ใน app/error.tsx · app/not-found.tsx · app/loading.tsx และส่วนที่โหลดข้อมูลจาก API
 */

type StatusTone = "neutral" | "error";

interface StatusAction {
  label: string;
  /** ลิงก์ภายในเว็บ — ถ้าไม่ใส่ต้องมี onClick */
  href?: string;
  onClick?: () => void;
}

export interface StatusStateProps {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatusTone;
  /** card = การ์ดทึบรอบเนื้อหา · plain = วางบนพื้นส่วนนั้นตรง ๆ */
  variant?: "card" | "plain";
  primaryAction?: StatusAction;
  secondaryAction?: StatusAction;
  /** รหัสอ้างอิงเล็ก ๆ ใต้ปุ่ม เช่น error digest */
  code?: string;
  className?: string;
}

function ActionButton({ action, kind }: { action: StatusAction; kind: "primary" | "secondary" }) {
  const className = cn(
    kind === "primary" ? "status-state__primary" : "status-state__secondary",
    "inline-flex min-h-11 min-w-32 items-center justify-center px-5 text-sm font-medium",
  );
  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

/** กล่องสถานะ — ไอคอน · หัวข้อ · คำอธิบาย · ปุ่ม (ใช้ตรงหรือผ่าน EmptyState / ErrorState) */
export function StatusState({
  title,
  description,
  icon,
  tone = "neutral",
  variant = "plain",
  primaryAction,
  secondaryAction,
  code,
  className,
}: StatusStateProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "status-state mx-auto flex w-full max-w-md flex-col items-center gap-4 px-5 py-10 text-center",
        tone === "error" && "status-state--error",
        variant === "card" && "status-state--card",
        className,
      )}
    >
      {icon ? (
        <span className="status-state__icon grid size-14 place-items-center rounded-full" aria-hidden>
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-medium leading-snug text-balance sm:text-lg">{title}</h2>
        {description ? (
          <p className="status-state__description text-sm leading-relaxed">{description}</p>
        ) : null}
      </div>
      {primaryAction || secondaryAction ? (
        <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row">
          {primaryAction ? <ActionButton action={primaryAction} kind="primary" /> : null}
          {secondaryAction ? <ActionButton action={secondaryAction} kind="secondary" /> : null}
        </div>
      ) : null}
      {code ? <p className="status-state__code font-mono text-xs">รหัสอ้างอิง: {code}</p> : null}
    </div>
  );
}

/** ไม่มีข้อมูล — เช่น ยังไม่มีรายการในช่วงวันที่เลือก */
export function EmptyState(props: Omit<StatusStateProps, "tone">) {
  return <StatusState icon={<EmptyIcon />} {...props} tone="neutral" />;
}

/** โหลด/ทำรายการไม่สำเร็จ — ใส่ primaryAction เป็นปุ่มลองใหม่ */
export function ErrorState(props: Omit<StatusStateProps, "tone">) {
  return <StatusState icon={<AlertIcon />} {...props} tone="error" />;
}

/** กำลังโหลด — spinner + ข้อความ (ใช้ใน loading.tsx และส่วนที่รอ API) */
export function LoadingState({
  label = "กำลังโหลด…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex w-full flex-col items-center justify-center gap-3 py-12", className)}
    >
      <span className="status-spinner size-8" aria-hidden />
      <span className="status-state__description text-sm">{label}</span>
    </div>
  );
}

/** แท่ง skeleton ทึบ — กำหนดขนาดด้วย className เช่น "h-4 w-32" */
export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("status-skeleton block", className)} aria-hidden />;
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 13h4l2 3h6l2-3h4" strokeLinejoin="round" />
      <path d="M5 13 7 5h10l2 8v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5Z" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
