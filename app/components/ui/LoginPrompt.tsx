"use client";

import React from "react";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { StatusState } from "./StatusState";

/**
 * การ์ดชวนเข้าสู่ระบบ — แสดงแทนข้อมูลที่ต้อง login (ResourceGate ตอน status = idle)
 */
export function LoginPrompt({
  title = "เข้าสู่ระบบเพื่อดูข้อมูลนี้",
  description = "ข้อมูลส่วนนี้แสดงเฉพาะสมาชิก",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const { open: openLogin } = useOverlayLayer("login");
  const { open: openSignUp } = useOverlayLayer("signup");
  return (
    <StatusState
      variant="card"
      className={className}
      icon={<LockIcon />}
      title={title}
      description={description}
      primaryAction={{ label: "เข้าสู่ระบบ", onClick: () => openLogin() }}
      secondaryAction={{ label: "สมัครสมาชิก", onClick: () => openSignUp() }}
    />
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
