import React from "react";
import { NormalizedGame } from "../../types/nhl";
import GoalTimeline from "./GoalTimeline";
import MatchMiniStats from "./MatchMiniStats";

export default function VideoFallback({ game }: { game: NormalizedGame }) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
        <h3 className="text-xl font-bold text-white">Recap-video hittades inte ännu</h3>
        <p className="text-sm text-text-secondary">Vi visar matchens viktigaste händelser direkt här så länge.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary border-b border-white/5 pb-2">Matchhändelser</h3>
          <GoalTimeline goals={game.goals} />
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary border-b border-white/5 pb-2">Matchstatistik</h3>
          <MatchMiniStats game={game} />
        </div>
      </div>
    </div>
  );
}
