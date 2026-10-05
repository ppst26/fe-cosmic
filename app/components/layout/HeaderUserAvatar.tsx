"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { useAuth } from "../auth/AuthProvider";
import { UserAvatar, UserAvatarPlaceholder } from "../profile/UserAvatar";
import { cn } from "@/lib/utils";

interface HeaderUserAvatarProps {
  /** รีเฟรชรูปเมื่อปิด sheet โปรไฟล์ (Header) */
  refreshWhenProfileCloses?: boolean;
  isProfileOpen?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md";
}

/**
 * รูปโปรไฟล์ใน header desktop — จาก preset ที่ user เลือก (Header · LobbyDesktopTopBar)
 */
export function HeaderUserAvatar({
  refreshWhenProfileCloses = false,
  isProfileOpen = false,
  className,
  size = "sm",
}: HeaderUserAvatarProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const wasProfileOpen = useRef(isProfileOpen);

  const loadProfile = () => {
    void fetchProfile().then((data) => {
      setProfile(data);
    });
  };

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      setProfile(null);
      return;
    }
    let active = true;
    void fetchProfile().then((data) => {
      if (active) setProfile(data);
    });
    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (
      refreshWhenProfileCloses &&
      wasProfileOpen.current &&
      !isProfileOpen &&
      isAuthenticated
    ) {
      loadProfile();
    }
    wasProfileOpen.current = isProfileOpen;
  }, [isProfileOpen, isAuthenticated, refreshWhenProfileCloses]);

  if (!isAuthenticated || !profile) {
    return <UserAvatarPlaceholder size={size} className={className} />;
  }

  return (
    <UserAvatar
      profile={profile}
      size={size}
      className={cn("ring-1 ring-[var(--border-subtle)]", className)}
    />
  );
}
