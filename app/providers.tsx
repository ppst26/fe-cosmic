"use client";

import React from "react";
import { UrlSearchParamsProvider } from "@/app/hooks/useUrlSearchParams";
import { AuthProvider } from "@/app/components/auth/AuthProvider";
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

/**
 * ครอบ client providers — query string (ไม่ bailout SSR) + Auth + แลกคูปอง + pending tx + ฝาก/ถอน + VIP + ธุรกรรม
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UrlSearchParamsProvider>
      <ToastProvider>
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
      </ToastProvider>
    </UrlSearchParamsProvider>
  );
}
