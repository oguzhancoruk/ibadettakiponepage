export const BADGE_IMAGES = [
  require("../assets/badges/badge-01.png"),
  require("../assets/badges/badge-02.png"),
  require("../assets/badges/badge-03.png"),
  require("../assets/badges/badge-04.png"),
  require("../assets/badges/badge-05.png"),
  require("../assets/badges/badge-06.png"),
  require("../assets/badges/badge-07.png"),
  require("../assets/badges/badge-08.png"),
  require("../assets/badges/badge-09.png"),
  require("../assets/badges/badge-10.png"),
  require("../assets/badges/badge-11.png"),
  require("../assets/badges/badge-12.png"),
];

const UNLOCKED_BY_KEY = {
  first_step: 0,
  determined: 1,
  persistent: 0,
  champions_league: 6,
  fajr_hero: 1,
  fajr_master: 1,
  prayer_warrior: 0,
  prayer_legend: 6,
  tasbih_beginner: 2,
  tasbih_master: 2,
  dhikr_expert: 2,
  dhikr_legend: 6,
  tahajjud_lover: 5,
  duha_lover: 5,
  awwabin_champion: 5,
  first_fasting: 4,
  ramadan_hero: 4,
  early_bird: 7,
  dedicated_user: 6,
  level_10: 6,
  level_50: 6,
  level_100: 6,
  first_hatim: 3,
  hatim_3: 3,
  hatim_5: 3,
  hatim_10: 3,
  hatim_25: 3,
  fast_hatim: 3,
};

const UNLOCKED_BY_CATEGORY = {
  prayer: 1,
  tesbih: 2,
  fasting: 4,
  quran: 3,
  nafile: 5,
  general: 7,
};

const LOCKED_BY_CATEGORY = {
  prayer: 8,
  tesbih: 8,
  fasting: 10,
  quran: 9,
  nafile: 8,
  general: 11,
};

export function getAchievementBadgeSource(achievement, locked = false) {
  const category = achievement?.category || "general";
  const index = locked
    ? LOCKED_BY_CATEGORY[category] ?? 11
    : UNLOCKED_BY_KEY[achievement?.key] ?? UNLOCKED_BY_CATEGORY[category] ?? 6;

  return BADGE_IMAGES[index];
}
