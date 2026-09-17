const DEFAULT_REST_CONNECTOR = 'api.attio.com/attio-rest-files';
const DEFAULT_MCP_CONNECTOR = 'mcp.attio.com/attio-mcp-eve-v3';
const DEFAULT_MCP_SUBJECT = 'crm-agent-eve';
const MCP_RESOURCE = 'https://mcp.attio.com/mcp';

let restTokenPromise: Promise<string> | undefined;
let mcpTokenPromise: Promise<string> | undefined;

interface ConnectTokenParams {
  subject: { type: 'app' } | { type: 'user'; id: string };
  resources?: string[];
  scopes?: string[];
}

export async function getRestAccessToken(
  explicitToken?: string,
  forceRefresh = false
): Promise<string> {
  if (explicitToken) return explicitToken;
  if (process.env.ATTIO_API_KEY) return process.env.ATTIO_API_KEY;

  if (forceRefresh) restTokenPromise = undefined;
  restTokenPromise ??= getConnectToken(
    process.env.ATTIO_REST_CONNECTOR || DEFAULT_REST_CONNECTOR,
    restTokenParams(),
    forceRefresh,
    'Attio REST'
  );
  return restTokenPromise;
}

export async function getMcpAccessToken(
  forceRefresh = false
): Promise<string> {
  if (process.env.ATTIO_MCP_TOKEN) return process.env.ATTIO_MCP_TOKEN;

  if (forceRefresh) mcpTokenPromise = undefined;
  mcpTokenPromise ??= getConnectToken(
    process.env.ATTIO_MCP_CONNECTOR || DEFAULT_MCP_CONNECTOR,
    mcpTokenParams(),
    forceRefresh,
    'Attio MCP'
  );
  return mcpTokenPromise;
}

async function getConnectToken(
  connector: string,
  params: ConnectTokenParams,
  forceRefresh: boolean,
  label: string
): Promise<string> {
  try {
    const { deleteTokenCacheEntry, getToken } = await import(
      '@vercel/connect'
    );
    if (forceRefresh) deleteTokenCacheEntry(connector, params);
    const options = forceRefresh
      ? { forceRefresh: true }
      : undefined;
    return await getToken(connector, params, options);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${label} authorization is unavailable through Vercel Connect: ${detail}`
    );
  }
}

function restTokenParams(): ConnectTokenParams {
  return { subject: { type: 'app' } };
}

function mcpTokenParams(): ConnectTokenParams {
  return {
    subject: {
      type: 'user',
      id: process.env.ATTIO_MCP_SUBJECT || DEFAULT_MCP_SUBJECT,
    },
    resources: [MCP_RESOURCE],
    scopes: ['openid', 'offline_access', 'mcp'],
  };
}
