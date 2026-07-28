export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / Math.pow(1024, i);
  const decimals = value >= 100 || i === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[i]}`;
}

/** Percentage saved going from `original` to `compressed`. Can be negative. */
export function percentSaved(original: number, compressed: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}
