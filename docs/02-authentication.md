# Authentication

The CLI resolves and refreshes the Conquer workspace credential automatically.
Commands work from any current working directory.

For bounded local use, an explicit credential may be supplied in this order:

1. the global `--api-key` option;
2. `ATTIO_API_KEY`;
3. the automatically managed workspace credential.

Credentials MUST stay out of command output, logs, and committed files.
