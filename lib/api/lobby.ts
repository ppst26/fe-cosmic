import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import { HALL_OF_FAME_DATA } from "@/app/data/hallOfFameMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";
import {
  FEATURE_ACTIONS_DATA,
  GAME_SECTIONS_DATA,
  HOME_DESKTOP_PEEK_BANNER_SIZE,
  HOME_DESKTOP_PEEK_CAROUSEL_DATA,
  HOME_LOBBY_TOURNAMENT_ITEMS,
  HOME_PRO_BANNER_ASSETS,
  HOME_SLOTS_PROVIDER_ITEMS,
  INTRO_STATS_DATA,
  MAIN_HOME_BANNER_SRC,
  POPULAR_HIGHLIGHTS_DATA,
  PROMO_CAROUSEL_DATA,
  PROVIDERS_DATA,
  WELCOME_BANNER_SLIDES,
} from "@/app/data/lobbyMockData";

/**
 * อ่านข้อมูล lobby หน้าแรก — ชั้น client ก่อนเชื่อม API จริง
 * ถูกเรียกใช้โดย HomeLobbyPage, WelcomeBanner, Header และ component lobby อื่น ๆ
 */
export function fetchHomeBanners() {
  return {
    welcomeSlides: WELCOME_BANNER_SLIDES,
    promoCarousel: PROMO_CAROUSEL_DATA,
    peek: HOME_DESKTOP_PEEK_CAROUSEL_DATA,
    peekSize: HOME_DESKTOP_PEEK_BANNER_SIZE,
    mainSrc: MAIN_HOME_BANNER_SRC,
    proAssets: HOME_PRO_BANNER_ASSETS,
  };
}

export function fetchHomeHighlights() {
  return { highlights: POPULAR_HIGHLIGHTS_DATA, intro: INTRO_STATS_DATA };
}

export function fetchHomeGames() {
  return { sections: GAME_SECTIONS_DATA, slotProviders: HOME_SLOTS_PROVIDER_ITEMS };
}

export function fetchHomeProviders() {
  return PROVIDERS_DATA;
}

export function fetchHomeFeatureActions() {
  return FEATURE_ACTIONS_DATA;
}

export function fetchHomeTournaments() {
  return HOME_LOBBY_TOURNAMENT_ITEMS;
}

export function fetchLobbyAnnouncements() {
  return LOBBY_ANNOUNCEMENT_MESSAGES;
}

export function fetchHallOfFame() {
  return HALL_OF_FAME_DATA;
}

export function fetchDesktopPlayerPanel() {
  return DESKTOP_PLAYER_PANEL_MOCK;
}
