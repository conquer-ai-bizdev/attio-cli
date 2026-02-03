# Tasks Endpoints

Tasks are to-do items that can be linked to records and assigned to workspace members.

## List Tasks
**GET** `/v2/tasks`

**Scopes**: `task:read`, `object_configuration:read`, `record_permission:read`, `user_management:read`

**Query Parameters**:
- `limit`: Maximum results (default: 500)
- `offset`: Skip results (default: 0)
- `sort`: Sort by `created_at:asc` or `created_at:desc` (default: asc)
- `linked_object`: Filter by object type (e.g., "people", "companies")
- `linked_record_id`: Filter by specific record UUID
- `assignee`: Filter by workspace member email or ID
- `is_completed`: Filter by completion status (boolean)

**Example**: `/v2/tasks?linked_object=people&is_completed=false`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "task_id": "uuid"
      },
      "content_plaintext": "Follow up with John",
      "deadline_at": "2024-02-15T00:00:00Z",
      "is_completed": false,
      "linked_records": [
        {
          "target_object": "people",
          "target_record_id": "uuid"
        }
      ],
      "assignees": [
        {
          "referenced_actor_type": "workspace-member",
          "referenced_actor_id": "uuid"
        }
      ],
      "created_by_actor": {
        "type": "workspace-member",
        "id": "uuid"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Create Task
**POST** `/v2/tasks`

**Scopes**: `task:read-write`, `object_configuration:read`, `record_permission:read`, `user_management:read`

**Request Body**:
```json
{
  "data": {
    "content": "Follow up with John",
    "format": "plaintext",
    "deadline_at": "2024-02-15T00:00:00Z",
    "is_completed": false,
    "linked_records": [
      {
        "target_record_id": "uuid"
      }
    ],
    "assignees": [
      {
        "referenced_actor_id": "uuid"
      }
    ]
  }
}
```

**Required Fields**:
- `content`: Text content (max 2000 characters)
- `format`: Must be `plaintext`
- `deadline_at`: ISO 8601 timestamp or null
- `is_completed`: Boolean completion status
- `linked_records`: Array of linked record references
- `assignees`: Array of workspace member references (by actor ID or email)

**Response**: Created task object

## Get Task
**GET** `/v2/tasks/{task_id}`

**Scopes**: `task:read`, `object_configuration:read`, `record_permission:read`, `user_management:read`

**Parameters**:
- `task_id`: Task UUID

**Response**: Single task object

## Update Task
**PATCH** `/v2/tasks/{task_id}`

**Scopes**: `task:read-write`, `object_configuration:read`, `record_permission:read`, `user_management:read`

**Request Body**:
```json
{
  "data": {
    "deadline_at": "2024-03-01T00:00:00Z",
    "is_completed": true,
    "linked_records": [
      {
        "target_record_id": "uuid"
      }
    ],
    "assignees": [
      {
        "referenced_actor_id": "uuid"
      }
    ]
  }
}
```

**Response**: Updated task object

## Delete Task
**DELETE** `/v2/tasks/{task_id}`

**Scopes**: `task:read-write`

**Response**: Empty object `{}`

## Linked Records

Tasks can reference records in two ways:

### By ID
```json
{
  "target_record_id": "uuid"
}
```

### By Matching Attribute
```json
{
  "target_object": "people",
  "target_record_matching_attribute": "email_addresses",
  "target_record_query_value": "john@example.com"
}
```

## Assignees

Workspace members can be assigned in two ways:

### By Actor ID
```json
{
  "referenced_actor_id": "uuid"
}
```

### By Email
```json
{
  "referenced_actor_type": "workspace-member",
  "email_address": "user@example.com"
}
```
