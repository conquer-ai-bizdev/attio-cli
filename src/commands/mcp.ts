import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import type {
  CallToolResult,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { OfficialAttioMcpProvider } from '../mcp/provider';
import { formatJson } from '../formatters/json';

export function createMcpCommand(): Command {
  const mcp = new Command('mcp').description(
    'Call every tool exposed by the official Attio MCP with automatic OAuth refresh'
  );

  mcp
    .command('tools')
    .description('List every official Attio MCP tool and its input schema')
    .action(async () => {
      const provider = new OfficialAttioMcpProvider();
      try {
        const tools: Tool[] = [];
        let cursor: string | undefined;
        let pages = 0;

        do {
          const page = await provider.listTools(cursor ? { cursor } : undefined);
          tools.push(...page.tools);
          cursor = page.nextCursor;
          pages += 1;
        } while (cursor);

        console.log(
          formatJson({
            ok: true,
            data: tools,
            pagination: {
              complete: true,
              pages,
              count: tools.length,
            },
          })
        );
      } catch (error) {
        printFailure(error);
      } finally {
        await provider.close().catch(() => undefined);
      }
    });

  mcp
    .command('call')
    .description(
      'Call one official Attio MCP tool; pass JSON with --args or through stdin'
    )
    .argument('<tool>', 'Exact tool name from `attio mcp tools`')
    .option('--args <json>', 'Tool arguments as one JSON object')
    .action(async (tool: string, options: { args?: string }) => {
      const provider = new OfficialAttioMcpProvider();
      try {
        const args = readArguments(options.args);
        const result = await provider.callTool({ name: tool, arguments: args });
        console.log(formatJson(normalizeResult(tool, result)));
        if (result.isError) process.exitCode = 1;
      } catch (error) {
        printFailure(error, tool);
      } finally {
        await provider.close().catch(() => undefined);
      }
    });

  return mcp;
}

function readArguments(inline?: string): Record<string, unknown> {
  const source = inline ?? readStdinIfAvailable();
  if (!source.trim()) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Tool arguments are not valid JSON: ${detail}`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Tool arguments must be a JSON object.');
  }
  return parsed as Record<string, unknown>;
}

function readStdinIfAvailable(): string {
  if (process.stdin.isTTY) return '';
  return readFileSync(0, 'utf8');
}

function normalizeResult(tool: string, result: CallToolResult): object {
  const text = result.content
    .filter(
      (item): item is Extract<(typeof result.content)[number], { type: 'text' }> =>
        item.type === 'text'
    )
    .map((item) => item.text)
    .join('\n');

  return {
    ok: !result.isError,
    tool,
    is_error: Boolean(result.isError),
    structured_content: result.structuredContent ?? null,
    text,
    content: result.content,
  };
}

function printFailure(error: unknown, tool?: string): void {
  const message = error instanceof Error ? error.message : String(error);
  console.log(
    formatJson({
      ok: false,
      ...(tool ? { tool } : {}),
      error: { message },
    })
  );
  process.exitCode = 1;
}
