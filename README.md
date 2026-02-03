# Attio CLI

A fully-typed TypeScript CLI for managing Attio CRM via REST API.

## Features

- **Fully typed** with TypeScript strict mode and Zod validation
- **Multiple output formats**: JSON, Table, CSV
- **Comprehensive API coverage**: Workspace members, Objects, Attributes
- **Rate limit handling**: Automatic retry with exponential backoff
- **Integration tested**: All endpoints validated against live Attio API

## Installation

```bash
npm install -g attio-cli
```

Or use directly with npx:

```bash
npx attio-cli --help
```

## Quick Start

### 1. Get your API key

Get your Attio API key from: https://app.attio.com/settings/api

### 2. Set up environment

Create a `.env` file or export the environment variable:

```bash
export ATTIO_API_KEY="your_api_key_here"
```

Or pass it directly:

```bash
attio --api-key your_api_key_here workspace members list
```

### 3. Run your first command

```bash
# List workspace members
attio workspace members list

# Get objects in table format
attio object list --format table

# List attributes for people object
attio object attributes people --format json

# Export to CSV
attio workspace members list --format csv > members.csv
```

## Available Commands

### Workspace Members

```bash
# List all workspace members
attio workspace members list [--limit <n>] [--offset <n>] [--format json|table|csv]

# Get specific workspace member
attio workspace members get <member-id> [--format json|table|csv]
```

### Objects

```bash
# List all objects
attio object list [--format json|table|csv]

# Get specific object
attio object get <slug> [--format json|table|csv]

# List attributes for an object
attio object attributes <object-slug> [--format json|table|csv]
```

## Output Formats

### JSON (default)
Pretty-printed JSON output:
```bash
attio workspace members list --format json
```

### Table
Human-readable table:
```bash
attio workspace members list --format table
```

### CSV
CSV format for spreadsheets:
```bash
attio workspace members list --format csv > members.csv
```

## Global Options

- `--api-key <key>`: Override ATTIO_API_KEY environment variable
- `--verbose`: Show detailed error messages
- `--help`: Show help for any command
- `--version`: Show CLI version

## Examples

### List workspace members with limit
```bash
attio workspace members list --limit 10 --format table
```

### Get all objects as JSON
```bash
attio object list --format json
```

### Export people attributes to CSV
```bash
attio object attributes people --format csv > people-attributes.csv
```

### Use custom API key
```bash
attio --api-key sk_test_xxx workspace members list
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## Tech Stack

- **TypeScript**: Strict mode with no implicit any
- **Commander.js**: CLI framework
- **Axios**: HTTP client with retry logic
- **Zod**: Runtime type validation
- **Vitest**: Testing framework
- **cli-table3**: Table formatting
- **csv-stringify**: CSV formatting

## Testing

```bash
# Run unit tests
npm test

# Run integration tests (requires ATTIO_API_KEY)
npm run test:integration

# Run all tests
npm test && npm run test:integration
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub or contact support@attio.com.

## Related

- [Attio API Documentation](https://developers.attio.com/)
- [Attio Help Center](https://help.attio.com/)
