# Objects & Attributes Endpoints

## Objects

Objects are the data types used to store information (people, companies, deals, etc.)

### List Objects
**GET** `/v2/objects`

**Scopes**: `object_configuration:read`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "object_id": "uuid"
      },
      "api_slug": "people",
      "singular_noun": "Person",
      "plural_noun": "People",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Object
**GET** `/v2/objects/{object}`

**Scopes**: `object_configuration:read`

**Parameters**:
- `object`: Object ID or slug (e.g., `people`, `companies`, `deals`)

**Response**: Single object definition

### Create Object
**POST** `/v2/objects`

**Scopes**: `object_configuration:read-write`

**Request Body**:
```json
{
  "api_slug": "my_object",
  "singular_noun": "My Object",
  "plural_noun": "My Objects"
}
```

### Update Object
**PATCH** `/v2/objects/{object}`

**Scopes**: `object_configuration:read-write`

**Request Body**: Fields to update

## Attributes

Attributes define the data fields on objects and lists.

### List Attributes
**GET** `/v2/{target}/{identifier}/attributes`

**Scopes**: `object_configuration:read` or `list_configuration:read`

**Parameters**:
- `target`: Either `objects` or `lists`
- `identifier`: Object/list ID or slug

**Example**: `/v2/objects/people/attributes`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "attribute_id": "uuid"
      },
      "api_slug": "name",
      "title": "Name",
      "type": "personal-name",
      "is_required": true,
      "is_unique": false,
      "is_multiselect": false
    }
  ]
}
```

### Get Attribute
**GET** `/v2/{target}/{identifier}/attributes/{attribute}`

**Scopes**: `object_configuration:read` or `list_configuration:read`

**Response**: Single attribute definition

### Create Attribute
**POST** `/v2/{target}/{identifier}/attributes`

**Scopes**: `object_configuration:read-write` or `list_configuration:read-write`

**Request Body**:
```json
{
  "api_slug": "custom_field",
  "title": "Custom Field",
  "type": "text",
  "is_required": false
}
```

### Update Attribute
**PATCH** `/v2/{target}/{identifier}/attributes/{attribute}`

**Scopes**: `object_configuration:read-write` or `list_configuration:read-write`

**Request Body**: Fields to update

### List Select Options
**GET** `/v2/{target}/{identifier}/attributes/{attribute}/options`

**Scopes**: `object_configuration:read` or `list_configuration:read`

**Response**: List of select/status options for the attribute

### Create Select Option
**POST** `/v2/{target}/{identifier}/attributes/{attribute}/options`

**Scopes**: `object_configuration:read-write` or `list_configuration:read-write`

**Request Body**:
```json
{
  "title": "Option Name",
  "color": "blue"
}
```

### Update Select Option
**PATCH** `/v2/{target}/{identifier}/attributes/{attribute}/options/{option}`

**Scopes**: `object_configuration:read-write` or `list_configuration:read-write`

**Request Body**: Fields to update

### List Statuses
**GET** `/v2/{target}/{identifier}/attributes/{attribute}/statuses`

**Scopes**: `object_configuration:read`

**Description**: List status options for a status-type attribute

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "object_id": "uuid",
        "attribute_id": "uuid",
        "status_id": "uuid"
      },
      "title": "In Progress",
      "is_archived": false,
      "celebration_enabled": false,
      "target_time_in_status": "P7D"
    }
  ]
}
```

### Create Status
**POST** `/v2/{target}/{identifier}/attributes/{attribute}/statuses`

**Scopes**: `object_configuration:read-write`

**Request Body**:
```json
{
  "data": {
    "title": "In Progress",
    "celebration_enabled": false,
    "target_time_in_status": "P7D"
  }
}
```

**Fields**:
- `title`: Status name (required, min 1 char)
- `celebration_enabled`: Enable celebration animation (optional, default: false)
- `target_time_in_status`: ISO-8601 duration or null (optional)

**Response**: Created status object

### Update Status
**PATCH** `/v2/{target}/{identifier}/attributes/{attribute}/statuses/{status}`

**Scopes**: `object_configuration:read-write`

**Request Body**:
```json
{
  "data": {
    "title": "Updated Status",
    "celebration_enabled": true,
    "target_time_in_status": "P14D",
    "is_archived": false
  }
}
```

**Response**: Updated status object

## Attribute Types

- `text`, `number`, `checkbox`, `currency`
- `date`, `timestamp`
- `status`, `select`, `rating`
- `record-reference`, `actor-reference`
- `location`, `domain`, `email-address`, `phone-number`
- `interaction`, `personal-name`

## ISO-8601 Duration Format

Used for `target_time_in_status`:
- `P7D`: 7 days
- `P1M`: 1 month
- `PT2H`: 2 hours
- `P1Y6M`: 1 year and 6 months
