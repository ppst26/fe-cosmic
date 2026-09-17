import { redirect } from "next/navigation";

/**
 * โปรไฟล์ hub อยู่ใน popover — หน้า /profile ยัง redirect lobby
 */
export default function ProfilePage() {
  redirect("/");
}
