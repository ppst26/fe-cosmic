import { localizedPermanentRedirect } from "@/lib/i18n/server";

/**
 * path เก่า — ย้ายไป /event
 */
export default async function ActivitiesLegacyRedirect() {
  await localizedPermanentRedirect("/event");
}
