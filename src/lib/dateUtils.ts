/**
 * Calculates current NHL season ID based on date
 * Oct-Dec: currentYear + nextYear (e.g. 20252026)
 * Jan-Sep: prevYear + currentYear (e.g. 20252026)
 */
export function getCurrentNhlSeasonId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  if (month >= 9) { // Oct (9) or later
    return `${year}${year + 1}`;
  } else {
    return `${year - 1}${year}`;
  }
}

export function formatGameTime(utcString: string): string {
  return new Date(utcString).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatGameDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function getTeamLogoUrl(abbrev?: string): string {
  if (!abbrev) return "";
  return `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`;
}
