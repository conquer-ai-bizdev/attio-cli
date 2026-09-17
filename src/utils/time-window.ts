export function attioExclusiveLowerBound(value: string): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`Invalid interval start: ${value}`);
  }
  return new Date(timestamp - 1).toISOString();
}
