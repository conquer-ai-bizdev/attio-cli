# Authentication

## Methods

Attio supports two authentication approaches:

### 1. API Key (Recommended for CLI)
- Best for single-workspace scenarios
- Generated through developer settings page
- Simpler setup for command-line tools

### 2. OAuth 2.0
- Required for multi-workspace applications
- Follows OAuth 2.0 specification
- More complex but supports delegated access

## Making Authenticated Requests

Include your token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Alternative: HTTP Basic Authentication (token as username, blank password)

## Token Scopes

Both API keys and OAuth tokens use scopes to control access:

### Common Scopes
- `record_permission:read` - Read records
- `record_permission:read-write` - Create/update records
- `object_configuration:read` - Read object definitions
- `object_configuration:read-write` - Modify objects
- `list_configuration:read` - Read list definitions
- `list_configuration:read-write` - Modify lists
- `list_entry:read` - Read list entries
- `list_entry:read-write` - Create/update list entries
- `user_management:read` - View workspace members
- `user_management:read-write` - Manage workspace members
- `note:read` - Read notes
- `note:read-write` - Create/update notes
- `webhook_configuration:read` - View webhooks
- `webhook_configuration:read-write` - Manage webhooks

## Environment Variable Configuration

For CLI tools, store the API token in an environment variable:
```bash
export ATTIO_API_KEY="your_api_key_here"
```
