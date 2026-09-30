"use client";

import React, { Suspense } from "react";
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

/**
 * ครอบ client providers — Auth + แลกคูปอง + pending tx + ฝาก/ถอน + VIP + ธุรกรรม
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <CouponRedeemProvider>
          <PendingTransactionProvider>
            <DepositProvider>
              <WithdrawProvider>
                <DesktopHubModalProvider>
                  <VipModalProvider>
                    <TransactionsProvider>
                      <LobbyShellSidebarProvider>
                        {children}
                        <GlobalAuthOverlays />
                      </LobbyShellSidebarProvider>
                    </TransactionsProvider>
                  </VipModalProvider>
                </DesktopHubModalProvider>
              </WithdrawProvider>
            </DepositProvider>
          </PendingTransactionProvider>
        </CouponRedeemProvider>
      </AuthProvider>
    </Suspense>
  );
}
