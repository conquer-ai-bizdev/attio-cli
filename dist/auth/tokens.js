"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestAccessToken = getRestAccessToken;
exports.getMcpAccessToken = getMcpAccessToken;
const DEFAULT_REST_CONNECTOR = 'api.attio.com/attio-rest-files';
const DEFAULT_MCP_CONNECTOR = 'mcp.attio.com/attio-mcp-eve-v3';
const DEFAULT_MCP_SUBJECT = 'crm-agent-eve';
const MCP_RESOURCE = 'https://mcp.attio.com/mcp';
const DEFAULT_VERCEL_PROJECT_ID = 'prj_qkvxdbCaPAf1R5v6e1nhnNAMEHBE';
const DEFAULT_VERCEL_TEAM_ID = 'team_AUJ1KVC9XMzLAZFiDG9yYuWf';
let restTokenPromise;
let mcpTokenPromise;
async function getRestAccessToken(explicitToken, forceRefresh = false) {
    if (explicitToken)
        return explicitToken;
    if (process.env.ATTIO_API_KEY)
        return process.env.ATTIO_API_KEY;
    if (forceRefresh)
        restTokenPromise = undefined;
    restTokenPromise ??= getConnectToken(process.env.ATTIO_REST_CONNECTOR || DEFAULT_REST_CONNECTOR, restTokenParams(), forceRefresh, 'Attio');
    return restTokenPromise;
}
async function getMcpAccessToken(forceRefresh = false) {
    if (process.env.ATTIO_MCP_TOKEN)
        return process.env.ATTIO_MCP_TOKEN;
    if (forceRefresh)
        mcpTokenPromise = undefined;
    mcpTokenPromise ??= getConnectToken(process.env.ATTIO_MCP_CONNECTOR || DEFAULT_MCP_CONNECTOR, mcpTokenParams(), forceRefresh, 'Attio');
    return mcpTokenPromise;
}
async function getConnectToken(connector, params, forceRefresh, label) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            const { deleteTokenCacheEntry, getToken } = await import('@vercel/connect');
            const { getVercelOidcToken } = await import('@vercel/oidc');
            if (forceRefresh || attempt > 1)
                deleteTokenCacheEntry(connector, params);
            const vercelToken = await getVercelOidcToken({
                project: process.env.ATTIO_VERCEL_PROJECT_ID || DEFAULT_VERCEL_PROJECT_ID,
                team: process.env.ATTIO_VERCEL_TEAM_ID || DEFAULT_VERCEL_TEAM_ID,
            });
            return await getToken(connector, params, {
                forceRefresh: forceRefresh || attempt > 1,
                vercelToken,
            });
        }
        catch (error) {
            lastError = error;
            if (attempt === 3 || !isTransientTransportError(error))
                break;
            await sleep(250 * attempt);
        }
    }
    const detail = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`${label} authorization failed: ${detail}`);
}
function isTransientTransportError(error) {
    const detail = error instanceof Error ? error.message : String(error);
    return /fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|socket hang up/i.test(detail);
}
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function restTokenParams() {
    return { subject: { type: 'app' } };
}
function mcpTokenParams() {
    return {
        subject: {
            type: 'user',
            id: process.env.ATTIO_MCP_SUBJECT || DEFAULT_MCP_SUBJECT,
        },
        resources: [MCP_RESOURCE],
        scopes: ['openid', 'offline_access', 'mcp'],
    };
}
//# sourceMappingURL=tokens.js.map