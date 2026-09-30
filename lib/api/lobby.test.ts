import assert from "node:assert/strict";
import test from "node:test";
import { WELCOME_BANNER_SLIDES, POPULAR_HIGHLIGHTS_DATA } from "@/app/data/lobbyMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";
import { HALL_OF_FAME_DATA } from "@/app/data/hallOfFameMockData";
import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import {
  fetchDesktopPlayerPanel,
  fetchHallOfFame,
  fetchHomeBanners,
  fetchHomeHighlights,
  fetchLobbyAnnouncements,
} from "./lobby";

test("lobby readers return the current mocks", () => {
  assert.equal(fetchHomeBanners().welcomeSlides, WELCOME_BANNER_SLIDES);
  assert.equal(fetchHomeHighlights().highlights, POPULAR_HIGHLIGHTS_DATA);
  assert.equal(fetchLobbyAnnouncements(), LOBBY_ANNOUNCEMENT_MESSAGES);
  assert.equal(fetchHallOfFame(), HALL_OF_FAME_DATA);
  assert.equal(fetchDesktopPlayerPanel(), DESKTOP_PLAYER_PANEL_MOCK);
});
