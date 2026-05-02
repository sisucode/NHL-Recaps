import type { ResolvedVideo } from "./video";

export type NormalizedGame = {
  id: number;
  season?: number;
  date?: string;
  startTimeUTC?: string;
  state: "scheduled" | "live" | "final" | "unknown";
  stateLabel: string;
  awayTeam: NormalizedTeam;
  homeTeam: NormalizedTeam;
  awayScore?: number;
  homeScore?: number;
  awaySog?: number;
  homeSog?: number;
  goals: NormalizedGoal[];
  recapUrl?: string | null;
  condensedUrl?: string | null;
  gameCenterUrl?: string | null;
  resolvedVideo?: ResolvedVideo | null;
  clock?: {
    timeRemaining?: string;
    inIntermission?: boolean;
  };
  periodDescriptor?: {
    number?: number;
    periodType?: string;
  };
};

export type NormalizedTeam = {
  id?: number;
  name: string;
  abbrev: string;
  logoUrl?: string;
};

export type NormalizedGoal = {
  period?: number;
  timeInPeriod?: string;
  scorer: string;
  teamAbbrev?: string;
  awayScore?: number;
  homeScore?: number;
  highlightUrl?: string | null;
  highlightVideoId?: string | null;
  strength?: string;
};

export type SkaterLeader = {
  playerId: number;
  playerName: {
    default: string;
  };
  teamAbbrev: string;
  points: number;
  goals: number;
  assists: number;
  gamesPlayed: number;
  rank: number;
  teamLogo?: string;
};
