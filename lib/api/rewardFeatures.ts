import {
  EXCHANGE_MONEY_PACKAGES,
  EXCHANGE_MONEY_RATE_LABEL,
  FREESPIN_OFFERS_MOCK,
  LUCKY_BOX_DRAW_COST_DISPLAY,
  LUCKY_BOX_HERO_IMAGE_SRC,
  REWARD_REDEEM_COMING_SOON_LABEL,
  RANDOM_CARD_COMING_SOON_LABEL,
  RANDOM_CARD_COUNT,
  RANDOM_CARD_DISPLAY_ITEMS,
  RANDOM_CARD_DRAW_COST_DISPLAY,
  REWARD_FEATURE_TERMS,
  REWARD_HUB_PROMO_BANNERS,
  REWARD_HUB_SHORTCUTS,
  REWARD_POINTS_BALANCE_MOCK,
} from "@/app/data/rewardFeaturesMockData";

/** โหลดข้อมูลศูนย์รางวัล — mock จนกว่าจะมี API */
export function fetchRewardHub() {
  return {
    pointsBalance: REWARD_POINTS_BALANCE_MOCK,
    shortcuts: REWARD_HUB_SHORTCUTS,
    banners: REWARD_HUB_PROMO_BANNERS,
    terms: REWARD_FEATURE_TERMS,
  };
}

export function fetchLuckyBox() {
  return {
    drawCost: LUCKY_BOX_DRAW_COST_DISPLAY,
    heroImageSrc: LUCKY_BOX_HERO_IMAGE_SRC,
    comingSoonLabel: REWARD_REDEEM_COMING_SOON_LABEL,
    terms: REWARD_FEATURE_TERMS,
  };
}

export function fetchRandomCard() {
  return {
    cardCount: RANDOM_CARD_COUNT,
    displayCards: RANDOM_CARD_DISPLAY_ITEMS,
    drawCost: RANDOM_CARD_DRAW_COST_DISPLAY,
    comingSoonLabel: RANDOM_CARD_COMING_SOON_LABEL,
    terms: REWARD_FEATURE_TERMS,
  };
}

export function fetchExchangeMoney() {
  return {
    packages: EXCHANGE_MONEY_PACKAGES,
    rateLabel: EXCHANGE_MONEY_RATE_LABEL,
    terms: REWARD_FEATURE_TERMS,
  };
}

export function fetchFreespins() {
  return {
    offers: FREESPIN_OFFERS_MOCK,
    terms: REWARD_FEATURE_TERMS,
  };
}
