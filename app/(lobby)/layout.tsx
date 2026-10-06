import type { ReactNode } from "react";
import { HomeLobbyPage } from "@/app/components/home/HomeLobbyPage";
import { loadLobbyContent } from "@/lib/api/lobby";

/**
 * Layout ร่วมของหน้า lobby (/ · /casino · /slots · /fishing · /sport · /cards · /lottery)
 * คงอินสแตนซ์ HomeLobbyPage ไว้ข้ามการสลับหมวด — CategoryNav ไม่ remount จึงไม่กระพริบตอนกด
 * ใช้ร่วมกับ HomeLobbyPage.tsx ที่อ่านหมวด active จาก pathname
 * โหลดเนื้อหา lobby ฝั่ง server — HTML แรกมีแบนเนอร์/เกมครบ ไม่กระพริบ
 */
export default async function LobbyGroupLayout({ children }: { children: ReactNode }) {
  void children;
  const content = await loadLobbyContent();
  return <HomeLobbyPage content={content} />;
}
