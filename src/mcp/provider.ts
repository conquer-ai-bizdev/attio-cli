import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  CallToolResultSchema,
  type CallToolRequest,
  type CallToolResult,
  type ListToolsRequest,
  type ListToolsResult,
} from '@modelcontextprotocol/sdk/types.js';
import { getMcpAccessToken } from '../auth/tokens';

const DEFAULT_MCP_URL = 'https://mcp.attio.com/mcp';

export class OfficialAttioMcpProvider {
  private client: Client | undefined;

  constructor(
    private readonly serverUrl =
      process.env.ATTIO_MCP_URL || DEFAULT_MCP_URL
  ) {}

  async listTools(
    params?: ListToolsRequest['params']
  ): Promise<ListToolsResult> {
    const client = await this.getClient();
    return client.listTools(params);
  }

  async callTool(
    params: CallToolRequest['params']
  ): Promise<CallToolResult> {
    const client = await this.getClient();
    return CallToolResultSchema.parse(await client.callTool(params));
  }

  async close(): Promise<void> {
    if (!this.client) return;
    const client = this.client;
    this.client = undefined;
    await client.close();
  }

  private async getClient(): Promise<Client> {
    if (this.client) return this.client;

    try {
      return await this.connect(false);
    } catch (firstError) {
      try {
        return await this.connect(true);
      } catch (secondError) {
        const first = describeError(firstError);
        const second = describeError(secondError);
        throw new Error(
          `Could not connect to the official Attio MCP after refreshing authorization. First attempt: ${first}. Retry: ${second}`
        );
      }
    }
  }

  private async connect(forceRefresh: boolean): Promise<Client> {
    const accessToken = await getMcpAccessToken(forceRefresh);
    const client = new Client({
      name: 'conquer-attio-cli',
      version: '0.1.0',
    });
    const transport = new StreamableHTTPClientTransport(
      new URL(this.serverUrl),
      {
        requestInit: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      }
    );

    try {
      await client.connect(transport);
      this.client = client;
      return client;
    } catch (error) {
      await client.close().catch(() => undefined);
      throw error;
    }
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
