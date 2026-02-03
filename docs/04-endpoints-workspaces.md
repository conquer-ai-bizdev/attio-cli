# Workspace & User Endpoints

## Workspace Members

Workspace members represent users with access to a workspace.

### List Workspace Members
**GET** `/v2/workspace_members`

**Scopes**: `user_management:read`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "workspace_member_id": "uuid"
      },
      "first_name": "John",
      "last_name": "Doe",
      "email_address": "john@example.com",
      "avatar_url": "https://..." | null,
      "access_level": "admin",
      "created_at": "2024-01-01T00:00:00.000000000Z"
    }
  ]
}
```

**Access Levels**: `admin`, `member`, `suspended`

**Note**: `avatar_url` can be `null` if no avatar is set. Timestamps include nanosecond precision.

### Get Workspace Member
**GET** `/v2/workspace_members/{workspace_member}`

**Scopes**: `user_management:read`

**Parameters**:
- `workspace_member`: UUID or identifier

**Response**: Single workspace member object

### Update Workspace Member
**PATCH** `/v2/workspace_members/{workspace_member}`

**Scopes**: `user_management:read-write`

**Request Body**:
```json
{
  "access_level": "admin"
}
```

**Response**: Updated workspace member object
