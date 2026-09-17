# Attio CLI

`attio` is a JSON command-line interface for Attio. Its command shape is:

```text
attio <resource> <operation> [arguments] [options]
```

The CLI is designed for shell composition with `jq`. Successful commands write
one compact JSON value to standard output and exit `0`. Failed commands write a
human-readable error to standard error and exit nonzero.

## Install

```bash
npm install --global github:conquer-ai-bizdev/attio-cli
attio --help
```

Node.js 18 or newer is required. Credentials are resolved and refreshed
automatically for the Conquer workspace. `ATTIO_API_KEY` and the global
`--api-key` option may provide an explicit credential for bounded local use.

## Commands

```text
workspace       object          attribute       record
list            entry           note            task
meeting         email           call-recording  file
comment         report
```

Run `attio <resource> --help` and
`attio <resource> <operation> --help` for the exact interface.

Examples:

```bash
attio workspace whoami
attio record search companies "Acme"
attio record get companies <record-id> | jq '.values'
attio record update companies <record-id> <<'EOF'
{
  "description": "Updated from stdin"
}
EOF
attio email list --domain example.com \
  --from 2026-09-01T00:00:00Z --before 2026-10-01T00:00:00Z --all
attio email get <mailbox-id> <email-id>
attio meeting search \
  --from 2026-09-01T00:00:00Z \
  --before 2026-10-01T00:00:00Z --all
attio note list --parent-object deals --parent-record-id <record-id>
attio note create deals <record-id> "[AI] Brief" --markdown <<'EOF'
# Summary

- First point
- Second point
EOF
attio file list deals <record-id>
attio report run companies '{"type":"count"}'
```

Write payloads may be supplied as the final positional argument or through
standard input. If the payload argument is omitted, the command reads stdin.
This makes heredocs and `jq` pipelines the default path for structured data and
long text without shell escaping.

A missing singular resource returns a nonzero error. A collection operation
with no matching resources returns an empty collection and exits `0`.

## Development

```bash
npm install --legacy-peer-deps
npm run type-check
npm test -- --reporter=dot
npm run build
```

Live validation uses a real Attio workspace. Unit tests protect local request,
formatting, and error contracts; release evidence includes live read, write,
readback, deletion, and absence checks.
