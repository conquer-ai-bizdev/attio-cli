# Records Endpoints

Records are individual instances of objects (e.g., a specific person, company, or deal).

## List Records
**GET** `/v2/objects/{object}/records`

**Scopes**: `record_permission:read`

**Parameters**:
- `object`: Object ID or slug (e.g., `people`, `companies`, `deals`)
- `limit`: Maximum results to return (optional)
- `offset`: Number of results to skip (optional)
- `filter`: Filter conditions (optional, JSON)

**Example**: `/v2/objects/people/records?limit=20`

**Request Body** (for POST with filters):
```json
{
  "filter": {
    "email_addresses": {"email_address": {"$contains": "@example.com"}}
  },
  "sorts": [
    {"attribute": "name", "direction": "asc"}
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
        "object_id": "uuid",
        "record_id": "uuid"
      },
      "values": {
        "name": [{"value": {"first_name": "John", "last_name": "Doe"}}],
        "email_addresses": [{"value": {"email_address": "john@example.com"}}]
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Create Record
**POST** `/v2/objects/{object}/records`

**Scopes**: `record_permission:read-write`

**Request Body**:
```json
{
  "data": {
    "name": {"first_name": "John", "last_name": "Doe"},
    "email_addresses": [{"email_address": "john@example.com"}],
    "phone_numbers": [{"phone_number": "+1234567890"}]
  }
}
```

**Response**: Created record object with ID and timestamps

## Get Record
**GET** `/v2/objects/{object}/records/{record_id}`

**Scopes**: `record_permission:read`

**Parameters**:
- `object`: Object ID or slug
- `record_id`: UUID of the record

**Response**: Single record object with all attributes

## Update Record
**PATCH** `/v2/objects/{object}/records/{record_id}`

**Scopes**: `record_permission:read-write`

**Request Body**:
```json
{
  "data": {
    "email_addresses": [{"email_address": "newemail@example.com"}],
    "phone_numbers": null
  }
}
```

**Note**: Set attribute to `null` to clear its value

**Response**: Updated record object

## Assert Record
**POST** `/v2/objects/{object}/records:assert`

**Scopes**: `record_permission:read-write`

**Description**: Creates a new record or returns existing record based on matching attribute

**Parameters**:
- `matching_attribute`: Attribute slug/ID to match on

**Request Body**:
```json
{
  "data": {
    "email_addresses": [{"email_address": "john@example.com"}],
    "name": {"first_name": "John", "last_name": "Doe"}
  }
}
```

**Response**: Record object (newly created or existing match)

## Standard Objects

### People
**Base Path**: `/v2/objects/people/records`

**System Attributes**:
- `name` (personal-name)
- `email_addresses` (email-address, multiselect)
- `phone_numbers` (phone-number, multiselect)
- `websites` (domain, multiselect)

### Companies
**Base Path**: `/v2/objects/companies/records`

**System Attributes**:
- `name` (text)
- `website` (domain)
- `email_domain` (domain)

### Deals
**Base Path**: `/v2/objects/deals/records`

**Note**: Optional object, may need to be enabled in workspace
