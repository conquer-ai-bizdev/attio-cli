export function markdownLinesMatch(requested: string, stored: string): boolean {
  return normalizeMarkdownLines(requested) === normalizeMarkdownLines(stored);
}

function normalizeMarkdownLines(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join('\n');
}
