import { redirect } from "next/navigation";
import { CASINO_ITEMS } from "@/app/data/casinoProvidersData";
import { buildCasinoProviderPlayHref } from "@/lib/gamePlayPaths";

/**
 * คาสิโนไม่มีหน้ารายการเกม — redirect ไป mock /play (ลิงก์เก่า /casino/[slug])
 */
export default async function CasinoProviderLegacyRedirect({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const fromCatalog = CASINO_ITEMS.find((item) =>
    item.href.includes(`/play/casino-${slug}-live`),
  );

  if (fromCatalog) {
    redirect(fromCatalog.href);
  }

  const title = slug.replace(/-/g, " ");
  redirect(
    buildCasinoProviderPlayHref({
      slug,
      title,
      provider: title,
    }),
  );
}
