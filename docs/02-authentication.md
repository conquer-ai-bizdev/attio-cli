# Authentication

Every request uses `Authorization: Bearer <access_token>`.

## REST commands

REST commands resolve a token in this order:

1. the global `--api-key` option;
2. `ATTIO_API_KEY`;
3. Vercel Connect.

Vercel Connect uses an app subject and the connector named by
`ATTIO_REST_CONNECTOR`. Its default is
`api.attio.com/attio-rest-files`. The CLI refreshes the Connect token and
retries one time after a `401`.

## Official MCP commands

`attio mcp tools` and `attio mcp call` resolve a token in this order:

1. `ATTIO_MCP_TOKEN`;
2. Vercel Connect.

Vercel Connect uses the connector named by `ATTIO_MCP_CONNECTOR`, with a user
subject named by `ATTIO_MCP_SUBJECT`. The defaults are
`mcp.attio.com/attio-mcp-eve-v3` and `crm-agent-eve`. The requested resource is
`https://mcp.attio.com/mcp`, with `openid`, `offline_access`, and `mcp` scopes.

The CLI refreshes the Connect token and retries one time when it cannot create
an MCP session.

## Runtime requirements

Direct Connect resolution requires the OIDC identity of the consuming Vercel
project. A deployed runtime MAY inject fresh `ATTIO_API_KEY` and
`ATTIO_MCP_TOKEN` values into a bounded subprocess. Tokens MUST stay out of
command arguments, logs, and committed files.
