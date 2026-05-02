import type { ResolvedVideo } from "../types/video";
import { buildBrightcoveEmbedUrl, extractBrightcoveVideoId } from "./brightcove";

export function resolveBrightcoveVideoFromGame(game: any): ResolvedVideo | null {
  const candidates = [
    {
      value: game?.threeMinRecap,
      type: "recap" as const,
      confidence: "high" as const,
    },
    {
      value: game?.condensedGame,
      type: "condensed" as const,
      confidence: "high" as const,
    },
    {
      value: game?.gameCenterLink,
      type: "recap" as const,
      confidence: "medium" as const,
    },
    ...(Array.isArray(game?.goals)
      ? game.goals.flatMap((goal: any) => [
          {
            value: goal?.highlightClip,
            type: "highlight" as const,
            confidence: "medium" as const,
          },
          {
            value: goal?.highlightClipSharingUrl,
            type: "highlight" as const,
            confidence: "medium" as const,
          },
        ])
      : []),
  ];

  for (const candidate of candidates) {
    const videoId = extractBrightcoveVideoId(candidate.value);

    if (videoId) {
      return {
        provider: "brightcove",
        videoId,
        embedUrl: buildBrightcoveEmbedUrl(videoId, false),
        type: candidate.type,
        confidence: candidate.confidence,
      };
    }
  }

  return null;
}

export function resolveBrightcoveVideoFromExtraData(extraData: any): ResolvedVideo | null {
  if (!extraData) return null;

  const seen = new Set<any>();
  const queue = [extraData];

  while (queue.length) {
    const current = queue.shift();

    if (!current || typeof current !== "object") continue;
    if (seen.has(current)) continue;
    seen.add(current);

    for (const [key, value] of Object.entries(current)) {
      const keyLower = key.toLowerCase();

      if (
        keyLower.includes("video") ||
        keyLower.includes("recap") ||
        keyLower.includes("highlight") ||
        keyLower.includes("brightcove")
      ) {
        const videoId = extractBrightcoveVideoId(value as any);

        if (videoId) {
          return {
            provider: "brightcove",
            videoId,
            embedUrl: buildBrightcoveEmbedUrl(videoId, false),
            type: keyLower.includes("highlight") ? "highlight" : "recap",
            confidence: "medium",
          };
        }
      }

      if (typeof value === "object" && value !== null) {
        queue.push(value);
      }
    }
  }

  return null;
}
