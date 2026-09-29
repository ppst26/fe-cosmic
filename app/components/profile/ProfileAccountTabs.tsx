"use client";

import React, { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { ProfileAccountFieldRow } from "./ProfileAccountFieldRow";
import { ProfileBankAccountCard } from "./ProfileBankAccountCard";
import { ProfileMenuRow } from "./ProfileMenuCard";
import { LogOutIcon, SupportHeadsetIcon } from "../ui/Icons";
import {
  COSMIC_BTN_LOGOUT,
  COSMIC_PANEL_GLASS,
  COSMIC_SEGMENT_GLASS_WHITE,
} from "../ui/cosmicButtonClasses";
import { cn } from "@/lib/utils";

type ProfileAccountTab = "personal" | "bank";

interface ProfileAccountTabsProps {
  profile: ProfileUser;
  onLogout: () => void;
  compact?: boolean;
}

/**
 * หน้าข้อมูลบัญชี — แท็บข้อมูลส่วนตัว / บัญชีธนาคาร (ProfileSheetBody)
 */
export function ProfileAccountTabs({ profile, onLogout, compact = false }: ProfileAccountTabsProps) {
  const [activeTab, setActiveTab] = useState<ProfileAccountTab>("personal");
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-5 pb-2")}>
      <div
        role="tablist"
        aria-label="ข้อมูลบัญชี"
        className={`${COSMIC_SEGMENT_GLASS_WHITE} grid grid-cols-2 gap-2`}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "personal"}
          onClick={() => setActiveTab("personal")}
          className={`cosmic-segment-btn py-2.5 text-sm ${activeTab === "personal" ? "is-active" : ""}`}
        >
          ข้อมูลส่วนตัว
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "bank"}
          onClick={() => setActiveTab("bank")}
          className={`cosmic-segment-btn py-2.5 text-sm ${activeTab === "bank" ? "is-active" : ""}`}
        >
          บัญชีธนาคาร
        </button>
      </div>

      {copiedField ? (
        <p className="text-center text-xs text-[var(--success)]" role="status">คัดลอกแล้ว</p>
      ) : null}

      {activeTab === "personal" ? (
        <div role="tabpanel" className="flex flex-col gap-2">
          <ProfileAccountFieldRow
            label="ชื่อผู้ใช้"
            value={profile.displayName}
            onCopy={() => void copyText("displayName", profile.displayName)}
            copyLabel="คัดลอกชื่อผู้ใช้"
          />
          <ProfileAccountFieldRow label="เบอร์โทร" value={profile.phoneMasked} />
          <ProfileAccountFieldRow label="วันที่สมัคร" value={profile.joinedLabel} />
          <ProfileAccountFieldRow
            label="รหัสผ่าน"
            value="••••••"
            onEdit={() => {
              /* TODO: เปลี่ยนรหัสผ่าน */
            }}
            editLabel="เปลี่ยนรหัสผ่าน"
          />
        </div>
      ) : (
        <div role="tabpanel" className="flex flex-col gap-2">
          <ProfileBankAccountCard profile={profile} />
        </div>
      )}

      <section className={`${COSMIC_PANEL_GLASS} px-4 py-1`}>
        <ProfileMenuRow
          icon={<SupportHeadsetIcon className="h-5 w-5" />}
          title="ติดต่อฝ่ายบริการ"
          href="mailto:support@cosmicbet.example"
        />
      </section>

      <button
        type="button"
        onClick={onLogout}
        className={
          compact
            ? "flex w-fit items-center gap-1.5 py-1 text-xs font-medium text-[var(--destructive)] hover:opacity-85"
            : COSMIC_BTN_LOGOUT
        }
      >
        <LogOutIcon className={compact ? "h-3.5 w-3.5" : "h-5 w-5"} />
        ออกจากระบบ
      </button>
    </div>
  );
}
