import { cn } from "../../lib/utils";
import { gameStateMap } from "../../lib/dateUtils";

interface StatusBadgeProps {
  state?: string;
  className?: string;
}

export default function StatusBadge({ state, className }: StatusBadgeProps) {
  const label = state ? (gameStateMap[state] || state) : "Kommande";
  
  const isLive = state === "LIVE" || state === "CRIT";
  const isFinal = state === "FINAL" || state === "OFF";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all",
        isLive && "bg-success-live/10 text-success-live ring-1 ring-success-live/20 animate-pulse",
        isFinal && "bg-white/5 text-text-secondary border border-white/10",
        !isLive && !isFinal && "bg-ice-blue/10 text-ice-blue border border-ice-blue/20",
        className
      )}
    >
      {isLive && <span className="h-1 w-1 rounded-full bg-success-live" />}
      {label}
    </div>
  );
}
