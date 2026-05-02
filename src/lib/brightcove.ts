const NHL_BRIGHTCOVE_ACCOUNT_ID = "6415718365001";
const NHL_BRIGHTCOVE_PLAYER_ID = "EXtG1xJ7H";
const NHL_BRIGHTCOVE_EMBED_ID = "default";
const NHL_BRIGHTCOVE_APPLICATION_ID = "nhl";

export function buildBrightcoveEmbedUrl(videoId: string, autoplay = false) {
  const autoplayParam = autoplay ? "&autoplay=play" : "";

  return `https://players.brightcove.net/${NHL_BRIGHTCOVE_ACCOUNT_ID}/${NHL_BRIGHTCOVE_PLAYER_ID}_${NHL_BRIGHTCOVE_EMBED_ID}/index.html?applicationId=${NHL_BRIGHTCOVE_APPLICATION_ID}${autoplayParam}&videoId=${videoId}`;
}

export function extractBrightcoveVideoId(input?: string | number | null): string | null {
  if (!input) return null;

  const value = String(input);

  // Direkt numeriskt Brightcove-ID, ofta 10–20 siffror
  if (/^\d{10,20}$/.test(value)) {
    return value;
  }

  // Om URL innehåller videoId=...
  const videoIdParam = value.match(/[?&]videoId=(\d{10,20})/);
  if (videoIdParam?.[1]) {
    return videoIdParam[1];
  }

  // Om NHL URL/path slutar med ett numeriskt video-ID
  const trailingId = value.match(/-(\d{10,20})(?:$|[/?#])/);
  if (trailingId?.[1]) {
    return trailingId[1];
  }

  // Fallback: hitta första rimliga 10–20-siffriga ID
  const anyId = value.match(/\b(\d{10,20})\b/);
  if (anyId?.[1]) {
    return anyId[1];
  }

  return null;
}
