import type { NormalizedGame } from "../types/nhl";
import { toNhlUrl } from "./videoUtils";
import { extractBrightcoveVideoId } from "./brightcove";
import { resolveBrightcoveVideoFromGame } from "./videoResolver";

export function normalizeGameState(gameState?: string) {
  switch (gameState) {
    case "FUT":
    case "PRE":
      return { state: "scheduled" as const, label: "Kommande" };

    case "LIVE":
    case "CRIT":
      return { state: "live" as const, label: "Live" };

    case "FINAL":
    case "OFF":
      return { state: "final" as const, label: "Slut" };

    default:
      return { state: "unknown" as const, label: "Okänd status" };
  }
}

export function normalizeGames(rawGames: any[]): NormalizedGame[] {
  return rawGames.map((game) => {
    const state = normalizeGameState(game?.gameState);

    const awayTeam = game?.awayTeam ?? {};
    const homeTeam = game?.homeTeam ?? {};

    return {
      id: game?.id,
      season: game?.season,
      date: game?.gameDate,
      startTimeUTC: game?.startTimeUTC,
      state: state.state,
      stateLabel: state.label,

      awayTeam: {
        id: awayTeam?.id,
        name: awayTeam?.name?.default ?? awayTeam?.abbrev ?? "Bortalag",
        abbrev: awayTeam?.abbrev ?? "AWY",
        logoUrl:
          awayTeam?.logo ??
          (awayTeam?.abbrev
            ? `https://assets.nhle.com/logos/nhl/svg/${awayTeam.abbrev}_light.svg`
            : undefined),
      },

      homeTeam: {
        id: homeTeam?.id,
        name: homeTeam?.name?.default ?? homeTeam?.abbrev ?? "Hemmalag",
        abbrev: homeTeam?.abbrev ?? "HME",
        logoUrl:
          homeTeam?.logo ??
          (homeTeam?.abbrev
            ? `https://assets.nhle.com/logos/nhl/svg/${homeTeam.abbrev}_light.svg`
            : undefined),
      },

      awayScore: awayTeam?.score,
      homeScore: homeTeam?.score,
      awaySog: awayTeam?.sog,
      homeSog: homeTeam?.sog,

      goals: Array.isArray(game?.goals)
        ? game.goals.map((goal: any) => ({
            period: goal?.period,
            timeInPeriod: goal?.timeInPeriod,
            scorer: goal?.name?.default ?? "Okänd målskytt",
            teamAbbrev: goal?.teamAbbrev,
            awayScore: goal?.awayScore,
            homeScore: goal?.homeScore,
            highlightUrl: toNhlUrl(goal?.highlightClipSharingUrl),
            highlightVideoId:
              extractBrightcoveVideoId(goal?.highlightClip) ??
              extractBrightcoveVideoId(goal?.highlightClipSharingUrl),
            strength: goal?.strength,
          }))
        : [],

      recapUrl: toNhlUrl(game?.threeMinRecap),
      condensedUrl: toNhlUrl(game?.condensedGame),
      gameCenterUrl: toNhlUrl(game?.gameCenterLink),
      resolvedVideo: resolveBrightcoveVideoFromGame(game),
      clock: game?.clock,
      periodDescriptor: game?.periodDescriptor,
    };
  });
}
