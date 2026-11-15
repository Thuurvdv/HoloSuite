import { MODULE_ID, SETTING_ENABLE_FACTIONS, SETTING_PROMINENCE_RATINGS, SETTING_REPUTATION_RATINGS } from "./constants";

declare const game: any;

export function areFactionsEnabled(): boolean {
  return game.settings?.get(MODULE_ID, SETTING_ENABLE_FACTIONS) !== false;
}

export interface FactionRating {
  id: string;
  label: string;
}

// The original ratings were saved by name. Keep those names as stable IDs.
export const FACTION_RATING_SCALES = {
  reputation: {
    setting: SETTING_REPUTATION_RATINGS, title: "Reputation", icon: "fa-solid fa-users",
    defaults: ["Hostile", "Unfriendly", "Neutral", "Friendly", "Allied"]
  },
  prominence: {
    setting: SETTING_PROMINENCE_RATINGS, title: "Prominence", icon: "fa-solid fa-layer-group",
    defaults: ["Absent", "Limited", "Established", "Influential", "Dominant"]
  }
};

export type FactionRatingScale = keyof typeof FACTION_RATING_SCALES;

export function defaultFactionRatings(scale: FactionRatingScale): FactionRating[] {
  return FACTION_RATING_SCALES[scale].defaults.map(label => ({ id: label, label }));
}

export function getFactionRatings(scale: FactionRatingScale): FactionRating[] {
  const stored = game.settings?.get(MODULE_ID, FACTION_RATING_SCALES[scale].setting)?.ratings;
  if (!Array.isArray(stored)) return defaultFactionRatings(scale);
  return stored.filter(rating => typeof rating?.id === "string" && rating.id
    && typeof rating.label === "string" && rating.label.trim());
}
