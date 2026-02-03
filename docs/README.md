# Attio CLI Documentation

This directory contains comprehensive documentation for the Attio CLI project, covering API concepts, endpoints, CLI specifications, and implementation plan.

## Documentation Index

### Core Concepts & API Fundamentals
1. **[Core Concepts](./01-core-concepts.md)** - Objects, records, lists, attributes, workspaces, actors, slugs vs IDs
2. **[Authentication](./02-authentication.md)** - API keys, OAuth, scopes, environment configuration
3. **[API Fundamentals](./03-api-fundamentals.md)** - Base URL, rate limiting, pagination, filtering, sorting, error handling

### API Endpoints Reference

#### Configuration & Metadata
4. **[Workspaces & Members](./04-endpoints-workspaces.md)** - Workspace member management
5. **[Objects & Attributes](./05-endpoints-objects-attributes.md)** - Object definitions, attribute management, select/status options

#### Records (Standard Objects)
6. **[Records (Generic)](./06-endpoints-records.md)** - Generic record operations (list, get, create, update, assert, delete)
7. **[People Records](./06a-endpoints-people.md)** - People-specific endpoints and attributes
8. **[Company Records](./06b-endpoints-companies.md)** - Company-specific endpoints and attributes
9. **[Deal Records](./06c-endpoints-deals.md)** - Deal-specific endpoints and attributes

#### Lists & Workflows
10. **[Lists & Entries](./07-endpoints-lists.md)** - List management, entry operations, assert entries, multiselect handling

#### Content & Activities
11. **[Notes](./08-endpoints-notes.md)** - Create, read, update, delete notes with markdown support
12. **[Tasks](./08a-endpoints-tasks.md)** - Task management, assignment, filtering
13. **[Meetings](./08b-endpoints-meetings.md)** - Meeting queries, participant filtering (read-only)

### CLI Design & Implementation
14. **[CLI Specification](./09-cli-specification.md)** - Complete CLI command structure, arguments, options, examples
15. **[Implementation Plan](./10-implementation-plan.md)** - Phase-by-phase development plan with test specifications

## Quick Reference

### Standard Objects
- **people**: Individual contacts with emails, phone numbers, social profiles
- **companies**: Organizations with domains, employee counts, categories
- **deals**: Sales opportunities with stages, values, owners
- **users**: Workspace user records
- **workspaces**: Workspace records

### Key API Patterns

#### Creating Records
```bash
POST /v2/objects/{object}/records
PUT /v2/objects/{object}/records?matching_attribute=email_addresses  # Assert
```

#### Working with Lists
```bash
GET /v2/lists                                    # List all lists
POST /v2/lists/{list}/entries                    # Add record to list
PUT /v2/lists/{list}/entries                     # Assert entry
PATCH /v2/lists/{list}/entries/{entry_id}        # Update (append multiselect)
```

#### Filtering & Querying
```bash
POST /v2/objects/people/records/query
# Body: {"filter": {"email_addresses": {"$contains": "@example.com"}}}
```

### CLI Commands Structure
```bash
attio <resource> <action> [arguments] [options]

# Examples:
attio workspace members list
attio record create people --data '{...}'
attio entry list my_list --filter '{...}'
attio note create --parent-object people --parent-record-id abc-123
attio task list --linked-object people --completed false
```

## Implementation Phases

1. **Phase 0**: Project setup (TypeScript, testing, dependencies)
2. **Phase 1**: API client foundation (HTTP client, auth, errors)
3. **Phase 2**: Type definitions & validation (Zod schemas)
4. **Phase 3**: Workspace endpoints & CLI
5. **Phase 4**: Objects & attributes
6. **Phase 5**: Records (people, companies, deals)
7. **Phase 6**: Lists & entries
8. **Phase 7**: Notes
9. **Phase 7a**: Tasks
10. **Phase 7b**: Meetings
11. **Phase 8**: Output formatting & polish
12. **Phase 9**: Integration testing & documentation
13. **Phase 10**: Build & distribution

## Type Safety Requirements

- **TypeScript strict mode**: No implicit any, strict null checks
- **No null/undefined**: Use explicit error throwing for missing values
- **Runtime validation**: Zod schemas for all API responses
- **Branded types**: UUIDs and slugs have distinct types

## Development Principles

- **Test-Driven Development**: Write tests before implementation
- **No premature optimization**: Implement minimal working solutions
- **Explicit error handling**: Clear, user-friendly error messages
- **Agent-friendly design**: Predictable JSON output, clear exit codes
- **Comprehensive help**: Every command has examples and documentation
