# Attio CLI Specification

## Overview
A fully-typed TypeScript CLI for managing Attio via its REST API, optimized for both human and agent use.

## Configuration

### Environment Variables
```bash
ATTIO_API_KEY=your_api_key_here
```

## Global Options

All commands support:
- `--api-key <key>`: Override API key (default: $ATTIO_API_KEY)
- `--format <json|table|csv>`: Output format (default: json)
- `--help`: Show help for command
- `--version`: Show CLI version

## Command Structure

```
attio <resource> <action> [options]
```

## Resources

### 1. Workspaces (`attio workspace`)

#### `attio workspace members list`
List all workspace members

**Options**:
- `--limit <number>`: Maximum results
- `--format <json|table>`: Output format

**Output**: List of workspace members with id, name, email, access_level

#### `attio workspace members get <member_id>`
Get specific workspace member

**Arguments**:
- `member_id`: Workspace member UUID

**Output**: Full workspace member details

---

### 2. Objects (`attio object`)

#### `attio object list`
List all objects in workspace

**Options**:
- `--format <json|table>`: Output format

**Output**: List of objects with slug, name (singular/plural)

#### `attio object get <object>`
Get object definition

**Arguments**:
- `object`: Object ID or slug (e.g., `people`, `companies`, `deals`)

**Output**: Full object definition

#### `attio object create`
Create custom object

**Options**:
- `--slug <string>`: API slug (required)
- `--singular <string>`: Singular noun (required)
- `--plural <string>`: Plural noun (required)

**Output**: Created object

---

### 3. Attributes (`attio attribute`)

#### `attio attribute list <target> <identifier>`
List attributes on object or list

**Arguments**:
- `target`: Either `object` or `list`
- `identifier`: Object/list ID or slug

**Example**: `attio attribute list object people`

**Output**: List of attributes with slug, title, type, required, unique

#### `attio attribute get <target> <identifier> <attribute>`
Get specific attribute

**Arguments**:
- `target`: Either `object` or `list`
- `identifier`: Object/list ID or slug
- `attribute`: Attribute ID or slug

**Output**: Full attribute definition

#### `attio attribute create <target> <identifier>`
Create attribute

**Arguments**:
- `target`: Either `object` or `list`
- `identifier`: Object/list ID or slug

**Options**:
- `--slug <string>`: API slug (required)
- `--title <string>`: Display title (required)
- `--type <string>`: Attribute type (required)
- `--required`: Make field required
- `--unique`: Enforce uniqueness
- `--multiselect`: Allow multiple values

**Output**: Created attribute

#### `attio attribute options list <target> <identifier> <attribute>`
List select/status options for attribute

**Arguments**:
- `target`: Either `object` or `list`
- `identifier`: Object/list ID or slug
- `attribute`: Attribute ID or slug

**Output**: List of options

---

### 4. Records (`attio record`)

#### `attio record list <object>`
List records

**Arguments**:
- `object`: Object ID or slug (e.g., `people`, `companies`, `deals`)

**Options**:
- `--limit <number>`: Maximum results
- `--offset <number>`: Skip results
- `--filter <json>`: Filter conditions as JSON string
- `--sort <attribute:direction>`: Sort by attribute (e.g., `name:asc`)

**Example**:
```bash
attio record list people --limit 10 --filter '{"email_addresses": {"$not_empty": true}}'
```

**Output**: List of records

#### `attio record get <object> <record_id>`
Get specific record

**Arguments**:
- `object`: Object ID or slug
- `record_id`: Record UUID

**Output**: Full record with all attributes

#### `attio record create <object>`
Create record

**Arguments**:
- `object`: Object ID or slug

**Options**:
- `--data <json>`: Record data as JSON string (required)
- `--file <path>`: Load data from JSON file

**Example**:
```bash
attio record create people --data '{"name": {"first_name": "John", "last_name": "Doe"}, "email_addresses": [{"email_address": "john@example.com"}]}'
```

**Output**: Created record

#### `attio record update <object> <record_id>`
Update record

**Arguments**:
- `object`: Object ID or slug
- `record_id`: Record UUID

**Options**:
- `--data <json>`: Update data as JSON string (required)
- `--file <path>`: Load data from JSON file

**Output**: Updated record

#### `attio record assert <object>`
Create or get existing record

**Arguments**:
- `object`: Object ID or slug

**Options**:
- `--matching-attribute <slug>`: Attribute to match on (required)
- `--data <json>`: Record data as JSON string (required)
- `--file <path>`: Load data from JSON file

**Output**: Record (created or existing)

---

### 5. Lists (`attio list`)

#### `attio list list`
List all lists

**Options**:
- `--format <json|table>`: Output format

**Output**: List of lists with slug, name, parent_object

#### `attio list get <list>`
Get list definition

**Arguments**:
- `list`: List ID or slug

**Output**: Full list definition

#### `attio list create`
Create list

**Options**:
- `--slug <string>`: API slug (required)
- `--name <string>`: Display name (required)
- `--parent-object <string>`: Parent object slug (required)
- `--workspace-access <string>`: Access level (default: full-access)

**Output**: Created list

---

### 6. List Entries (`attio entry`)

#### `attio entry list <list>`
Query list entries

**Arguments**:
- `list`: List ID or slug

**Options**:
- `--limit <number>`: Maximum results
- `--offset <number>`: Skip results
- `--filter <json>`: Filter conditions as JSON string
- `--sort <attribute:direction>`: Sort by attribute

**Output**: List of entries

#### `attio entry get <list> <entry_id>`
Get specific entry

**Arguments**:
- `list`: List ID or slug
- `entry_id`: Entry UUID

**Output**: Full entry with all attributes

#### `attio entry create <list>`
Add record to list

**Arguments**:
- `list`: List ID or slug

**Options**:
- `--record-id <uuid>`: Parent record ID (required)
- `--data <json>`: Entry attribute values as JSON string
- `--file <path>`: Load data from JSON file

**Example**:
```bash
attio entry create my_list --record-id abc-123 --data '{"status": "active"}'
```

**Output**: Created entry

#### `attio entry update <list> <entry_id>`
Update entry attributes

**Arguments**:
- `list`: List ID or slug
- `entry_id`: Entry UUID

**Options**:
- `--data <json>`: Update data as JSON string (required)
- `--file <path>`: Load data from JSON file

**Output**: Updated entry

#### `attio entry delete <list> <entry_id>`
Remove entry from list

**Arguments**:
- `list`: List ID or slug
- `entry_id`: Entry UUID

**Output**: Success message

---

### 7. Notes (`attio note`)

#### `attio note list`
List notes

**Options**:
- `--limit <number>`: Maximum results (default: 10, max: 50)
- `--offset <number>`: Skip results
- `--parent-object <string>`: Filter by object slug
- `--parent-record-id <uuid>`: Filter by record ID

**Output**: List of notes

#### `attio note get <note_id>`
Get specific note

**Arguments**:
- `note_id`: Note UUID

**Output**: Full note with content

#### `attio note create`
Create note

**Options**:
- `--parent-object <string>`: Object ID or slug (required)
- `--parent-record-id <uuid>`: Record UUID (required)
- `--title <string>`: Note title (required)
- `--format <plaintext|markdown>`: Content format (required)
- `--content <string>`: Note content (required)
- `--file <path>`: Load content from file
- `--meeting-id <uuid>`: Associated meeting ID

**Example**:
```bash
attio note create --parent-object people --parent-record-id abc-123 --title "Meeting" --format markdown --content "## Notes\n- Point 1"
```

**Output**: Created note

#### `attio note update <note_id>`
Update note

**Arguments**:
- `note_id`: Note UUID

**Options**:
- `--title <string>`: Update title
- `--format <plaintext|markdown>`: Content format
- `--content <string>`: Update content
- `--file <path>`: Load content from file

**Output**: Updated note

#### `attio note delete <note_id>`
Delete note

**Arguments**:
- `note_id`: Note UUID

**Output**: Success message

---

### 8. Tasks (`attio task`)

#### `attio task list`
List tasks

**Options**:
- `--limit <number>`: Maximum results (default: 500)
- `--offset <number>`: Skip results
- `--sort <created_at:asc|created_at:desc>`: Sort order (default: created_at:asc)
- `--linked-object <string>`: Filter by object type (e.g., people, companies)
- `--linked-record-id <uuid>`: Filter by specific record ID
- `--assignee <string>`: Filter by workspace member email or ID
- `--completed <boolean>`: Filter by completion status (true/false)

**Example**:
```bash
attio task list --linked-object people --completed false --assignee user@example.com
```

**Output**: List of tasks

#### `attio task get <task_id>`
Get specific task

**Arguments**:
- `task_id`: Task UUID

**Output**: Full task details

#### `attio task create`
Create task

**Options**:
- `--content <string>`: Task content (required, max 2000 chars)
- `--deadline <iso-date>`: Deadline in ISO 8601 format
- `--completed <boolean>`: Completion status (default: false)
- `--linked-record-id <uuid>`: Link to record (required)
- `--assignee <string>`: Workspace member email or ID (can be repeated)

**Example**:
```bash
attio task create --content "Follow up on proposal" --deadline 2024-12-31T23:59:59Z --linked-record-id abc-123 --assignee user@example.com
```

**Output**: Created task

#### `attio task update <task_id>`
Update task

**Arguments**:
- `task_id`: Task UUID

**Options**:
- `--deadline <iso-date>`: Update deadline
- `--completed <boolean>`: Update completion status
- `--assignee <string>`: Update assignees (replaces all)

**Output**: Updated task

#### `attio task delete <task_id>`
Delete task

**Arguments**:
- `task_id`: Task UUID

**Output**: Success message

---

### 9. Meetings (`attio meeting`)

#### `attio meeting list`
List meetings

**Options**:
- `--limit <number>`: Maximum results (1-200, default: 50)
- `--cursor <string>`: Pagination cursor
- `--linked-object <string>`: Filter by object slug or ID
- `--linked-record-id <uuid>`: Filter by specific record ID
- `--participants <emails>`: Comma-separated participant emails
- `--sort <start_asc|start_desc>`: Sort order (default: start_asc)
- `--ends-from <iso-date>`: Filter meetings ending after timestamp
- `--starts-before <iso-date>`: Filter meetings starting before timestamp
- `--timezone <tz>`: Timezone for all-day meetings (default: UTC)

**Example**:
```bash
attio meeting list --linked-object people --starts-before 2024-12-31T23:59:59Z --sort start_desc
```

**Output**: List of meetings with pagination cursor

#### `attio meeting get <meeting_id>`
Get specific meeting

**Arguments**:
- `meeting_id`: Meeting UUID

**Output**: Full meeting details including participants and linked records

---

## Help System

### Command Help
Every command supports `--help`:
```bash
attio --help
attio record --help
attio record create --help
```

### Help Output Format
```
Usage: attio record create <object> [options]

Create a new record in the specified object

Arguments:
  object                Object ID or slug (e.g., people, companies, deals)

Options:
  --data <json>        Record data as JSON string (required unless --file)
  --file <path>        Load record data from JSON file
  --api-key <key>      Override API key (default: $ATTIO_API_KEY)
  --format <format>    Output format: json, table, csv (default: json)
  -h, --help          Display help for command

Examples:
  attio record create people --data '{"name": {"first_name": "John"}}'
  attio record create companies --file ./company.json

For more information, visit: https://docs.attio.com
```

## Error Handling

### Error Output Format
```json
{
  "error": true,
  "status_code": 400,
  "type": "validation_error",
  "code": "invalid_request",
  "message": "Description of the error"
}
```

### Exit Codes
- `0`: Success
- `1`: General error
- `2`: Invalid arguments
- `3`: Authentication error
- `4`: Rate limit exceeded
- `5`: Resource not found

## Agent-Friendly Features

1. **JSON Output**: Default JSON output for easy parsing
2. **Predictable Structure**: Consistent response format
3. **Explicit IDs**: Always return full IDs for created resources
4. **Stdin Support**: Commands accept JSON from stdin using `--file -`
5. **Exit Codes**: Clear exit codes for programmatic error handling
6. **No Interactive Prompts**: All required data via options/arguments

## Examples

### Create person with email
```bash
attio record create people --data '{
  "name": {"first_name": "John", "last_name": "Doe"},
  "email_addresses": [{"email_address": "john@example.com"}]
}'
```

### Query people with filter
```bash
attio record list people \
  --filter '{"email_addresses": {"email_address": {"$contains": "@example.com"}}}' \
  --limit 50
```

### Add person to list
```bash
# First get the person record ID
RECORD_ID=$(attio record list people --filter '{"email_addresses": {"email_address": {"$eq": "john@example.com"}}}' | jq -r '.data[0].id.record_id')

# Then add to list
attio entry create my_list --record-id $RECORD_ID --data '{"status": "active"}'
```

### Create note for record
```bash
attio note create \
  --parent-object people \
  --parent-record-id abc-123 \
  --title "Call Notes" \
  --format markdown \
  --content "## Discussion\n- Discussed pricing\n- Follow up next week"
```
