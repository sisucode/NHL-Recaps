import { NormalizedGame } from "../../types/nhl";
import MatchCard from "./MatchCard";
import { motion } from "motion/react";

interface MatchGridProps {
  games: NormalizedGame[];
  onOpenRecap: (game: NormalizedGame) => void;
}

export default function MatchGrid({ games, onOpenRecap }: MatchGridProps) {
  // Sort games: Final with video, Final without video, live, scheduled, unknown
  const sortedGames = [...games].sort((a, b) => {
    const getSortValue = (game: NormalizedGame) => {
      if (game.state === "final") {
        return game.resolvedVideo != null ? 0 : 1;
      }
      if (game.state === "live") return 2;
      if (game.state === "scheduled") return 3;
      return 4;
    };
    const priorityA = getSortValue(a);
    const priorityB = getSortValue(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    return (a.id || 0) - (b.id || 0);
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sortedGames.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MatchCard game={game} onOpenRecap={onOpenRecap} />
        </motion.div>
      ))}
    </div>
  );
}
