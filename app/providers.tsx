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
                <VipModalProvider>
                  <DesktopHubModalProvider>
                    <TransactionsProvider>{children}</TransactionsProvider>
                  </DesktopHubModalProvider>
                </VipModalProvider>
              </WithdrawProvider>
            </DepositProvider>
          </PendingTransactionProvider>
        </CouponRedeemProvider>
      </AuthProvider>
    </Suspense>
  );
}
