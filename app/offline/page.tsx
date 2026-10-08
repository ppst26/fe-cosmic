/**
 * หน้าสำรองเมื่อเปิดแอปที่ติดตั้งแล้วแต่ไม่มีเน็ต
 * ถูกอ้างจาก fallback ของ service worker ใน app/sw.ts
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-medium text-[var(--text-primary)]">เชื่อมต่ออินเทอร์เน็ตไม่ได้</h1>
      <p className="max-w-xs text-sm text-[var(--text-secondary)]">
        เปิดเน็ตแล้วกลับเข้า Cosmicbet อีกครั้ง
      </p>
      <a
        href="/"
        className="mt-2 inline-flex min-h-11 items-center rounded-full bg-[var(--action-solid)] px-5 text-sm font-medium text-white"
      >
        กลับหน้าแรก
      </a>
    </main>
  );
}
