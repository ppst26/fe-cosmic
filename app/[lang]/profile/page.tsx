import { localizedRedirect } from "@/lib/i18n/server";

/**
 * โปรไฟล์ hub อยู่ใน popover — หน้า /profile ยัง redirect lobby
 */
export default async function ProfilePage() {
  await localizedRedirect("/");
}
