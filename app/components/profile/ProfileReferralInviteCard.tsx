"use client";

import React, { useState } from "react";
import {
  buildReferralLink,
} from "@/app/data/referralMockData";
import { fetchReferralOverview } from "@/lib/api/referral";
import { ProfileAccountFieldRow } from "./ProfileAccountFieldRow";
import {
  COSMIC_BTN_CONFIRM_TEXT,
  COSMIC_SHEET_SUBMIT,
} from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

/**
 * บล็อกชวนเพื่อน — รหัส/ลิงก์ + ปุ่มแชร์ (ProfileAccountTabs)
 */
export function ProfileReferralInviteCard({ flat = false }: { flat?: boolean }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const referralCode = fetchReferralOverview().refCode;
  const referralLink = buildReferralLink(referralCode);

  const copyText = async (field: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "ชวนเพื่อน Cosmicbet",
          text: "สมัครผ่านลิงก์ของฉัน",
          url: referralLink,
        });
        return;
      }
    } catch {
      /* ผู้ใช้ยกเลิก share */
    }
    await copyText("share", referralLink);
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

      <div className="flex flex-col gap-2">
        <ProfileAccountFieldRow
          label="รหัสชวนเพื่อน"
          value={referralCode}
          onCopy={() => void copyText("code", referralCode)}
          copyLabel="คัดลอกรหัสชวนเพื่อน"
        />
        <ProfileAccountFieldRow
          label="ลิงก์ชวนเพื่อน"
          value={referralLink}
          onCopy={() => void copyText("link", referralLink)}
          copyLabel="คัดลอกลิงก์ชวนเพื่อน"
        />
      </div>

      <button type="button" onClick={() => void handleShare()} className={COSMIC_SHEET_SUBMIT}>
        <span className={COSMIC_BTN_CONFIRM_TEXT}>แชร์รับรายได้</span>
      </button>
    </section>
  );
}
