import type { NhlNews } from "../types/news";
import { safeFetchJson } from "./nhlApi";

export async function fetchNhlNews(): Promise<NhlNews[]> {
  const isDev = (import.meta as any).env.DEV;
  
  if (isDev) {
    // Optionally return mock data
    const res = await safeFetchJson<NhlNews[]>("/api/nhl-news");
    if (res && res.length > 0) return res;
    
    return [
      {
        title: "Avalanche svepte Kings ur slutspelet",
        url: "https://www.nhl.com/sv/news",
        summary: "Colorado Avalanche skickade hem LA Kings med 4-0 i matcher. Nathan MacKinnon glänste återigen.",
        tag: "Slutspel",
        date: new Date().toISOString()
      },
      {
        title: "Svensk glädje när Vancouver vann övertidsrysare",
        url: "https://www.nhl.com/sv/news",
        summary: "Elias Pettersson säkrade segern för Canucks under förlängningen.",
        tag: "Svenskar",
        date: new Date(Date.now() - 3600000).toISOString()
      },
      {
        title: "Skadeuppdatering: McDavid borta i två veckor",
        url: "https://www.nhl.com/sv/news",
        summary: "Oilers kapten Connor McDavid drabbades av en underkroppsskada i nattens match.",
        tag: "Skada",
        date: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }
  
  const news = await safeFetchJson<NhlNews[]>("/api/nhl-news");
  return news || [];
}
