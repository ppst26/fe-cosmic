import React from "react";
import Link from "next/link";
import { CosmicbetLogo } from "./Icons";

/**
 * โครงหน้าสถานะเต็มจอ (404 / error ระดับ route) — โลโก้กลับหน้าแรก + เนื้อหากลางจอ
 * ใช้ใน app/not-found.tsx · app/error.tsx
 */
export function StatusPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[70dvh] w-full flex-col items-center justify-center gap-6 px-(--page-gutter) py-12">
      <Link href="/" aria-label="cosmicbet หน้าหลัก" className="inline-flex">
        <CosmicbetLogo className="h-6 w-auto" />
      </Link>
      {children}
    </main>
  );
}
