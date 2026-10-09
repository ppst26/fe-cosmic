"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { CosmicConfirmDialog } from "@/app/components/ui/CosmicConfirmDialog";
import { LogOutIcon } from "@/app/components/ui/Icons";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * เปิด confirm ก่อน logout — ใช้ในโปรไฟล์ / hub บัญชี
 */
export function useLogoutConfirm(onSuccess?: () => void) {
  const { logout } = useAuth();
  const t = useT("auth");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openLogoutConfirm = useCallback(() => setOpen(true), []);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      onSuccess?.();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [logout, onSuccess]);

  const LogoutConfirmDialog = useCallback(
    () => (
      <CosmicConfirmDialog
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title={t("logoutConfirm.title")}
        description={t("logoutConfirm.description")}
        intentIcon={<LogOutIcon className="h-6 w-6" />}
        confirmLabel={t("logout")}
        cancelLabel={t("logoutConfirm.stay")}
        loading={loading}
        dismissible={!loading}
        onConfirm={handleConfirm}
      />
    ),
    [open, loading, handleConfirm, t],
  );

  return { openLogoutConfirm, LogoutConfirmDialog };
}
