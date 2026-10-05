import { redirect } from "next/navigation";

/** ปิดแลกพอยท์เป็นเงิน — ส่งกลับศูนย์รางวัล */
export default function ExchangeMoneyPage() {
  redirect("/reward");
}
