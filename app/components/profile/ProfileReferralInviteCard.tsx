"use client";

import React, { useState } from "react";
import { useReferralOverview } from "@/app/hooks/api/member";
import { ProfileAccountFieldRow } from "./ProfileAccountFieldRow";
import { cn } from "@/lib/utils";
import { buildReferralLink } from "@/lib/domain/referral";

/**
 * บล็อกชวนเพื่อน — ลิงก์คัดลอก (ProfileAccountTabs)
 */
export function ProfileReferralInviteCard({ flat = false }: { flat?: boolean }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const overview = useReferralOverview();
  /** ลิงก์พร้อมเมื่อโหลดรหัสแนะนำแล้ว · ระหว่างโหลดแสดง "—" */
  const referralLink = overview.data ? buildReferralLink(overview.data.refCode) : null;

  const copyText = async (field: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  return (
    <section
      className={cn(
        "flex flex-col gap-3",
        flat && "border-t border-[var(--border-subtle)]/45 pt-4",
      )}
    >
      <div className="text-center">
        <h2 className="text-sm font-medium text-[var(--text-primary)] sm:text-base">
          ชวนเพื่อนรับโบนัส
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
          แชร์ลิงก์ให้เพื่อนสมัคร รับส่วนแบ่งรายได้จากยอดเล่น
        </p>
      </div>

      {copiedField ? (
        <p className="text-center text-xs text-[var(--success)]" role="status">คัดลอกแล้ว</p>
      ) : null}

      <ProfileAccountFieldRow
        label="ลิงก์ชวนเพื่อน"
        value={referralLink ?? "—"}
        onCopy={referralLink ? () => void copyText("link", referralLink) : undefined}
        copyLabel="คัดลอกลิงก์ชวนเพื่อน"
      />
    </section>
  );
}
