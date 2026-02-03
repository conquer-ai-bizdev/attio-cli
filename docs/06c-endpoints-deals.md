# Deal Records Endpoints

Deals represent sales opportunities in your CRM. This is an optional standard object in Attio.

## List Deal Records
**POST** `/v2/objects/deals/records/query`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Request Body**:
```json
{
  "filter": {
    "stage": {
      "status_id": {"$eq": "uuid"}
    },
    "value": {
      "currency_value": {"$gte": 10000}
    }
  },
  "sorts": [
    {
      "attribute": "value",
      "direction": "desc"
    }
  ],
  "limit": 500,
  "offset": 0
}
```

**Response**: Array of deal records with values

## Assert Deal Record
**PUT** `/v2/objects/deals/records`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Query Parameters**:
- `matching_attribute`: Attribute slug/ID to match on (required)

**Request Body**:
```json
{
  "data": {
    "values": {
      "name": [
        {"value": "Acme Corp - Q1 Deal"}
      ],
      "stage": [
        {"status_id": "uuid"}
      ],
      "value": [
        {
          "currency_value": 50000,
          "currency_code": "USD"
        }
      ],
      "owner": [
        {
          "referenced_actor_type": "workspace-member",
          "referenced_actor_id": "uuid"
        }
      ],
      "associated_company": [
        {"target_record_id": "uuid"}
      ],
      "associated_people": [
        {"target_record_id": "uuid"}
      ]
    }
  }
}
```

**Response**: Deal record object (created or existing)

## Create Deal Record
**POST** `/v2/objects/deals/records`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Request Body**: Same as assert (without matching_attribute parameter)

**Response**: Created deal record

## Get Deal Record
**GET** `/v2/objects/deals/records/{record_id}`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Parameters**:
- `record_id`: Deal record UUID

**Response**: Single deal record object

## Update Deal Record
**PATCH** `/v2/objects/deals/records/{record_id}`

**Scopes**: `record_permission:read-write`, `object_configuration:read`

**Request Body**:
```json
{
  "data": {
    "values": {
      "stage": [
        {"status_id": "uuid"}
      ],
      "value": [
        {
          "currency_value": 75000,
          "currency_code": "USD"
        }
      ]
    }
  }
}
```

**Response**: Updated deal record

## Delete Deal Record
**DELETE** `/v2/objects/deals/records/{record_id}`

**Scopes**: `record_permission:read-write`

**Response**: Empty object `{}`

## List Deal Record Attribute Values
**GET** `/v2/objects/deals/records/{record_id}/attributes/{attribute}/values`

**Scopes**: `record_permission:read`, `object_configuration:read`

**Query Parameters**:
- `show_historic`: Return all historic values if true (default: false)
- `limit`: Maximum results
- `offset`: Skip results

**Response**: Array of attribute value objects with history

## List Deal Record Entries
**GET** `/v2/objects/deals/records/{record_id}/entries`

**Scopes**: `record_permission:read`, `object_configuration:read`, `list_entry:read`

**Query Parameters**:
- `limit`: Maximum results (default: 100, max: 1000)
- `offset`: Skip results (default: 0)

**Description**: Lists all list entries for this deal record across all lists

**Response**: Array of entry references

## Standard Deal Attributes

- `name` (text): Deal name/title
- `stage` (status): Current stage in sales pipeline
- `value` (currency): Deal value/amount
- `owner` (actor-reference): Deal owner (workspace member)
- `associated_company` (record-reference): Related company
- `associated_people` (record-reference, multiselect): Related people
- `close_date` (date): Expected or actual close date
- `description` (text): Deal notes/description
