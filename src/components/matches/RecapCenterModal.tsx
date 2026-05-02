import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Loader2 } from "lucide-react";
import { NormalizedGame } from "../../types/nhl";
import TeamLogo from "./TeamLogo";
import VideoPlayer from "./VideoPlayer";
import VideoFallback from "./VideoFallback";
import { useQuery } from "@tanstack/react-query";
import { getGameDetails } from "../../lib/nhlApi";
import { resolveBrightcoveVideoFromExtraData } from "../../lib/videoResolver";
import { toNhlUrl } from "../../lib/videoUtils";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";
import { ResolvedVideo } from "../../types/video";

interface RecapCenterModalProps {
  game: NormalizedGame | null;
  onClose: () => void;
}

export default function RecapCenterModal({ game, onClose }: RecapCenterModalProps) {
  const [video, setVideo] = useState<ResolvedVideo | null>(null);

  const { data: details, isLoading: detailsLoading } = useQuery({
    queryKey: ["gameDetails", game?.id],
    queryFn: () => getGameDetails(game!.id),
    enabled: !!game && !game.resolvedVideo,
  });

  useEffect(() => {
    if (game?.resolvedVideo) {
      setVideo(game.resolvedVideo);
    } else if (details) {
      const extraVideo = resolveBrightcoveVideoFromExtraData(details);
      if (extraVideo) {
        setVideo(extraVideo);
      }
    } else {
      setVideo(null); // Reset when game changes
    }
  }, [game, details]);

  // Handle body scroll locking
  useEffect(() => {
    if (game) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [game]);

  if (!game) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl h-[100vh] md:h-[90vh] glass rounded-none md:rounded-[32px] overflow-hidden flex flex-col shadow-2xl bg-[#07111F]"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 md:p-6 bg-[#050814]/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 md:gap-3">
                <TeamLogo abbrev={game.awayTeam.abbrev} logo={game.awayTeam.logoUrl} size="md" />
                <span className="text-2xl md:text-3xl font-black text-white">{game.awayScore ?? 0}</span>
              </div>
              <div className="text-[10px] md:text-xs font-black text-white/20 italic">VS</div>
              <div className="flex items-center gap-2 md:gap-3">
                <TeamLogo abbrev={game.homeTeam.abbrev} logo={game.homeTeam.logoUrl} size="md" />
                <span className="text-2xl md:text-3xl font-black text-white">{game.homeScore ?? 0}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 text-text-secondary hover:text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            {video ? (
              <div className="flex flex-col">
                <div className="w-full bg-black">
                  <VideoPlayer video={video} />
                </div>
                {/* Fallback area below video */}
                <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
                   <VideoFallback game={game} />
                   
                   {/* Fallback links */}
                   <div className="mt-12 flex flex-col items-center gap-2 pt-8 border-t border-white/5">
                      <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Källa: NHL.com</span>
                      <div className="flex flex-wrap justify-center gap-4">
                         {game.recapUrl && (
                           <a href={toNhlUrl(game.recapUrl) || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary hover:text-white transition-colors">Öppna officiell recap</a>
                         )}
                         {game.condensedUrl && (
                           <a href={toNhlUrl(game.condensedUrl) || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary hover:text-white transition-colors">Öppna condensed game</a>
                         )}
                         {game.gameCenterUrl && (
                           <a href={toNhlUrl(game.gameCenterUrl) || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary hover:text-white transition-colors">Öppna GameCenter</a>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            ) : (
               <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
                  {detailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-ice-blue" />
                      <p className="text-sm text-text-secondary">Söker efter video...</p>
                    </div>
                  ) : (
                    <>
                      <VideoFallback game={game} />
                      <div className="mt-12 flex flex-col items-center gap-2 pt-8 border-t border-white/5">
                        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Källa: NHL.com</span>
                        <div className="flex flex-wrap justify-center gap-4">
                           {game.recapUrl && (
                             <a href={toNhlUrl(game.recapUrl) || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary hover:text-white transition-colors">Öppna officiell recap</a>
                           )}
                           {game.condensedUrl && (
                             <a href={toNhlUrl(game.condensedUrl) || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary hover:text-white transition-colors">Öppna condensed game</a>
                           )}
                           {game.gameCenterUrl && (
                             <a href={toNhlUrl(game.gameCenterUrl) || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary hover:text-white transition-colors">Öppna GameCenter</a>
                           )}
                        </div>
                      </div>
                    </>
                  )}
               </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
