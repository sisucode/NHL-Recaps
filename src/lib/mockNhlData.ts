import type { NormalizedGame } from "../types/nhl";

export function getMockGames(): NormalizedGame[] {
  return [
    {
      id: 101,
      date: new Date().toISOString(),
      state: "final",
      stateLabel: "Slut",
      awayTeam: { abbrev: "NYR", name: "New York Rangers" },
      homeTeam: { abbrev: "NJD", name: "New Jersey Devils" },
      awayScore: 4,
      homeScore: 3,
      awaySog: 32,
      homeSog: 28,
      goals: [],
      resolvedVideo: {
        provider: "brightcove",
        videoId: "6393888986112",
        embedUrl: "https://players.brightcove.net/6415718365001/EXtG1xJ7H_default/index.html?applicationId=nhl&videoId=6393888986112",
        type: "recap",
        confidence: "high"
      }
    },
    {
      id: 102,
      date: new Date().toISOString(),
      state: "final",
      stateLabel: "Slut",
      awayTeam: { abbrev: "BOS", name: "Boston Bruins" },
      homeTeam: { abbrev: "TOR", name: "Toronto Maple Leafs" },
      awayScore: 2,
      homeScore: 1,
      awaySog: 25,
      homeSog: 30,
      goals: [],
    },
    {
      id: 103,
      date: new Date().toISOString(),
      state: "live",
      stateLabel: "Live",
      awayTeam: { abbrev: "EDM", name: "Edmonton Oilers" },
      homeTeam: { abbrev: "COL", name: "Colorado Avalanche" },
      awayScore: 5,
      homeScore: 4,
      awaySog: 41,
      homeSog: 22,
      goals: [],
      clock: { timeRemaining: "10:00" },
      periodDescriptor: { number: 3 },
    },
    {
      id: 104,
      startTimeUTC: new Date(Date.now() + 86400000).toISOString(),
      state: "scheduled",
      stateLabel: "Kommande",
      awayTeam: { abbrev: "SJS", name: "San Jose Sharks" },
      homeTeam: { abbrev: "VAN", name: "Vancouver Canucks" },
      goals: []
    }
  ];
}

export function getMockStatsLeaders(): any[] {
  return [];
}
