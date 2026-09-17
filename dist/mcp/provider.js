"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficialAttioMcpProvider = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/client/streamableHttp.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const tokens_1 = require("../auth/tokens");
const DEFAULT_MCP_URL = 'https://mcp.attio.com/mcp';
class OfficialAttioMcpProvider {
    serverUrl;
    client;
    constructor(serverUrl = process.env.ATTIO_MCP_URL || DEFAULT_MCP_URL) {
        this.serverUrl = serverUrl;
    }
    async listTools(params) {
        const client = await this.getClient();
        return client.listTools(params);
    }
    async callTool(params) {
        const client = await this.getClient();
        return types_js_1.CallToolResultSchema.parse(await client.callTool(params));
    }
    async close() {
        if (!this.client)
            return;
        const client = this.client;
        this.client = undefined;
        await client.close();
    }
    async getClient() {
        if (this.client)
            return this.client;
        try {
            return await this.connect(false);
        }
        catch (firstError) {
            try {
                return await this.connect(true);
            }
            catch (secondError) {
                const first = describeError(firstError);
                const second = describeError(secondError);
                throw new Error(`Could not connect to Attio after refreshing authorization. First attempt: ${first}. Retry: ${second}`);
            }
        }
    }
    async connect(forceRefresh) {
        const accessToken = await (0, tokens_1.getMcpAccessToken)(forceRefresh);
        const client = new index_js_1.Client({
            name: 'conquer-attio-cli',
            version: '0.1.0',
        });
        const transport = new streamableHttp_js_1.StreamableHTTPClientTransport(new URL(this.serverUrl), {
            requestInit: {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        });
        try {
            await client.connect(transport);
            this.client = client;
            return client;
        }
        catch (error) {
            await client.close().catch(() => undefined);
            throw error;
        }
    }
}
exports.OfficialAttioMcpProvider = OfficialAttioMcpProvider;
function describeError(error) {
    return error instanceof Error ? error.message : String(error);
}
//# sourceMappingURL=provider.js.map