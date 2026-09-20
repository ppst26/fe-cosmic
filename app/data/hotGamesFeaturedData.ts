import type { GameItem } from "../types/lobby";

/** รูปปกเกมยอดฮิต — public/hitz game */
const hitzCover = (file: string) => `/hitz game/${encodeURIComponent(file)}`;

/**
 * เกมยอดฮิตหน้าแรก — ใช้รูปจาก public/hitz game
 * ถูกเรียกใช้โดย GAME_SECTIONS_DATA (section-hot) ผ่าน lobbyMockData.ts
 */
export const HOT_GAMES_FEATURED_ITEMS: GameItem[] = [
  {
    id: "game-super-ace",
    title: "Super Ace",
    provider: "JILI",
    href: "/slots?provider=jili",
    coverSrc: hitzCover("super ace.webp"),
  },
  {
    id: "game-lucky-neko",
    title: "Lucky Neko",
    provider: "PG Soft",
    href: "/slots?provider=pg-soft",
    coverSrc: hitzCover("lucky neko.webp"),
  },
  {
    id: "game-mahjong-ways",
    title: "Mahjong Ways",
    provider: "PG Soft",
    href: "/slots?provider=pg-soft",
    coverSrc: hitzCover("majongway.webp"),
  },
  {
    id: "game-wild-bounty",
    title: "Wild Bounty Showdown",
    provider: "PG Soft",
    href: "/slots?provider=pg-soft",
    coverSrc: hitzCover("wildBounty.webp"),
  },
  {
    id: "game-winwin-neko",
    title: "Win Win Neko",
    provider: "PG Soft",
    href: "/slots?provider=pg-soft",
    coverSrc: hitzCover("winwin neko.webp"),
  },
  {
    id: "game-songkran-splash",
    title: "Songkran Splash",
    provider: "PG Soft",
    href: "/slots?provider=pg-soft",
    coverSrc: hitzCover("songkran splash.webp"),
  },
  {
    id: "game-super-element",
    title: "Super Element",
    provider: "Fa Chai",
    href: "/slots",
    coverSrc: hitzCover("superelement.webp"),
  },
  {
    id: "game-devil",
    title: "Devil's Cross",
    provider: "Hacksaw Gaming",
    href: "/slots?provider=hacksaw",
    coverSrc: hitzCover("devil.webp"),
  },
  {
    id: "game-boxing-king",
    title: "Boxing King",
    provider: "JILI",
    href: "/slots?provider=jili",
    coverSrc: hitzCover("boxign.webp"),
  },
  {
    id: "game-jackpot-fishing",
    title: "Jackpot Fishing",
    provider: "JILI",
    href: "/fishing",
    coverSrc: hitzCover("jackpotfishing.avif"),
  },
  {
    id: "game-pp-feature",
    title: "Pragmatic Hits",
    provider: "Pragmatic Play",
    href: "/slots?provider=pragmatic-play",
    coverSrc: hitzCover("pp.avif"),
  },
];
