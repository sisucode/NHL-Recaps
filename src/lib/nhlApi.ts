import { normalizeGames } from "./nhlNormalize";
import { getTodayDate, getYesterdayDate, getCurrentNhlSeasonId } from "./dateUtils";
import { getMockGames } from "./mockNhlData";
import type { NormalizedGame, SkaterLeader } from "../types/nhl";

function getNhlApiUrl(path: string) {
  // Using the express setup
  return `/api/nhl/web${path}`;
}

function getNhlStatsUrl(path: string) {
  return `/api/nhl/stats${path}`;
}

export async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      if ((import.meta as any).env.DEV) {
        console.warn(`[NHL API] ${res.status} ${url}`);
      }
      return null;
    }

    return await res.json();
  } catch (error) {
    if ((import.meta as any).env.DEV) {
      console.error("[NHL API] Fetch failed:", error);
    }
    return null;
  }
}

export async function getMatchesWithFallback(): Promise<NormalizedGame[]> {
  const now = await safeFetchJson<any>(getNhlApiUrl("/v1/score/now"));

  if (now?.games?.length) {
    return normalizeGames(now.games);
  }

  const today = await safeFetchJson<any>(
    getNhlApiUrl(`/v1/score/${getTodayDate()}`)
  );

  if (today?.games?.length) {
    return normalizeGames(today.games);
  }

  const yesterday = await safeFetchJson<any>(
    getNhlApiUrl(`/v1/score/${getYesterdayDate()}`)
  );

  if (yesterday?.games?.length) {
    return normalizeGames(yesterday.games);
  }

  if ((import.meta as any).env.DEV) {
    return getMockGames();
  }

  return [];
}

export async function getGameDetails(gameId: number) {
  const landing = await safeFetchJson<any>(
    getNhlApiUrl(`/v1/gamecenter/${gameId}/landing`)
  );

  const gameStory = await safeFetchJson<any>(
    getNhlApiUrl(`/v1/wsc/game-story/${gameId}`)
  );

  const rightRail = await safeFetchJson<any>(
    getNhlApiUrl(`/v1/gamecenter/${gameId}/right-rail`)
  );

  return {
    landing,
    gameStory,
    rightRail,
  };
}

export async function fetchStatsLeaders(): Promise<SkaterLeader[]> {
  const seasonId = getCurrentNhlSeasonId();
  const url = getNhlApiUrl(`/v1/skater-stats-leaders/current?categories=points&limit=50`);
  let data = await safeFetchJson<any>(url);

  if (!data || !data.points) {
    const fallbackUrl = getNhlApiUrl(`/v1/skater-stats-leaders/${seasonId}/2?categories=points&limit=50`);
    data = await safeFetchJson<any>(fallbackUrl);
  }
  
  if (!data || !data.points) {
    return [];
  }

  return data.points.map((item: any, index: number) => ({
    playerId: item.id,
    playerName: { default: item.firstName?.default + " " + item.lastName?.default },
    teamAbbrev: item.teamAbbrev || "",
    points: item.points,
    goals: item.goals,
    assists: item.assists,
    gamesPlayed: item.gamesPlayed,
    rank: index + 1,
    teamLogo: item.headshot,
  }));
}
