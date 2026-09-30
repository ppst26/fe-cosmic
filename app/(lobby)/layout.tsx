import type { ReactNode } from "react";
import { HomeLobbyPage } from "@/app/components/home/HomeLobbyPage";

/**
 * Layout ร่วมของหน้า lobby (/ · /casino · /slots · /fishing · /sport · /cards · /lottery)
 * คงอินสแตนซ์ HomeLobbyPage ไว้ข้ามการสลับหมวด — CategoryNav ไม่ remount จึงไม่กระพริบตอนกด
 * ใช้ร่วมกับ HomeLobbyPage.tsx ที่อ่านหมวด active จาก pathname
 */
export default function LobbyGroupLayout({ children }: { children: ReactNode }) {
  void children;
  return <HomeLobbyPage />;
}
