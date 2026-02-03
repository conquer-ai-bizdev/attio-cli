# People Records Endpoints

People are individual contacts in your CRM. This is a standard object in Attio.

## List People Records
**POST** `/v2/objects/people/records/query`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Request Body**:
```json
{
  "filter": {
    "email_addresses": {
      "email_address": {"$contains": "@example.com"}
    }
  },
  "sorts": [
    {
      "attribute": "name",
      "field": "last_name",
      "direction": "asc"
    }
  ],
  "limit": 500,
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
        "object_id": "uuid",
        "record_id": "uuid"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "web_url": "https://app.attio.com/...",
      "values": {
        "name": [
          {
            "value": {
              "first_name": "John",
              "last_name": "Doe",
              "full_name": "John Doe"
            },
            "active_from": "2024-01-01T00:00:00Z",
            "active_until": null,
            "created_by_actor": {
              "type": "workspace-member",
              "id": "uuid"
            },
            "attribute_type": "personal-name"
          }
        ],
        "email_addresses": [
          {
            "value": {
              "email_address": "john@example.com",
              "email_domain": "example.com"
            },
            "active_from": "2024-01-01T00:00:00Z",
            "active_until": null,
            "created_by_actor": {
              "type": "workspace-member",
              "id": "uuid"
            },
            "attribute_type": "email-address"
          }
        ]
      }
    }
  ]
}
```

## Assert Person Record
**PUT** `/v2/objects/people/records`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Query Parameters**:
- `matching_attribute`: Attribute slug/ID to match on (required)
  - For people, `email_addresses` is the only unique standard attribute

**Request Body**:
```json
{
  "data": {
    "values": {
      "email_addresses": [
        {"email_address": "john@example.com"}
      ],
      "name": [
        {
          "first_name": "John",
          "last_name": "Doe"
        }
      ],
      "phone_numbers": [
        {
          "original_phone_number": "+1234567890",
          "country_code": "US"
        }
      ],
      "primary_location": [
        {
          "line_1": "123 Main St",
          "locality": "San Francisco",
          "region": "CA",
          "postcode": "94105",
          "country_code": "US"
        }
      ],
      "job_title": [
        {"value": "Software Engineer"}
      ]
    }
  }
}
```

**Response**: Person record object (created or existing)

## Create Person Record
**POST** `/v2/objects/people/records`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Request Body**: Same as assert (without matching_attribute parameter)

**Response**: Created person record

## Get Person Record
**GET** `/v2/objects/people/records/{record_id}`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Parameters**:
- `record_id`: Person record UUID

**Response**: Single person record object

## Update Person Record
**PATCH** `/v2/objects/people/records/{record_id}`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Request Body**:
```json
{
  "data": {
    "values": {
      "email_addresses": [
        {"email_address": "newemail@example.com"}
      ],
      "phone_numbers": null
    }
  }
}
```

**Note**: Set attribute to `null` to clear its value

**Response**: Updated person record

## Delete Person Record
**DELETE** `/v2/objects/people/records/{record_id}`

**Scopes**: `record_permission:read-write`

**Response**: Empty object `{}`

## List Person Record Attribute Values
**GET** `/v2/objects/people/records/{record_id}/attributes/{attribute}/values`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Query Parameters**:
- `show_historic`: Return all historic values if true (default: false)
- `limit`: Maximum results
- `offset`: Skip results

**Response**: Array of attribute value objects with history

## List Person Record Entries
**GET** `/v2/objects/people/records/{record_id}/entries`

**Scopes**: `record_permission:read`, `object_configuration:read`, `list_entry:read`

**Query Parameters**:
- `limit`: Maximum results (default: 100, max: 1000)
- `offset`: Skip results (default: 0)

**Description**: Lists all list entries for this person record across all lists

**Response**:
```json
{
  "data": [
    {
      "list_id": "uuid",
      "list_api_slug": "sales_pipeline",
      "entry_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Standard Person Attributes

- `name` (personal-name): First name, last name, full name
- `email_addresses` (email-address, multiselect): Email addresses
- `phone_numbers` (phone-number, multiselect): Phone numbers
- `websites` (domain, multiselect): Personal websites
- `primary_location` (location): Address information
- `job_title` (text): Current job title
- `description` (text): Notes/description
- `avatar_url` (text): Profile picture URL
- `linkedin` (text): LinkedIn profile URL
- `twitter` (text): Twitter handle
- `facebook` (text): Facebook profile URL
- `instagram` (text): Instagram handle
- `company` (record-reference): Associated company record
