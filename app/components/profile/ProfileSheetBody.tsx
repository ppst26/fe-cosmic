"use client";

import React from "react";
import type { ProfileUser } from "@/app/types/auth";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfileMenuCard, ProfileMenuRow } from "./ProfileMenuCard";
import {
  BankBuildingIcon,
  LockIcon,
  LogOutIcon,
  SupportHeadsetIcon,
} from "../ui/Icons";

interface ProfileSheetBodyProps {
  profile: ProfileUser;
  onLogout: () => void;
  /** ใช้ใน popover โปรไฟล์ — ย่อ spacing */
  compact?: boolean;
}

/**
 * เนื้อหาหน้าข้อมูลบัญชี (/profile/account)
 */
export function ProfileSheetBody({ profile, onLogout, compact = false }: ProfileSheetBodyProps) {
  return (
    <div className={`flex flex-col pb-1 ${compact ? "gap-3" : "gap-5 pb-2"}`}>
      <ProfileInfoCard
        title="ข้อมูลส่วนตัว"
        rows={[
          { label: "ชื่อผู้ใช้งาน", value: profile.displayName },
          { label: "เบอร์โทรศัพท์", value: profile.phoneMasked },
          { label: "วันที่สมัคร", value: profile.joinedLabel },
        ]}
      />

      <ProfileMenuCard title="บัญชีและความปลอดภัย">
        <ProfileMenuRow
          icon={<BankBuildingIcon className="h-5 w-5" />}
          title="บัญชีธนาคาร"
          description={`${profile.bankLabel} · ${profile.bankAccountMasked}`}
          onClick={() => {
            /* TODO: จัดการบัญชีธนาคาร */
          }}
        />
        <ProfileMenuRow
          icon={<LockIcon className="h-5 w-5" />}
          title="เปลี่ยนรหัสผ่าน"
          description="อัปเดตรหัสผ่านเพื่อความปลอดภัย"
          onClick={() => {
            /* TODO: เปลี่ยนรหัสผ่าน */
          }}
        />
      </ProfileMenuCard>

      <section className="rounded-[var(--radius-panel)] bg-[var(--surface-hover)] px-4 py-1">
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
            ? "flex w-fit items-center gap-1.5 py-1 text-xs font-semibold text-[#e8c547] hover:opacity-85"
            : "flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--destructive)]/70 bg-transparent text-sm font-bold text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        }
      >
        <LogOutIcon className={compact ? "h-3.5 w-3.5" : "h-5 w-5"} />
        ออกจากระบบ
      </button>
    </div>
  );
}
