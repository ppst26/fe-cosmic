"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "../auth/AuthProvider";
import { ProfilePageHeader } from "./ProfilePageHeader";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ProfileMenuCard, ProfileMenuRow } from "./ProfileMenuCard";
import {
  BankBuildingIcon,
  LockIcon,
  LogOutIcon,
  SupportHeadsetIcon,
} from "../ui/Icons";

/**
 * เนื้อหาหน้าโปรไฟล์ — โหลดจาก /api/auth/profile
 * ถูกเรียกใช้ใน app/profile/page.tsx
 */
export function ProfilePageContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    let active = true;
    (async () => {
      const data = await fetchProfile();
      if (active) {
        setProfile(data);
        setLoadingProfile(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isLoading || loadingProfile) {
    return (
      <main className="page-shell mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] pb-10">
        <ProfilePageHeader title="โปรไฟล์" />
        <p className="py-12 text-center text-sm text-[var(--text-muted)]">กำลังโหลด...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page-shell mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] pb-10">
        <ProfilePageHeader title="โปรไฟล์" />
        <p className="py-12 text-center text-sm text-[var(--text-muted)]">
          ไม่พบข้อมูลโปรไฟล์
        </p>
      </main>
    );
  }

  return (
    <main className="page-shell mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] pb-10">
      <ProfilePageHeader title="โปรไฟล์" />

      <div className="mt-2 flex flex-col gap-5">
        <ProfileSummaryCard profile={profile} />

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
              /* TODO: หน้าจัดการบัญชีธนาคาร */
            }}
          />
          <ProfileMenuRow
            icon={<LockIcon className="h-5 w-5" />}
            title="เปลี่ยนรหัสผ่าน"
            description="อัปเดตรหัสผ่านเพื่อความปลอดภัย"
            onClick={() => {
              /* TODO: flow เปลี่ยนรหัสผ่าน */
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
          onClick={() => void handleLogout()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--destructive)]/70 bg-transparent text-sm font-medium text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <LogOutIcon className="h-5 w-5" />
          ออกจากระบบ
        </button>
      </div>
    </main>
  );
}
