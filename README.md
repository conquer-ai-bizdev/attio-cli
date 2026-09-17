# Attio CLI

`attio` is a JSON-first command-line client for Attio. It exposes typed REST
commands for API capabilities and a generic client for every tool published by
the official Attio MCP server.

## Install

```bash
npm install --global github:conquer-ai-bizdev/attio-cli
attio --help
```

Node.js 18 or newer is required.

## Authentication

The CLI resolves credentials in this order.

For REST commands:

1. the global `--api-key` value;
2. `ATTIO_API_KEY`;
3. an app token from the Vercel Connect connector configured by
   `ATTIO_REST_CONNECTOR`.

For official MCP commands:

1. `ATTIO_MCP_TOKEN`;
2. a user-subject token from the Vercel Connect connector configured by
   `ATTIO_MCP_CONNECTOR`.

The defaults used by the Conquer Eve deployment are:

```text
ATTIO_REST_CONNECTOR=api.attio.com/attio-rest-files
ATTIO_MCP_CONNECTOR=mcp.attio.com/attio-mcp-eve-v3
ATTIO_MCP_SUBJECT=crm-agent-eve
```

Vercel Connect handles token storage and refresh. A process that uses Connect
MUST run with the consuming Vercel project's OIDC identity. Supplying
`ATTIO_API_KEY` or `ATTIO_MCP_TOKEN` is useful for a bounded process whose
runtime already injects fresh credentials.

## Official MCP tools

List every tool and its current input schema:

```bash
attio mcp tools | jq '.pagination, [.data[].name]'
```

Call any published tool with inline JSON:

```bash
attio mcp call get-records-by-ids \
  --args '{"object":"companies","record_ids":["<record-id>"]}' \
  | jq -r '.text'
```

Arguments can also come from standard input:

```bash
jq -n \
  --arg mailbox_id "$MAILBOX_ID" \
  --arg email_id "$EMAIL_ID" \
  '{mailbox_id:$mailbox_id,email_id:$email_id}' \
  | attio mcp call get-email-content \
  | jq -r '.text'
```

`attio mcp tools` follows every schema page. `attio mcp call` preserves the
complete MCP content array and structured content. It also exposes all text
blocks joined as `.text` for ordinary shell and `jq` workflows.

Successful calls exit `0`. An MCP tool error exits `1` and prints a JSON result
with `ok: false`, `is_error: true`, and the server's human-readable message.
Local argument, authorization, transport, and protocol failures also exit `1`
and print a JSON error object.

## REST commands

Run `attio <group> --help` for the exact command surface. Command groups
include:

```text
workspace  object       attribute  record
list       entry        note       task
meeting    email        call-recording
file       comment      mcp
```

Examples:

```bash
attio workspace whoami
attio record get companies <record-id> --verbose
attio record get-many companies <record-id-1> <record-id-2> --verbose
attio meeting list --limit 50 --format json
attio note find --parent-object deals --parent-record-id <record-id>
attio file list deals <record-id>
```

A missing singular resource returns a nonzero error. A collection operation
with no matching resources returns an empty collection.

## Development

```bash
npm install --legacy-peer-deps
npm run type-check
npm test -- --reporter=dot
npm run build
```

Live validation requires a real Attio workspace and either Vercel Connect
identity or explicitly injected tokens. Unit tests protect local request,
formatting, and error contracts; they are not a substitute for live read,
write, readback, deletion, and absence checks.
