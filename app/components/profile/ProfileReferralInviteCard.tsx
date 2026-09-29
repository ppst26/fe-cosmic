"use client";

import React, { useState } from "react";
import {
  REFERRAL_MOCK_REF_CODE,
  buildReferralLink,
} from "@/app/data/referralMockData";
import { ProfileAccountFieldRow } from "./ProfileAccountFieldRow";
import { COSMIC_BTN_PRIMARY, COSMIC_PANEL_GLASS } from "../ui/cosmicButtonClasses";

/**
 * บล็อกชวนเพื่อน — รหัส/ลิงก์ + ปุ่มแชร์ (ProfileAccountTabs)
 */
export function ProfileReferralInviteCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const referralCode = REFERRAL_MOCK_REF_CODE;
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
    <section className={`${COSMIC_PANEL_GLASS} flex flex-col gap-3 px-3.5 py-4 sm:px-4`}>
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

      <button
        type="button"
        onClick={() => void handleShare()}
        className={`${COSMIC_BTN_PRIMARY} cosmic-cta-primary--sm flex h-11 w-full items-center justify-center gap-1.5 text-sm font-medium sm:h-12 sm:text-base`}
      >
        แชร์รับรายได้
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  );
}
