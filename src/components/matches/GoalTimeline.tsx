import { NormalizedGoal } from "../../types/nhl";
import TeamLogo from "./TeamLogo";
import { cn } from "../../lib/utils";
import { Play } from "lucide-react";

interface GoalTimelineProps {
  goals: NormalizedGoal[];
}

export default function GoalTimeline({ goals }: GoalTimelineProps) {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-text-secondary italic">Inga mål registrerade ännu.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-ice-blue/20" />

      <div className="space-y-8">
        {goals.map((goal, index) => (
          <div key={`${goal.scorer}-${goal.timeInPeriod}-${index}`} className="relative flex items-start gap-4">
            {/* Team marker */}
            <div className="relative z-10 p-0.5 rounded-full bg-background ring-2 ring-neon-orange glow-orange">
              <TeamLogo abbrev={goal.teamAbbrev} size="sm" />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ice-blue flex items-center gap-2">
                  {goal.period}P • {goal.timeInPeriod}
                  {goal.highlightVideoId && <Play className="w-3 h-3 text-neon-orange" />}
                </span>
                <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                  {goal.awayScore} - {goal.homeScore}
                </span>
              </div>
              <p className="text-sm font-bold text-text-primary truncate mt-1">
                {goal.scorer}
              </p>
              {goal.strength && goal.strength !== "ev" && (
                <span className="text-[10px] font-bold uppercase text-neon-orange/80">
                  {goal.strength === "pp" ? "Powerplay" : goal.strength === "sh" ? "Short-handed" : goal.strength}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
