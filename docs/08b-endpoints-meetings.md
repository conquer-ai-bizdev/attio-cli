# Meetings Endpoints

Meetings are calendar events that can be linked to records and include participants.

## List Meetings
**GET** `/v2/meetings`

**Scopes**: `meeting:read`, `record_permission:read`

**Query Parameters**:
- `limit`: Maximum results (1-200, default: 50)
- `cursor`: Pagination cursor for next page
- `linked_object`: Filter by object slug or ID
- `linked_record_id`: Filter by specific record UUID
- `participants`: Comma-separated email list for participant filtering
- `sort`: Sort order - `start_asc` or `start_desc` (default: start_asc)
- `ends_from`: Filter meetings ending after this timestamp
- `starts_before`: Filter meetings starting before this timestamp
- `timezone`: Timezone for all-day meeting filtering (default: UTC)

**Example**: `/v2/meetings?linked_object=people&starts_before=2024-12-31T23:59:59Z`

**Response**:
```json
{
  "data": [
    {
      "id": {
        "workspace_id": "uuid",
        "meeting_id": "uuid"
      },
      "title": "Sales Call",
      "description": "Quarterly review",
      "is_all_day": false,
      "start": {
        "datetime": "2024-02-15T14:00:00Z",
        "timezone": "America/New_York"
      },
      "end": {
        "datetime": "2024-02-15T15:00:00Z",
        "timezone": "America/New_York"
      },
      "participants": [
        {
          "email_address": "john@example.com",
          "status": "accepted",
          "is_organizer": true
        }
      ],
      "linked_records": [
        {
          "object_slug": "people",
          "object_id": "uuid",
          "record_id": "uuid"
        }
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "created_by_actor": {
        "type": "workspace-member",
        "id": "uuid"
      }
    }
  ],
  "pagination": {
    "next_cursor": "cursor-value"
  }
}
```

## Get Meeting
**GET** `/v2/meetings/{meeting_id}`

**Scopes**: `meeting:read`, `record_permission:read`

**Parameters**:
- `meeting_id`: Meeting UUID

**Response**: Single meeting object

## Meeting Time Formats

### DateTime with Timezone
```json
{
  "datetime": "2024-02-15T14:00:00Z",
  "timezone": "America/New_York"
}
```

### All-Day Event
```json
{
  "date": "2024-02-15"
}
```

## Participant Status

Possible values:
- `accepted`: Participant accepted
- `declined`: Participant declined
- `tentative`: Participant tentatively accepted
- `needs-action`: No response yet

## Pagination

Meetings use cursor-based pagination:

1. First request: `/v2/meetings?limit=50`
2. Get `next_cursor` from response
3. Next request: `/v2/meetings?limit=50&cursor=<next_cursor>`
4. Continue until `next_cursor` is null
