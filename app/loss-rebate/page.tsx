import { permanentRedirect } from "next/navigation";

/**
 * path เก่า — รวมเนื้อหาไว้ที่ /cashback แท็บคืนยอดเสีย
 */
export default function LossRebateLegacyRedirect() {
  permanentRedirect("/cashback?tab=loss");
}
