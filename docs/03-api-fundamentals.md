# API Fundamentals

## Base URL
```
https://api.attio.com
```

## Format
- JSON over HTTPS
- All requests and responses use JSON

## Rate Limiting

### Limits
- **Read requests**: 100 requests/second
- **Write requests**: 25 requests/second
- May be reduced during incidents or for high-data endpoints

### Handling Rate Limits
**HTTP Status**: 429 Too Many Requests

**Response Headers**: `Retry-After` (timestamp when limit resets)

**Response Body**:
```json
{
  "status_code": 429,
  "type": "rate_limit_error",
  "code": "rate_limit_exceeded",
  "message": "Rate limit exceeded, please try again later"
}
```

**Best Practice**: Extract `Retry-After` header and wait until reset time before retrying.

## Pagination

Attio uses two pagination mechanisms:

### Limit/Offset Pagination
- `limit`: Maximum results per request
- `offset`: Number of items to skip
- Start with `offset=0`, increment by limit for next page
- Continue until results < limit

### Cursor-Based Pagination
- `limit`: Maximum results per request
- `cursor`: Opaque cursor from previous response
- Response includes `pagination.next_cursor`
- Pass `next_cursor` as `cursor` parameter for next request

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "opaque-cursor-value"
  }
}
```

## Filtering and Sorting

### Shorthand Filters (Equality)
```json
{
  "name": "John Smith",
  "email_addresses": "john@smith.com"
}
```

### Verbose Filters (Complex Queries)
```json
{
  "$and": [
    {"name": {"full_name": {"$eq": "John Smith"}}},
    {"email_addresses": {"email_address": {"$eq": "john@smith.com"}}}
  ]
}
```

### Comparison Operators
- `$eq`: Equality
- `$not_empty`: Presence validation
- `$in`: Set membership
- `$contains`: Partial string match (case-insensitive)
- `$starts_with`, `$ends_with`: String boundary matching
- `$lt`, `$lte`, `$gt`, `$gte`: Numeric/date comparisons

### Logical Operators
- `$and`: All conditions required
- `$or`: At least one condition required
- `$not`: Inverts condition

### Sorting
```json
{
  "sorts": [
    {
      "direction": "asc",
      "attribute": "name",
      "field": "last_name"
    }
  ]
}
```

## Error Responses

### Common Status Codes
- **200/201**: Success
- **400**: Validation errors
- **404**: Resource not found
- **409**: Conflict (e.g., duplicate unique values)
- **429**: Rate limit exceeded

### Error Response Format
```json
{
  "status_code": 400,
  "type": "validation_error",
  "code": "invalid_request",
  "message": "Description of the error"
}
```
