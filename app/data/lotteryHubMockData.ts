import type {
  LotteryFeaturedItem,
  LotteryGridItem,
  LotteryResultRow,
} from "@/app/types/lottery";

/** การ์ด feature — หวยไทย · ยี่กี 15 · ยี่กี 30 นาที */
export const LOTTERY_FEATURED_ITEMS: LotteryFeaturedItem[] = [
  {
    id: "lottery-feature-thai",
    title: "หวยรัฐบาลไทย",
    countdownLabel: "13 วัน",
    href: "/lottery/thai-government",
    visual: "thai-gov",
  },
  {
    id: "lottery-feature-yiki-15",
    title: "หวยยี่กี 15 นาที",
    countdownLabel: "03:29:01",
    href: "/lottery/yiki-15",
    visual: "yiki",
    yikiMinutes: 15,
  },
  {
    id: "lottery-feature-yiki-30",
    title: "หวยยี่กี 30 นาที",
    countdownLabel: "12:04:18",
    href: "/lottery/yiki-30",
    visual: "yiki",
    yikiMinutes: 30,
  },
];

/** กริดประเภทหวย — mock ตาม lobby หวย */
export const LOTTERY_GRID_ITEMS: LotteryGridItem[] = [
  { id: "lottery-baac", title: "หวย ธ.ก.ส.", status: "open", countdownLabel: "03:29:01", flagLabel: "TH", flagTone: "th", href: "/lottery/baac" },
  { id: "lottery-laos", title: "หวยลาว", status: "open", countdownLabel: "03:29:01", flagLabel: "LA", flagTone: "la", href: "/lottery/laos" },
  { id: "lottery-hanoi", title: "หวยฮานอย", status: "open", countdownLabel: "03:29:01", flagLabel: "VN", flagTone: "vn", href: "/lottery/hanoi" },
  { id: "lottery-malaysia", title: "หวยมาเลย์", status: "open", countdownLabel: "03:29:01", flagLabel: "MY", flagTone: "my", href: "/lottery/malaysia" },
  { id: "lottery-dow", title: "หวยดาวโจนส์", status: "open", countdownLabel: "03:29:01", flagLabel: "US", flagTone: "us", href: "/lottery/dow-jones" },
  { id: "lottery-china", title: "หวยจีน", status: "open", countdownLabel: "03:29:01", flagLabel: "CN", flagTone: "cn", href: "/lottery/china" },
  { id: "lottery-germany", title: "หวยเยอรมัน", status: "open", countdownLabel: "03:29:01", flagLabel: "DE", flagTone: "de", href: "/lottery/germany" },
  { id: "lottery-russia", title: "หวยรัสเซีย", status: "open", countdownLabel: "03:29:01", flagLabel: "RU", flagTone: "ru", href: "/lottery/russia" },
  { id: "lottery-korea", title: "หวยเกาหลี", status: "open", countdownLabel: "03:29:01", flagLabel: "KR", flagTone: "kr", href: "/lottery/korea" },
  { id: "lottery-nikkei", title: "หวยนิเคอิ", status: "open", countdownLabel: "03:29:01", flagLabel: "JP", flagTone: "jp", href: "/lottery/nikkei" },
  { id: "lottery-uk", title: "หวยอังกฤษ", status: "open", countdownLabel: "03:29:01", flagLabel: "GB", flagTone: "gb", href: "/lottery/uk" },
  { id: "lottery-hk", title: "หวยฮั่งเส็ง", status: "open", countdownLabel: "03:29:01", flagLabel: "HK", flagTone: "hk", href: "/lottery/hong-kong" },
  { id: "lottery-tw", title: "หวยไต้หวัน", status: "closed", flagLabel: "TW", flagTone: "tw", href: "/lottery/taiwan" },
  { id: "lottery-sg", title: "หวยสิงคโปร์", status: "open", countdownLabel: "03:29:01", flagLabel: "SG", flagTone: "sg", href: "/lottery/singapore" },
  { id: "lottery-india", title: "หวยอินเดีย", status: "open", countdownLabel: "03:29:01", flagLabel: "IN", flagTone: "in", href: "/lottery/india" },
  { id: "lottery-egypt", title: "หวยอียิปต์", status: "open", countdownLabel: "03:29:01", flagLabel: "EG", flagTone: "eg", href: "/lottery/egypt" },
];

/** ผลหวยล่าสุด — mock */
export const LOTTERY_LATEST_RESULTS: LotteryResultRow[] = [
  { id: "res-my", title: "หวยมาเลย์", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "MY", flagTone: "my" },
  { id: "res-cn", title: "หวยจีน", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "CN", flagTone: "cn" },
  { id: "res-hn", title: "หวยฮานอย", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "VN", flagTone: "vn" },
  { id: "res-th", title: "หวยรัฐบาลไทย", top3: "842", bottom2: "56", dateLabel: "1 ส.ค. 2026", flagLabel: "TH", flagTone: "th" },
  { id: "res-la", title: "หวยลาว", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "LA", flagTone: "la" },
  { id: "res-yk15", title: "หวยยี่กี 15 นาที", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "YK", flagTone: "gold" },
  { id: "res-yk30", title: "หวยยี่กี 30 นาที", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "YK", flagTone: "gold" },
  { id: "res-stock", title: "หวยหุ้นไทย", top3: "842", bottom2: "56", dateLabel: "วันนี้", flagLabel: "TH", flagTone: "th" },
];
