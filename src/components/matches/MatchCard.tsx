import { NormalizedGame } from "../../types/nhl";
import TeamLogo from "./TeamLogo";
import { formatGameTime } from "../../lib/dateUtils";
import { Play, Info, Eye, Activity } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface MatchCardProps {
  game: NormalizedGame;
  onOpenRecap: (game: NormalizedGame) => void;
}

export default function MatchCard({ game, onOpenRecap }: MatchCardProps) {
  const isLive = game.state === "live";
  const isFinal = game.state === "final";
  const isFuture = game.state === "scheduled";
  const hasVideo = game.resolvedVideo != null;

  let buttonText = "Matchinfo";
  let ButtonIcon = Info;

  if (isFinal) {
    if (hasVideo) {
      buttonText = "Spela recap";
      ButtonIcon = Play;
    } else {
      buttonText = "Se matchhändelser";
      ButtonIcon = Activity;
    }
  } else if (isLive) {
    buttonText = "Följ matchen";
    ButtonIcon = Eye;
  }

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(125, 211, 252, 0.4)" }}
      className={cn(
        "glass-card flex flex-col group p-5 hover:bg-white/[0.06] border-border-subtle",
        hasVideo ? "bg-white/[0.05] border-ice-blue/20" : "bg-white/[0.02]"
      )}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border",
              isLive ? "bg-success-live/10 text-success-live border-success-live/20 animate-pulse" :
              isFinal ? "bg-white/5 text-slate-300 border-white/10" :
              "bg-white/5 text-slate-500 border-white/5"
            )}>
              {game.stateLabel}
            </span>
            {hasVideo && (
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-ice-blue/10 text-ice-blue border border-ice-blue/20 flex items-center gap-1">
                 <Play className="w-3 h-3" />
                 Recap
              </span>
            )}
            {!hasVideo && isFinal && (
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-white/10">
                 Recap väntas
              </span>
            )}
         </div>
         {(isLive || isFinal) && (
           <span className="text-xs font-mono text-slate-500">
             SOG: {game.awaySog || 0} - {game.homeSog || 0}
           </span>
         )}
         {isFuture && (
           <span className="text-xs font-mono text-slate-500">
             {formatGameTime(game.startTimeUTC || "")}
           </span>
         )}
      </div>

      {/* Teams & Score */}
      <div className="space-y-4 mb-6">
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TeamLogo 
              logo={game.awayTeam.logoUrl} 
              abbrev={game.awayTeam.abbrev} 
              size="md" 
              className={cn("bg-white/10", !isLive && !isFinal && "opacity-50")}
            />
            <span className={cn("font-bold text-text-primary", !isLive && !isFinal && "text-text-secondary")}>
              {game.awayTeam.name || game.awayTeam.abbrev}
            </span>
          </div>
          <span className={cn("text-2xl font-black", !isLive && !isFinal && "text-slate-600")}>
            {game.awayScore ?? 0}
          </span>
        </div>

        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TeamLogo 
              logo={game.homeTeam.logoUrl} 
              abbrev={game.homeTeam.abbrev} 
              size="md"
              className={cn("bg-white/10", !isLive && !isFinal && "opacity-50")}
            />
            <span className={cn("font-bold text-text-primary", !isLive && !isFinal && "text-text-secondary")}>
              {game.homeTeam.name || game.homeTeam.abbrev}
            </span>
          </div>
          <span className={cn("text-2xl font-black", !isLive && !isFinal && "text-slate-600")}>
            {game.homeScore ?? 0}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onOpenRecap(game)}
        className={cn(
          "btn-primary w-full flex items-center justify-center gap-2",
          hasVideo ? "bg-neon-orange hover:bg-orange-500 text-white" : 
          (isLive || isFuture) ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white/10 text-white hover:bg-white/20"
        )}
      >
        <ButtonIcon className="w-4 h-4" />
        {buttonText}
      </button>
    </motion.div>
  );
}
