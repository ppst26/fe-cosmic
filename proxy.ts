import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, parseSessionToken } from "@/lib/auth/session";

/**
 * กันหน้าที่ต้อง login ตั้งแต่ฝั่ง server (Next 16 proxy · Node.js runtime)
 * ไม่มี session ที่ถูกต้อง → กลับหน้าแรกพร้อมเปิด login (?layer=login)
 * เป็นด่านแรกเท่านั้น — route handler / backend ต้องตรวจสิทธิ์เองทุกครั้ง
 */
export function proxy(request: NextRequest) {
  const userId = parseSessionToken(request.cookies.get(COOKIE_NAME)?.value);
  if (userId) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("layer", "login");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/transactions/:path*",
    "/cashback/:path*",
    "/profile/account/:path*",
    "/vip/:path*",
    "/lottery/slips/:path*",
  ],
};
