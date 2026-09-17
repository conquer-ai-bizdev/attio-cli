import { type CallToolRequest, type CallToolResult, type ListToolsRequest, type ListToolsResult } from '@modelcontextprotocol/sdk/types.js';
export declare class OfficialAttioMcpProvider {
    private readonly serverUrl;
    private client;
    constructor(serverUrl?: string);
    listTools(params?: ListToolsRequest['params']): Promise<ListToolsResult>;
    callTool(params: CallToolRequest['params']): Promise<CallToolResult>;
    close(): Promise<void>;
    private getClient;
    private connect;
}
//# sourceMappingURL=provider.d.ts.map