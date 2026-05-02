import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMatchesWithFallback } from "../lib/nhlApi";
import MatchGrid from "../components/matches/MatchGrid";
import RecapCenterModal from "../components/matches/RecapCenterModal";
import { NormalizedGame } from "../types/nhl";
import { Loader2, RefreshCw, Calendar, Flame, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

function StatCard({ label, value, highlight, isLive }: { label: string, value: string | number, highlight?: boolean, isLive?: boolean }) {
  return (
    <div className="p-4 glass rounded-xl flex flex-col gap-1">
       <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{label}</div>
       <div className={cn(
         "text-xl font-bold transition-colors",
         isLive ? "text-success-live" : "text-text-primary"
       )}>
         {value}
       </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState<NormalizedGame | null>(null);

  const { data: games, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["nhlScores"],
    queryFn: getMatchesWithFallback,
    refetchInterval: 1000 * 60, // Refresh every 60 seconds
  });

  const liveCount = games?.filter(g => g.state === "live").length || 0;
  const finalCount = games?.filter(g => g.state === "final").length || 0;
  const videoCount = games?.filter(g => g.resolvedVideo != null).length || 0;
  const totalCount = games?.length || 0;
  
  const isDev = (import.meta as any).env.DEV;

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-12 px-8 bg-[radial-gradient(circle_at_50%_0%,_rgba(125,211,252,0.08)_0%,_transparent_70%)]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-4">
             {isDev && (
               <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-neon-orange/20 text-neon-orange border border-neon-orange/30">
                 DEV MOCK DATA
               </span>
             )}
          </div>
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              NHL Recaps och resultat från nattens matcher
            </h1>
            <p className="text-text-secondary text-base">
              Se nattens NHL-recaps, highlights och viktigaste matchhändelser direkt på sidan.
            </p>

            {/* Stat Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8">
               <StatCard label="Matcher" value={totalCount} />
               <StatCard label="Med video" value={videoCount} highlight={videoCount > 0} />
               <StatCard label="Live" value={liveCount} highlight={liveCount > 0} isLive />
               <StatCard label="Färdiga" value={finalCount} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="mx-auto max-w-7xl px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-text-secondary flex items-center gap-3">
             Nattens Omgång
             {isRefetching && <Loader2 className="h-3 w-3 animate-spin text-ice-blue" />}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-48 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 glass bg-red-500/5 rounded-2xl text-center px-6">
            <AlertCircle className="h-10 w-10 text-error-red mb-4" />
            <h2 className="text-xl font-bold text-white">Kunde inte ladda NHL-data just nu.</h2>
            <button 
              onClick={() => refetch()}
              className="mt-6 btn-primary"
            >
              Försök igen
            </button>
          </div>
        ) : games && games.length > 0 ? (
          <MatchGrid games={games} onOpenRecap={(game) => setSelectedGame(game)} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 glass rounded-2xl">
             <h3 className="text-xl font-bold text-white">Inga NHL-matcher hittades just nu.</h3>
             <p className="text-text-secondary mt-2">Kom tillbaka senare under nattens omgång!</p>
          </div>
        )}
      </section>

      {/* Recap Modal */}
      {selectedGame && <RecapCenterModal game={selectedGame} onClose={() => setSelectedGame(null)} />}

      {/* Footer Meta */}
      <section className="mx-auto max-w-7xl px-8 mt-12 pb-12 border-t border-white/5 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-text-secondary uppercase tracking-widest text-center md:text-left">
            NHL Pulse samlar nattens NHL-resultat och recaps på ett snabbt och mobilanpassat sätt.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-success-live" />
               <span className="text-[10px] text-text-secondary font-bold uppercase">API Status: OK</span>
            </div>
            <span className="text-[10px] text-slate-600">v1.2.4-stable</span>
          </div>
        </div>
      </section>
    </div>
  );
}
