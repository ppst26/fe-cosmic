"use client";

import React from "react";
import { useReferralOverview } from "@/app/hooks/api/member";
import { useToast } from "@/context/ToastContext";
import { ProfileAccountFieldRow } from "./ProfileAccountFieldRow";
import { cn } from "@/lib/utils";
import { buildReferralLink } from "@/lib/domain/referral";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * บล็อกชวนเพื่อน — ลิงก์คัดลอก (ProfileAccountTabs)
 */
export function ProfileReferralInviteCard({ flat = false }: { flat?: boolean }) {
  const { showToast } = useToast();
  const t = useT("profile");
  const overview = useReferralOverview();
  /** ลิงก์พร้อมเมื่อโหลดรหัสแนะนำแล้ว · ระหว่างโหลดแสดง "—" */
  const referralLink = overview.data ? buildReferralLink(overview.data.refCode) : null;

  const handleCopyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t("referralInvite.linkCopied"), "success", 2500);
    } catch {
      showToast(t("referralInvite.copyLinkFailed"), "error");
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
          {t("referralInvite.title")}
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
          {t("referralInvite.description")}
        </p>
      </div>

      <ProfileAccountFieldRow
        label={t("referralInvite.linkLabel")}
        value={referralLink ?? "—"}
        onCopy={referralLink ? () => void handleCopyLink(referralLink) : undefined}
        copyLabel={t("referralInvite.copyLink")}
      />
    </section>
  );
}
