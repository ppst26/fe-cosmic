import type { HallOfFameRow, HallOfFameTabId } from "../types/lobby";
import { formatWonAt } from "@/lib/format";

const thumb = (file: string) => `/slots/${encodeURIComponent(file)}`;

type GamePoolItem = Pick<HallOfFameRow, "gameName" | "coverSrc" | "coverTone" | "gameIcon">;

/** เกม + ค่ายจำลอง — หมุนเวียนสุ่มเป็นแถวใหม่ */
const GAME_POOL: GamePoolItem[] = [
  { gameName: "Wild Spirit", coverSrc: thumb("cq9.webp"), gameIcon: "flame" },
  { gameName: "Viking Forge", coverSrc: thumb("Booongo.webp"), gameIcon: "flame" },
  { gameName: "Mahjong King", coverSrc: thumb("Creative Gaming.webp"), coverTone: "emerald", gameIcon: "cherries" },
  { gameName: "Sweet Bonanza", coverSrc: thumb("pragmaticplay.webp"), gameIcon: "cherries" },
  { gameName: "Gates of Olympus", coverSrc: thumb("spadegaming.webp"), coverTone: "violet", gameIcon: "sparkle" },
  { gameName: "Starlight Princess", coverSrc: thumb("pg.webp"), gameIcon: "sparkle" },
  { gameName: "Big Bass Bonanza", coverSrc: thumb("Funta.webp"), gameIcon: "fish" },
  { gameName: "Lucky Neko", coverSrc: thumb("JILI.webp"), gameIcon: "cherries" },
  { gameName: "Fortune Tiger", coverSrc: thumb("Habanero.webp"), gameIcon: "flame" },
  { gameName: "Dragon Hatch", coverSrc: thumb("Hacksaw.webp"), gameIcon: "flame" },
  { gameName: "Golden Joker", coverSrc: thumb("joker.webp"), gameIcon: "cherries" },
  { gameName: "Sugar Rush", coverSrc: thumb("Goldy.webp"), gameIcon: "cherries" },
];

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const ALNUM = "abcdefghijklmnopqrstuvwxyz0123456789";

function pick<T>(items: readonly T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)] as T;
}

function randomChars(source: string, length: number, rand: () => number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) out += source.charAt(Math.floor(rand() * source.length));
  return out;
}

/** ชื่อผู้เล่นปิดบัง เช่น mfx***832 */
function randomPlayerMasked(rand: () => number): string {
  return `${randomChars(LETTERS, 3, rand)}***${randomChars(ALNUM, 3, rand)}`;
}

/** ยอดชนะ — log-uniform 1,000–90,000 ปัดทีละ 0.05 (ยอดต่ำพบบ่อยกว่ายอดสูง) */
function randomPayout(rand: () => number): number {
  const min = 1000;
  const max = 90000;
  const value = min * Math.pow(max / min, rand());
  return Math.round(value * 20) / 20;
}

/** ตัวคูณ — log-uniform 20–1000 */
function randomMultiple(rand: () => number): number {
  return Math.round(20 * Math.pow(50, rand()));
}

let liveCounter = 0;

/**
 * สร้างแถวใหม่สำหรับแท็บที่ระบุ — ไม่ซ้ำเกมกับแถวบนสุดปัจจุบัน
 * rand/now ฉีดได้เพื่อทดสอบ
 */
export function createHallOfFameRow(
  tab: HallOfFameTabId,
  currentTop?: HallOfFameRow,
  now: Date = new Date(),
  rand: () => number = Math.random,
): HallOfFameRow {
  const candidates = GAME_POOL.filter((g) => g.gameName !== currentTop?.gameName);
  const game = pick(candidates, rand);
  liveCounter += 1;
  return {
    id: `hof-live-${tab}-${now.getTime()}-${liveCounter}`,
    ...game,
    playerMasked: randomPlayerMasked(rand),
    wonAtLabel: formatWonAt(now),
    ...(tab === "latest-winner"
      ? { payout: randomPayout(rand) }
      : { winMultiple: randomMultiple(rand) }),
  };
}
