export function toNhlUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `https://www.nhl.com${path}`;
}
