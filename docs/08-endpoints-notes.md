# Notes Endpoints

Notes are rich text documents that reference a single parent record.

## List Notes
**GET** `/v2/notes`

**Scopes**: `note:read`, `object_configuration:read`, `record_permission:read`

**Parameters**:
- `limit`: Maximum results (default: 10, max: 50)
- `offset`: Results to skip (default: 0)
- `parent_object`: Object slug or ID (optional)
- `parent_record_id`: Specific record UUID (optional)

**Example**: `/v2/notes?parent_object=people&parent_record_id=uuid`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "note_id": "uuid"
      },
      "parent_object": "people",
      "parent_record_id": "uuid",
      "title": "Meeting Notes",
      "meeting_id": null,
      "content_plaintext": "Discussion points...",
      "content_markdown": "## Discussion points\n- Point 1\n- Point 2",
      "tags": [],
      "created_by_actor": {
        "type": "workspace-member",
        "id": "uuid"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Create Note
**POST** `/v2/notes`

**Scopes**: `note:read-write`, `object_configuration:read`, `record_permission:read`

**Request Body**:
```json
{
  "data": {
    "parent_object": "people",
    "parent_record_id": "uuid",
    "title": "Meeting Notes",
    "format": "markdown",
    "content": "## Discussion\n- Point 1\n- Point 2",
    "meeting_id": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Required Fields**:
- `parent_object`: Object ID or slug
- `parent_record_id`: Record UUID
- `title`: Plaintext title (no formatting)
- `format`: Either `plaintext` or `markdown`
- `content`: Note content in specified format

**Optional Fields**:
- `meeting_id`: UUID or null
- `created_at`: ISO 8601 timestamp (defaults to current time)

**Response**: Created note object

## Get Note
**GET** `/v2/notes/{note_id}`

**Scopes**: `note:read`, `object_configuration:read`, `record_permission:read`

**Parameters**:
- `note_id`: UUID of the note

**Response**: Single note object

## Update Note
**PATCH** `/v2/notes/{note_id}`

**Scopes**: `note:read-write`, `object_configuration:read`, `record_permission:read`

**Request Body**:
```json
{
  "data": {
    "title": "Updated Title",
    "format": "markdown",
    "content": "Updated content"
  }
}
```

**Response**: Updated note object

## Delete Note
**DELETE** `/v2/notes/{note_id}`

**Scopes**: `note:read-write`

**Response**: Empty object `{}`

## Note Content

### Plaintext Format
- Use `\n` for line breaks
- No formatting supported

### Markdown Format
Supported features:
- Headings (levels 1-3 only): `#`, `##`, `###`
- Unordered lists: `- item`
- Ordered lists: `1. item`
- Text styling:
  - Bold: `**text**`
  - Italic: `*text*`
  - Strikethrough: `~~text~~`
  - Highlighting: `==text==`
- Links: `[text](url)`

### Tags
- `tags` array contains workspace members or records mentioned with @
- Automatically populated based on @-mentions in content
