"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * เส้นทางเดิม /loss-rebate — ไปหน้าคืนยอดแท็บเสีย
 */
export default function LossRebateRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cashback?tab=loss");
  }, [router]);

  return null;
}
