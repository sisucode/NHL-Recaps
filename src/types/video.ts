export type ResolvedVideo = {
  provider: "brightcove";
  videoId: string;
  embedUrl: string;
  title?: string;
  type: "recap" | "condensed" | "highlight";
  confidence: "high" | "medium" | "low";
};
