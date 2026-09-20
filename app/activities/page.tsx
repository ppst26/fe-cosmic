import { permanentRedirect } from "next/navigation";

/**
 * path เก่า — ย้ายไป /event
 */
export default function ActivitiesLegacyRedirect() {
  permanentRedirect("/event");
}
