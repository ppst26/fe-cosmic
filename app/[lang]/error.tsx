"use client";

import { useEffect } from "react";
import { ErrorState } from "@/app/components/ui/StatusState";
import { StatusPageShell } from "@/app/components/ui/StatusPageShell";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * Error boundary ระดับ route — หน้าใดก็ตามที่ render พัง (ไม่รวม root layout → ดู global-error.tsx)
 * retry() = ดึงข้อมูลใหม่แล้ว render ส่วนนั้นซ้ำ (Next 16)
 */
export default function RouteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT("errors");
  const tCommon = useT("common");

  useEffect(() => {
    // TODO(monitoring): ส่งไป error reporting service เมื่อเลือกเครื่องมือแล้ว
    console.error(error);
  }, [error]);

  return (
    <StatusPageShell>
      <ErrorState
        variant="card"
        title={t("route.title")}
        description={t("route.description")}
        primaryAction={{ label: tCommon("retry"), onClick: retry }}
        secondaryAction={{ label: t("backHome"), href: "/" }}
        code={error.digest}
        codeLabel={error.digest ? tCommon("refCode", { code: error.digest }) : undefined}
      />
    </StatusPageShell>
  );
}
