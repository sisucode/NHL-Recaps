import { NhlGame, YouTubeVideo } from "../types/nhl";

const YOUTUBE_API_KEY = (import.meta as any).env.VITE_YOUTUBE_API_KEY;

export async function findOfficialNhlYoutubeRecap(game: NhlGame): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) return null;

  const away = game.awayTeam.commonName?.default || game.awayTeam.abbrev;
  const home = game.homeTeam.commonName?.default || game.homeTeam.abbrev;
  const date = game.gameDate || "";
  
  // Search queries optimized for official recaps
  const queries = [
    `NHL ${away} ${home} recap ${date}`,
    `${away} at ${home} highlights NHL ${date}`
  ];

  try {
    for (const query of queries) {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
        query
      )}&type=video&key=${YOUTUBE_API_KEY}`;
      
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.items?.length) continue;

      // Filter for official NHL channel if possible, or very likely matches
      const match = data.items.find((item: any) => {
        const title = item.snippet.title.toLowerCase();
        const channelTitle = item.snippet.channelTitle.toLowerCase();
        
        const isOfficial = channelTitle.includes("nhl");
        const containsRecap = title.includes("recap") || title.includes("highlights") || title.includes("condensed");
        
        // Ensure both teams are in the title to avoid wrong game
        const hasAway = title.includes(away?.toLowerCase() || "");
        const hasHome = title.includes(home?.toLowerCase() || "");

        return (isOfficial && containsRecap && (hasAway || hasHome));
      });

      if (match) {
        return {
          videoId: match.id.videoId,
          title: match.snippet.title,
          channelTitle: match.snippet.channelTitle,
          thumbnailUrl: match.snippet.thumbnails?.high?.url || match.snippet.thumbnails?.default?.url,
        };
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("YouTube lookup failed:", error);
    }
  }

  return null;
}
