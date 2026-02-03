# Company Records Endpoints

Companies are organization contacts in your CRM. This is a standard object in Attio.

## List Company Records
**POST** `/v2/objects/companies/records/query`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Request Body**:
```json
{
  "filter": {
    "domains": {
      "root_domain": {"$eq": "example.com"}
    }
  },
  "sorts": [
    {
      "attribute": "name",
      "direction": "asc"
    }
  ],
  "limit": 500,
  "offset": 0
}
```

**Response**: Array of company records with values

## Assert Company Record
**PUT** `/v2/objects/companies/records`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Query Parameters**:
- `matching_attribute`: Attribute slug/ID to match on (required)
  - For companies, `domains` is commonly used

**Request Body**:
```json
{
  "data": {
    "values": {
      "name": [
        {"value": "Acme Corp"}
      ],
      "domains": [
        {"root_domain": "acme.com"}
      ],
      "description": [
        {"value": "Leading provider of..."}
      ],
      "categories": [
        {"value": "Technology"}
      ]
    }
  }
}
```

**Response**: Company record object (created or existing)

## Create Company Record
**POST** `/v2/objects/companies/records`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Request Body**: Same as assert (without matching_attribute parameter)

**Response**: Created company record

## Get Company Record
**GET** `/v2/objects/companies/records/{record_id}`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Parameters**:
- `record_id`: Company record UUID

**Response**: Single company record object

## Update Company Record
**PATCH** `/v2/objects/companies/records/{record_id}`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Request Body**:
```json
{
  "data": {
    "values": {
      "name": [
        {"value": "Updated Company Name"}
      ],
      "employee_range": [
        {"value": "51-200"}
      ]
    }
  }
}
```

**Response**: Updated company record

## Delete Company Record
**DELETE** `/v2/objects/companies/records/{record_id}`

**Scopes**: `record_permission:read-write`

**Response**: Empty object `{}`

## List Company Record Attribute Values
**GET** `/v2/objects/companies/records/{record_id}/attributes/{attribute}/values`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Query Parameters**:
- `show_historic`: Return all historic values if true (default: false)
- `limit`: Maximum results
- `offset`: Skip results

**Response**: Array of attribute value objects with history

## List Company Record Entries
**GET** `/v2/objects/companies/records/{record_id}/entries`

**Scopes**: `record_permission:read`, `object_configuration:read`, `list_entry:read`

**Query Parameters**:
- `limit`: Maximum results (default: 100, max: 1000)
- `offset`: Skip results (default: 0)

**Description**: Lists all list entries for this company record across all lists

**Response**: Array of entry references with list_id, list_api_slug, entry_id, created_at

## Standard Company Attributes

- `name` (text): Company name
- `domains` (domain, multiselect): Company websites/domains
- `description` (text): Company description
- `categories` (text, multiselect): Industry categories
- `foundation_date` (date): When company was founded
- `employee_range` (text): Employee count range
- `estimated_arr_usd` (currency): Estimated annual recurring revenue
- `primary_location` (location): Company headquarters address
