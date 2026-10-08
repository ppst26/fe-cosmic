"use client";

import React from "react";
import { UrlSearchParamsProvider } from "@/app/hooks/useUrlSearchParams";
import { AuthProvider } from "@/app/components/auth/AuthProvider";
import { SWRConfig } from "swr";
import { ProfileAvatarPrefetch } from "@/app/components/auth/ProfileAvatarPrefetch";
import type { ApiError } from "@/lib/api/http";
import { TransactionsProvider } from "@/app/components/transactions/TransactionsProvider";
import { VipModalProvider } from "@/app/components/vip/VipModalProvider";
import { DesktopHubModalProvider } from "@/app/components/hub/DesktopHubModalProvider";
import { CouponRedeemProvider } from "@/app/components/coupon/CouponRedeemProvider";
import { DepositProvider } from "@/app/components/deposit/DepositProvider";
import { WithdrawProvider } from "@/app/components/withdraw/WithdrawProvider";
import { PendingTransactionProvider } from "@/app/components/transactions/PendingTransactionProvider";
import { LobbyShellSidebarProvider } from "@/app/components/layout/LobbyShellSidebarContext";
import { GlobalAuthOverlays } from "@/app/components/auth/GlobalAuthOverlays";
import { NotificationProvider } from "@/app/components/notifications/NotificationProvider";
import { ToastProvider } from "@/context/ToastContext";
import { PwaInstallProvider } from "@/app/components/pwa/PwaInstallProvider";

/**
 * ค่าเริ่มต้น SWR ทั้งแอป — ไม่ดึงใหม่ทุกครั้งที่สลับแท็บ · 401 / 4xx ไม่ retry (retry เฉพาะ network / 5xx สูงสุด 3 ครั้ง)
 */
const SWR_DEFAULTS = {
  revalidateOnFocus: false,
  onErrorRetry: (
    error: ApiError,
    _key: string,
    _config: unknown,
    revalidate: (opts: { retryCount: number }) => void,
    { retryCount }: { retryCount: number },
  ) => {
    if (error.code === "UNAUTHORIZED" || (error.status >= 400 && error.status < 500)) return;
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), 2000 * (retryCount + 1));
  },
};

/**
 * ครอบ client providers — query string (ไม่ bailout SSR) + Auth + SWR + PWA มือถือ + แลกคูปอง + pending tx + ฝาก/ถอน + VIP + ธุรกรรม
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UrlSearchParamsProvider>
    <SWRConfig value={SWR_DEFAULTS}>
      <ToastProvider>
      <PwaInstallProvider>
      <AuthProvider>
        <CouponRedeemProvider>
          <PendingTransactionProvider>
            <DepositProvider>
              <WithdrawProvider>
                <DesktopHubModalProvider>
                  <VipModalProvider>
                    <NotificationProvider>
                      <TransactionsProvider>
                        <LobbyShellSidebarProvider>
                          {children}
                          <GlobalAuthOverlays />
                          <ProfileAvatarPrefetch />
                        </LobbyShellSidebarProvider>
                      </TransactionsProvider>
                    </NotificationProvider>
                  </VipModalProvider>
                </DesktopHubModalProvider>
              </WithdrawProvider>
            </DepositProvider>
          </PendingTransactionProvider>
        </CouponRedeemProvider>
      </AuthProvider>
      </PwaInstallProvider>
      </ToastProvider>
    </SWRConfig>
    </UrlSearchParamsProvider>
  );
}
