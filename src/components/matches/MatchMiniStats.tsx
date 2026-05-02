import { NormalizedGame } from "../../types/nhl";

interface MatchMiniStatsProps {
  game: NormalizedGame;
}

export default function MatchMiniStats({ game }: MatchMiniStatsProps) {
  const stats = [
    { label: "Mål", away: game.awayScore, home: game.homeScore },
    { label: "Skott", away: game.awaySog, home: game.homeSog },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-text-secondary">
             <span>{game.awayTeam.abbrev}</span>
             <span className="text-white">{stat.label}</span>
             <span>{game.homeTeam.abbrev}</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="bg-ice-blue transition-all duration-1000"
              style={{
                width: `${((stat.away || 0) / ((stat.away || 0) + (stat.home || 0) || 1)) * 100}%`,
              }}
            />
            <div
              className="bg-neon-orange transition-all duration-1000"
              style={{
                width: `${((stat.home || 0) / ((stat.away || 0) + (stat.home || 0) || 1)) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-base font-black tracking-tight text-white">
            <span>{stat.away ?? 0}</span>
            <span>{stat.home ?? 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
