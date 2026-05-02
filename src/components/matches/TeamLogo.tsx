import { useState } from "react";
import { cn } from "../../lib/utils";
import { Shield } from "lucide-react";

interface TeamLogoProps {
  logo?: string;
  abbrev?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function TeamLogo({ logo, abbrev, size = "md", className }: TeamLogoProps) {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  const textSizes = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size], className)}>
      {!error && (logo || abbrev) ? (
        <img
          src={logo || `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`}
          alt={abbrev}
          className="h-full w-full object-contain drop-shadow-md"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white/5 border border-white/10">
          <Shield className="h-1/2 w-1/2 text-text-secondary" />
          <span className={cn("font-bold text-text-secondary", textSizes[size])}>{abbrev}</span>
        </div>
      )}
    </div>
  );
}
