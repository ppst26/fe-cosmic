"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { CosmicConfirmDialog } from "@/app/components/ui/CosmicConfirmDialog";
import { LogOutIcon } from "@/app/components/ui/Icons";

/**
 * เปิด confirm ก่อน logout — ใช้ในโปรไฟล์ / hub บัญชี
 */
export function useLogoutConfirm(onSuccess?: () => void) {
  const { logout } = useAuth();
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
        title="ออกจากระบบ?"
        description="คุณจะต้องเข้าสู่ระบบใหม่เพื่อฝาก ถอน หรือเล่นเกมด้วยบัญชีนี้"
        intentIcon={<LogOutIcon className="h-6 w-6" />}
        confirmLabel="ออกจากระบบ"
        cancelLabel="อยู่ต่อ"
        loading={loading}
        dismissible={!loading}
        onConfirm={handleConfirm}
      />
    ),
    [open, loading, handleConfirm],
  );

  return { openLogoutConfirm, LogoutConfirmDialog };
}
