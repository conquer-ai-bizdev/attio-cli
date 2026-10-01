export function requirePageLimit(
  value: number | undefined,
  maximum: number,
  resource: string,
  paginationHint = 'Use --all to fetch every page.'
): number | undefined {
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || value < 1 || value > maximum) {
    throw new Error(
      `${resource} limit must be an integer between 1 and ${maximum}. ${paginationHint}`
    );
  }
  return value;
}
