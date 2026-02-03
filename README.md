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

# List attributes WITH their possible values (convenience command)
attio object attributes-with-values <object-slug> [--show-archived] [--format json|table|csv]
```

### Attributes (Complete CRUD)

The `attribute` command provides full control over attributes for both objects and lists.

#### List & Get Attributes

```bash
# List attributes for an object or list
attio attribute list <target> <identifier> [--show-archived] [--format json|table|csv]

# Get a specific attribute
attio attribute get <target> <identifier> <attribute-slug> [--format json|table|csv]

# Examples:
attio attribute list objects people --format table
attio attribute get objects companies industry --format json
attio attribute list lists my_list --format table
```

#### Create & Update Attributes

```bash
# Create a new attribute
attio attribute create <target> <identifier> \
  --title "Attribute Title" \
  --slug attribute_slug \
  --type text|number|select|status|... \
  [--description "..."] \
  [--required] \
  [--unique] \
  [--multiselect] \
  [--format json|table|csv]

# Update an attribute
attio attribute update <target> <identifier> <attribute-slug> \
  [--title "New Title"] \
  [--description "New description"] \
  [--required true|false] \
  [--unique true|false] \
  [--format json|table|csv]

# Note: Attributes cannot be deleted via API, only archived

# Examples:
attio attribute create objects people --title "Department" --slug department --type select
attio attribute update objects people department --title "Team" --required true
attio attribute update objects people department --description "Archived - no longer used"
```

**⚠️ Important**:
- Attributes **cannot be deleted** via the Attio API
- Status attributes can **only be created on lists and custom objects**, not built-in objects like "people"

#### Select Options Management

```bash
# List select options for an attribute
attio attribute options <target> <identifier> <attribute-slug> [--show-archived] [--format json|table|csv]

# Create a select option
attio attribute option-create <target> <identifier> <attribute-slug> \
  --title "Option Title" \
  [--format json|table|csv]

# Update a select option
attio attribute option-update <target> <identifier> <attribute-slug> <option-id> \
  [--title "New Title"] \
  [--archived true|false] \
  [--format json|table|csv]

# Archive a select option (recommended over delete)
attio attribute option-archive <target> <identifier> <attribute-slug> <option-id>

# Examples:
attio attribute options objects companies industry --format table
attio attribute option-create objects companies industry --title "Technology"
attio attribute option-update objects companies industry abc123 --title "Tech & SaaS"
attio attribute option-archive objects companies industry abc123
```

#### Status Management

```bash
# List statuses for a status attribute
attio attribute statuses <target> <identifier> <attribute-slug> [--show-archived] [--format json|table|csv]

# Create a status (on lists or custom objects only)
attio attribute status-create <target> <identifier> <attribute-slug> \
  --title "Status Title" \
  [--celebration] \
  [--format json|table|csv]

# Update a status
attio attribute status-update <target> <identifier> <attribute-slug> <status-id> \
  [--title "New Title"] \
  [--celebration true|false] \
  [--archived true|false] \
  [--format json|table|csv]

# Archive a status (recommended over delete)
attio attribute status-archive <target> <identifier> <attribute-slug> <status-id>

# Examples (note: use lists for status attributes):
attio attribute statuses lists my_pipeline deal_status --format table
attio attribute status-create lists my_pipeline deal_status --title "Qualified" --celebration
attio attribute status-update lists my_pipeline deal_status xyz789 --title "Qualified Lead"
attio attribute status-archive lists my_pipeline deal_status xyz789
```

### Lists

```bash
# List all lists
attio list list-all [--limit <n>] [--offset <n>] [--format json|table|csv]

# Get specific list
attio list get <list-slug> [--format json|table|csv]

# Create a list
attio list create \
  --api-slug list_slug \
  --name "List Name" \
  --parent-object people|companies|deals \
  [--workspace-access full-access|read-and-write|read-only] \
  [--format json|table|csv]

# Update a list
attio list update <list-slug> \
  [--name "New Name"] \
  [--workspace-access full-access|read-and-write|read-only] \
  [--format json|table|csv]

# List attributes for a list
attio list attributes <list-slug> [--format json|table|csv]

# List attributes WITH their possible values (convenience command)
attio list attributes-with-values <list-slug> [--show-archived] [--format json|table|csv]
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

### Get object attributes with all their possible values
```bash
# See all attributes and their select options/statuses in one command
attio object attributes-with-values companies --format json

# Export to CSV for documentation
attio list attributes-with-values my_sales_list --format csv > list-schema.csv
```

### Create a complete select attribute with options
```bash
# 1. Create the attribute
attio attribute create objects companies --title "Industry" --slug industry --type select

# 2. Add options
attio attribute option-create objects companies industry --title "Technology"
attio attribute option-create objects companies industry --title "Healthcare"
attio attribute option-create objects companies industry --title "Finance"

# 3. View the attribute with all options
attio attribute options objects companies industry --format table
```

### Create a status attribute for deal pipeline
```bash
# 1. Create the status attribute
attio attribute create objects deals --title "Deal Stage" --slug deal_stage --type status

# 2. Add statuses
attio attribute status-create objects deals deal_stage --title "Qualified"
attio attribute status-create objects deals deal_stage --title "In Progress"
attio attribute status-create objects deals deal_stage --title "Closed Won" --celebration

# 3. View all statuses
attio attribute statuses objects deals deal_stage --format table
```

### Manage list attributes
```bash
# Create a custom attribute for a list
attio attribute create lists my_projects --title "Priority" --slug priority --type select

# Add priority options
attio attribute option-create lists my_projects priority --title "High"
attio attribute option-create lists my_projects priority --title "Medium"
attio attribute option-create lists my_projects priority --title "Low"

# View list schema with all values
attio list attributes-with-values my_projects --format json
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
