import { StatusState } from "@/app/components/ui/StatusState";
import { StatusPageShell } from "@/app/components/ui/StatusPageShell";
import { getT } from "@/lib/i18n/server";

/**
 * 404 — URL ไม่ตรง route ใด ๆ หรือหน้าเรียก notFound()
 * <title> แปลตามภาษา — React 19 ยกขึ้น <head> ให้ (แทน export metadata แบบค่าคงที่)
 */
export default async function NotFound() {
  const t = await getT("errors");
  return (
    <StatusPageShell>
      <title>{t("notFound.metaTitle")}</title>
      <StatusState
        variant="card"
        icon={<span className="text-lg font-medium tabular-nums">404</span>}
        title={t("notFound.title")}
        description={t("notFound.description")}
        primaryAction={{ label: t("backHome"), href: "/" }}
        secondaryAction={{ label: t("notFound.viewPromotions"), href: "/promotions" }}
      />
    </StatusPageShell>
  );
}
