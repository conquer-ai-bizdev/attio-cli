# Lists & List Entries Endpoints

Lists model specific processes and contain entries referencing records.

## Lists

### List All Lists
**GET** `/v2/lists`

**Scopes**: `list_configuration:read`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "list_id": "uuid"
      },
      "api_slug": "my_list",
      "name": "My List",
      "parent_object": "people",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get List
**GET** `/v2/lists/{list}`

**Scopes**: `list_configuration:read`

**Parameters**:
- `list`: List ID or slug

**Response**: Single list definition

### Create List
**POST** `/v2/lists`

**Scopes**: `list_configuration:read-write`

**Request Body**:
```json
{
  "api_slug": "my_list",
  "name": "My List",
  "parent_object": "people",
  "workspace_access": "full-access"
}
```

### Update List
**PATCH** `/v2/lists/{list}`

**Scopes**: `list_configuration:read-write`

**Request Body**: Fields to update

## List Entries

List entries are elements within a list that reference a parent record and contain list-specific attribute values.

### Query List Entries
**GET** `/v2/lists/{list}/entries`

**Scopes**: `list_entry:read`

**Parameters**:
- `list`: List ID or slug
- `limit`: Maximum results (optional)
- `offset`: Skip results (optional)

**Request Body** (optional, for filters):
```json
{
  "filter": {
    "parent_record": {"$not_empty": true}
  },
  "sorts": [
    {"attribute": "created_at", "direction": "desc"}
  ],
  "limit": 20,
  "offset": 0
}
```

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "list_id": "uuid",
        "entry_id": "uuid"
      },
      "parent_record_id": "uuid",
      "parent_object": "people",
      "values": {
        "status": [{"value": "active"}],
        "custom_field": [{"value": "example"}]
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create List Entry
**POST** `/v2/lists/{list}/entries`

**Scopes**: `list_entry:read-write`

**Description**: Adds a record to the list as a new entry

**Request Body**:
```json
{
  "parent_record_id": "uuid",
  "data": {
    "status": "active",
    "custom_field": "value"
  }
}
```

**Response**: Created entry object

### Get List Entry
**GET** `/v2/lists/{list}/entries/{entry}`

**Scopes**: `list_entry:read`

**Parameters**:
- `list`: List ID or slug
- `entry`: Entry ID

**Response**: Single entry object

### Update List Entry
**PATCH** `/v2/lists/{list}/entries/{entry}`

**Scopes**: `list_entry:read-write`

**Description**: Updates attributes on the list entry

**Request Body**:
```json
{
  "data": {
    "status": "completed",
    "custom_field": null
  }
}
```

**Response**: Updated entry object

### Delete List Entry
**DELETE** `/v2/lists/{list}/entries/{entry}`

**Scopes**: `list_entry:read-write`

**Description**: Removes entry from list (doesn't delete the parent record)

**Response**: Empty object `{}`

### Assert List Entry
**PUT** `/v2/lists/{list}/entries`

**Scopes**: `list_entry:read-write`, `list_configuration:read`

**Description**: Creates entry if it doesn't exist, or returns existing entry

**Request Body**:
```json
{
  "data": {
    "parent_record_id": "uuid",
    "parent_object": "people",
    "entry_values": {
      "status": "active",
      "custom_field": "value"
    }
  }
}
```

**Response**: Entry object (created or existing)

### Update List Entry - Append Multiselect Values
**PATCH** `/v2/lists/{list}/entries/{entry_id}`

**Scopes**: `list_entry:read-write`, `list_configuration:read`

**Description**: Appends values to multiselect attributes (prepends to front of existing values)

**Request Body**:
```json
{
  "data": {
    "entry_values": {
      "multiselect_attribute": ["new_value_1", "new_value_2"]
    }
  }
}
```

**Note**: PATCH appends values, PUT overwrites all values

**Response**: Updated entry object

### List Attribute Values for Entry
**GET** `/v2/lists/{list}/entries/{entry_id}/attributes/{attribute}/values`

**Scopes**: `list_entry:read`, `list_configuration:read`

**Query Parameters**:
- `show_historic`: Return all historic values if true (default: false)
- `limit`: Maximum results
- `offset`: Skip results

**Response**:
```json
{
  "data": [
    {
      "value": "example",
      "active_from": "2024-01-01T00:00:00Z",
      "active_until": null,
      "created_by_actor": {
        "type": "workspace-member",
        "id": "uuid"
      },
      "attribute_type": "text"
    }
  ]
}
```

## Working with List Entries

### Adding Records to Lists
1. Create the record (if it doesn't exist)
2. Create a list entry with the record's ID
3. Alternatively, use assert endpoint to create or get existing

### Adding Attributes to List Entries
1. Define attributes on the list (not the object)
2. Set values when creating/updating entries

### Multiselect Attributes
- **PATCH** (append): Adds new values to front of existing values
- **PUT** (overwrite): Replaces all values completely
