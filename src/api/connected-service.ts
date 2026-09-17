import { parse } from 'yaml';
import { OfficialAttioMcpProvider } from '../mcp/provider';

type ContentBlock = {
  type?: string;
  text?: string;
};

type ToolResult = {
  isError?: boolean;
  content?: ContentBlock[];
  structuredContent?: unknown;
};

export async function callAttio(
  operation: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const provider = new OfficialAttioMcpProvider();
  try {
    const result = (await provider.callTool({
      name: operation,
      arguments: args,
    })) as ToolResult;

    if (result.isError) throw new Error(readError(result));
    if (result.structuredContent !== undefined) {
      return normalize(result.structuredContent);
    }

    const text = (result.content ?? [])
      .filter(
        (block) => block.type === 'text' && typeof block.text === 'string'
      )
      .map((block) => block.text)
      .join('\n')
      .trim();
    if (!text) return null;
    return normalize(await parseText(text));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(cleanError(message));
  } finally {
    await provider.close().catch(() => undefined);
  }
}

async function parseText(text: string): Promise<unknown> {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const { decode } = await import('@toon-format/toon');
      return decode(text);
    } catch {
      try {
        return parse(text);
      } catch {
        return text;
      }
    }
  }
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== 'object') return value;

  const normalized: Record<string, unknown> = {};
  for (const [rawKey, rawValue] of Object.entries(
    value as Record<string, unknown>
  )) {
    const match = rawKey.match(/^(.*)\[(\d+)\]$/);
    const key = match?.[1] ?? rawKey;
    const count = match ? Number(match[2]) : undefined;
    let next = normalize(rawValue);
    if (count === 0 && (next === null || next === '')) next = [];
    if (key === '' && Array.isArray(next)) return next;
    normalized[key] = next;
  }
  return normalized;
}

function readError(result: ToolResult): string {
  const text = (result.content ?? [])
    .filter((block) => block.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim();
  return text || 'Attio rejected the operation.';
}

function cleanError(message: string): string {
  return message
    .replace(/official Attio MCP/gi, 'Attio')
    .replace(/Attio MCP/gi, 'Attio')
    .replace(/\bMCP\b/g, 'Attio service')
    .replace(/\bREST\b/g, 'Attio API')
    .replace(/\btool\b/gi, 'operation')
    .replace(
      /Attio service error -32602: operation ([^\n]+) not found/gi,
      'Attio operation "$1" was not found.'
    );
}
