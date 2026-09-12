export function formatDistance(meters?: number): string {
  if (!meters) return "--";
  if (meters < 1000) return `${String(Math.round(meters))} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return "--";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${String(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours)}h ${String(remainingMinutes)}m`;
}
