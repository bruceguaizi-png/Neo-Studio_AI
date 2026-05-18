export const FREE_EPISODES = 3;

export const PREMIUM_COOKIE_NAME = "ns_premium";
export const PREMIUM_STORAGE_KEY = "ns_premium";

export function isEpisodeLocked(episodeIndex: number, hasPremium: boolean) {
  if (hasPremium) return false;
  return episodeIndex >= FREE_EPISODES;
}

export function episodeNumberOf(index: number) {
  return index + 1;
}
