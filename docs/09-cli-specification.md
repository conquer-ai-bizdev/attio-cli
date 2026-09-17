# CLI contract

The executable is the command reference. Use:

```bash
attio --help
attio <resource> --help
attio <resource> <operation> --help
```

## Grammar

```text
attio <resource> <operation> [identifiers] [payload] [options]
```

- Put resource identities in positional arguments.
- Supply a write payload as the final positional argument or omit it to read
  stdin. A literal `-` also means stdin.
- Use options only for optional filters and behavior modifiers.
- Write one compact JSON value to stdout on success.
- Write a human-readable error to stderr and exit nonzero on failure.
- Return an empty collection, not a 404, when a list operation has no matches.

Examples:

```bash
attio record get companies <record-id>

attio record update companies <record-id> <<'EOF'
{"description":"Updated"}
EOF

attio note create deals <record-id> "[AI] Brief" --markdown <<'EOF'
# Summary

- Evidence-backed point
EOF
```

The generated `--help` output is authoritative when this document and the
executable differ.
