# Attio CLI Implementation Plan

## Project Structure

```
attio-cli/
├── src/
│   ├── cli.ts                    # Main CLI entry point
│   ├── commands/                 # Command handlers
│   │   ├── workspace.ts
│   │   ├── object.ts
│   │   ├── attribute.ts
│   │   ├── record.ts
│   │   ├── list.ts
│   │   ├── entry.ts
│   │   └── note.ts
│   ├── api/                      # API client
│   │   ├── client.ts             # Core HTTP client
│   │   ├── types.ts              # API type definitions
│   │   ├── endpoints/
│   │   │   ├── workspace.ts
│   │   │   ├── objects.ts
│   │   │   ├── attributes.ts
│   │   │   ├── records.ts
│   │   │   ├── lists.ts
│   │   │   ├── entries.ts
│   │   │   └── notes.ts
│   │   └── errors.ts             # Error types & handling
│   ├── formatters/               # Output formatters
│   │   ├── json.ts
│   │   ├── table.ts
│   │   └── csv.ts
│   └── utils/
│       ├── config.ts             # Environment config
│       ├── validation.ts         # Input validation
│       └── helpers.ts            # Utility functions
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── fixtures/                 # Test data
├── docs/                         # Documentation (already created)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Tech Stack

- **TypeScript**: Strict mode, no null/undefined allowed
- **Commander.js**: CLI framework
- **Axios**: HTTP client with retry logic
- **Zod**: Runtime type validation
- **Vitest**: Testing framework
- **CLI-Table3**: Table formatting
- **csv-stringify**: CSV output
- **dotenv**: Environment variable management

## Type Safety Strategy

### No Null/Undefined Policy
- Use `NonNullable<T>` utility type throughout
- Explicit error throwing for missing required values
- Zod schemas to validate API responses at runtime
- Branded types for IDs (UUID, Slug)

### Example Type Structure
```typescript
// Branded types for type safety
type UUID = string & { __brand: 'UUID' };
type Slug = string & { __brand: 'Slug' };

// Never allow null/undefined
interface WorkspaceMember {
  id: {
    workspace_id: UUID;
    workspace_member_id: UUID;
  };
  first_name: string;
  last_name: string;
  email_address: string;
  avatar_url: string;
  access_level: 'admin' | 'member' | 'suspended';
  created_at: string;
}

// API responses wrapped in Result type
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
```

## Implementation Phases

Each phase follows the pattern:
1. Create test specifications
2. Write tests (TDD approach)
3. Implement CLI sub-command
4. Iteratively run tests and fix until passing
5. Manual testing
6. Move to next phase

---

## Phase 0: Project Setup

**Goal**: Initialize project with TypeScript, testing framework, and dependencies

### Tasks
1. Initialize npm project
2. Install dependencies
3. Configure TypeScript (strict mode, no null)
4. Configure Vitest
5. Setup ESLint and Prettier
6. Create project structure
7. Setup build process
8. Create .env.example

### Test Specifications
- Project compiles without errors
- TypeScript strict mode enabled
- Test runner works

### Deliverables
- Working TypeScript build
- Test infrastructure ready
- Project skeleton created

---

## Phase 1: API Client Foundation

**Goal**: Build core HTTP client with authentication and error handling

### Test Specifications
1. **Authentication Tests**
   - Correctly reads API key from env variable
   - Correctly reads API key from constructor parameter
   - Throws error when no API key provided
   - Sends Authorization header with Bearer token

2. **HTTP Client Tests**
   - Makes GET requests correctly
   - Makes POST requests correctly
   - Makes PATCH requests correctly
   - Makes DELETE requests correctly
   - Sets correct Content-Type header
   - Handles successful responses (200-299)
   - Handles error responses (400, 404, 409, 429)
   - Retries on rate limit (429) after Retry-After delay
   - Throws typed errors for different error types

3. **Error Handling Tests**
   - Parses API error responses correctly
   - Creates typed errors (ValidationError, NotFoundError, RateLimitError)
   - Includes error details in error objects

### Implementation Steps
1. Write test specs for API client
2. Write tests for authentication
3. Implement config.ts (read env variables)
4. Implement errors.ts (error types)
5. Write tests for HTTP client
6. Implement client.ts (core HTTP client)
7. Run tests and iterate until passing

### Deliverables
- `src/api/client.ts`: Core HTTP client
- `src/api/errors.ts`: Error types
- `src/utils/config.ts`: Configuration management
- All tests passing

---

## Phase 2: Type Definitions & Validation

**Goal**: Define all API types with Zod schemas for runtime validation

### Test Specifications
1. **Type Validation Tests**
   - Validates workspace member objects
   - Validates object definitions
   - Validates attribute definitions
   - Validates record objects
   - Validates list definitions
   - Validates list entry objects
   - Validates note objects
   - Rejects invalid data
   - Handles optional fields correctly

2. **ID & Slug Tests**
   - Validates UUID format
   - Validates slug format
   - Type guards work correctly

### Implementation Steps
1. Write test specs for type validation
2. Write tests for each major type
3. Implement types.ts with Zod schemas
4. Implement validation helpers
5. Run tests and iterate until passing

### Deliverables
- `src/api/types.ts`: All API type definitions with Zod schemas
- `src/utils/validation.ts`: Validation helpers
- All tests passing

---

## Phase 3: Workspace Endpoints

**Goal**: Implement workspace member API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Workspace Members**
   - Calls correct endpoint (GET /v2/workspace-members)
   - Passes limit parameter correctly
   - Returns array of workspace members
   - Validates response with Zod schema

2. **Get Workspace Member**
   - Calls correct endpoint (GET /v2/workspace-members/{id})
   - Returns single workspace member
   - Validates response with Zod schema
   - Throws error for invalid ID

#### CLI Command Tests
1. **`attio workspace members list`**
   - Parses command correctly
   - Calls API with correct parameters
   - Handles --limit option
   - Handles --format option (json, table)
   - Outputs JSON correctly
   - Outputs table correctly
   - Shows error for missing API key

2. **`attio workspace members get`**
   - Parses command correctly
   - Requires member_id argument
   - Calls API with correct parameters
   - Outputs result correctly
   - Shows error for missing ID

### Implementation Steps
1. Write test specs for workspace endpoints
2. Write API endpoint tests
3. Implement `src/api/endpoints/workspace.ts`
4. Run API tests and iterate
5. Write CLI command tests
6. Implement `src/commands/workspace.ts`
7. Implement `src/formatters/json.ts`
8. Implement `src/formatters/table.ts`
9. Wire up commands in `src/cli.ts`
10. Run CLI tests and iterate
11. Manual testing with real API

### Deliverables
- `src/api/endpoints/workspace.ts`: Workspace API methods
- `src/commands/workspace.ts`: Workspace CLI commands
- `src/formatters/json.ts`: JSON output formatter
- `src/formatters/table.ts`: Table output formatter
- All tests passing
- Working CLI commands

---

## Phase 4: Objects & Attributes

**Goal**: Implement objects and attributes API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Objects**: Correct endpoint, returns array, validates response
2. **Get Object**: Correct endpoint, handles slug/ID, validates response
3. **Create Object**: Correct endpoint, sends body, validates response
4. **Update Object**: Correct endpoint, sends PATCH, validates response
5. **List Attributes**: Correct endpoint for objects/lists, validates response
6. **Get Attribute**: Correct endpoint, validates response
7. **Create Attribute**: Correct endpoint, sends body, validates response
8. **Update Attribute**: Correct endpoint, sends PATCH, validates response
9. **List Options**: Correct endpoint, validates response

#### CLI Command Tests
1. **`attio object list`**: Parses, calls API, formats output
2. **`attio object get <object>`**: Requires argument, calls API, outputs result
3. **`attio object create`**: Handles options (--slug, --singular, --plural), calls API
4. **`attio attribute list <target> <identifier>`**: Requires arguments, calls API
5. **`attio attribute get <target> <identifier> <attribute>`**: Requires arguments, calls API
6. **`attio attribute create`**: Handles options (--slug, --title, --type, flags), calls API
7. **`attio attribute options list`**: Requires arguments, calls API

### Implementation Steps
1. Write test specs for objects/attributes endpoints
2. Write API endpoint tests
3. Implement `src/api/endpoints/objects.ts`
4. Implement `src/api/endpoints/attributes.ts`
5. Run API tests and iterate
6. Write CLI command tests
7. Implement `src/commands/object.ts`
8. Implement `src/commands/attribute.ts`
9. Wire up commands in `src/cli.ts`
10. Run CLI tests and iterate
11. Manual testing with real API

### Deliverables
- `src/api/endpoints/objects.ts`: Objects API methods
- `src/api/endpoints/attributes.ts`: Attributes API methods
- `src/commands/object.ts`: Object CLI commands
- `src/commands/attribute.ts`: Attribute CLI commands
- All tests passing
- Working CLI commands

---

## Phase 5: Records (People, Companies, Deals)

**Goal**: Implement records API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Records**:
   - Correct endpoint with object parameter
   - Handles filter, sorts, limit, offset
   - Returns array of records
   - Validates response

2. **Get Record**:
   - Correct endpoint with object and record_id
   - Validates response
   - Throws error for not found

3. **Create Record**:
   - Correct endpoint
   - Sends data in correct format
   - Validates response
   - Returns created record with ID

4. **Update Record**:
   - Correct endpoint (PATCH)
   - Sends data correctly
   - Handles null values (clearing fields)
   - Validates response

5. **Assert Record**:
   - Correct endpoint with :assert suffix
   - Sends matching_attribute query param
   - Returns existing or creates new
   - Validates response

#### CLI Command Tests
1. **`attio record list <object>`**:
   - Requires object argument
   - Handles --limit, --offset options
   - Handles --filter JSON option
   - Handles --sort option (attribute:direction)
   - Validates filter JSON
   - Outputs results correctly

2. **`attio record get <object> <record_id>`**:
   - Requires both arguments
   - Calls API correctly
   - Outputs result

3. **`attio record create <object>`**:
   - Requires object argument
   - Requires --data or --file option
   - Parses JSON data correctly
   - Reads from file if --file provided
   - Supports stdin with --file -
   - Validates data format
   - Outputs created record

4. **`attio record update <object> <record_id>`**:
   - Requires both arguments
   - Requires --data or --file option
   - Handles same data input as create
   - Outputs updated record

5. **`attio record assert <object>`**:
   - Requires object argument
   - Requires --matching-attribute option
   - Requires --data or --file option
   - Calls API correctly
   - Outputs result

### Implementation Steps
1. Write test specs for records endpoints
2. Write API endpoint tests (focus on filter/sort parsing)
3. Implement `src/api/endpoints/records.ts`
4. Run API tests and iterate
5. Write CLI command tests
6. Implement data parsing helpers (JSON, file, stdin)
7. Implement filter/sort option parsing
8. Implement `src/commands/record.ts`
9. Wire up commands in `src/cli.ts`
10. Run CLI tests and iterate
11. Manual testing with people, companies, deals

### Deliverables
- `src/api/endpoints/records.ts`: Records API methods
- `src/commands/record.ts`: Record CLI commands
- `src/utils/helpers.ts`: Data parsing utilities
- All tests passing
- Working CLI commands for all record types

---

## Phase 6: Lists & List Entries

**Goal**: Implement lists and list entries API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Lists**: Correct endpoint, returns array, validates response
2. **Get List**: Correct endpoint, validates response
3. **Create List**: Correct endpoint, sends body, validates response
4. **Update List**: Correct endpoint, sends PATCH, validates response
5. **Query Entries**: Correct endpoint with list param, handles filter/sort/pagination
6. **Get Entry**: Correct endpoint, validates response
7. **Create Entry**: Correct endpoint, sends parent_record_id and data
8. **Update Entry**: Correct endpoint (PATCH), sends data
9. **Delete Entry**: Correct endpoint (DELETE), returns empty object

#### CLI Command Tests
1. **`attio list list`**: Parses, calls API, outputs lists
2. **`attio list get <list>`**: Requires argument, outputs list definition
3. **`attio list create`**: Handles options (--slug, --name, --parent-object), creates list
4. **`attio entry list <list>`**: Requires argument, handles filter/sort/pagination options
5. **`attio entry get <list> <entry_id>`**: Requires arguments, outputs entry
6. **`attio entry create <list>`**: Requires --record-id, handles --data/--file
7. **`attio entry update <list> <entry_id>`**: Requires arguments, handles --data/--file
8. **`attio entry delete <list> <entry_id>`**: Requires arguments, outputs success message

### Implementation Steps
1. Write test specs for lists/entries endpoints
2. Write API endpoint tests
3. Implement `src/api/endpoints/lists.ts`
4. Implement `src/api/endpoints/entries.ts`
5. Run API tests and iterate
6. Write CLI command tests
7. Implement `src/commands/list.ts`
8. Implement `src/commands/entry.ts`
9. Wire up commands in `src/cli.ts`
10. Run CLI tests and iterate
11. Manual testing with real lists/entries

### Deliverables
- `src/api/endpoints/lists.ts`: Lists API methods
- `src/api/endpoints/entries.ts`: Entries API methods
- `src/commands/list.ts`: List CLI commands
- `src/commands/entry.ts`: Entry CLI commands
- All tests passing
- Working CLI commands

---

## Phase 7: Notes

**Goal**: Implement notes API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Notes**:
   - Correct endpoint
   - Handles limit, offset, parent_object, parent_record_id params
   - Returns array of notes
   - Validates response

2. **Get Note**:
   - Correct endpoint with note_id
   - Validates response

3. **Create Note**:
   - Correct endpoint
   - Sends all required fields (parent_object, parent_record_id, title, format, content)
   - Handles optional fields (meeting_id, created_at)
   - Validates response

4. **Update Note**:
   - Correct endpoint (PATCH)
   - Sends update data
   - Validates response

5. **Delete Note**:
   - Correct endpoint (DELETE)
   - Returns empty object

#### CLI Command Tests
1. **`attio note list`**:
   - Handles --limit, --offset options
   - Handles --parent-object, --parent-record-id filters
   - Outputs notes array

2. **`attio note get <note_id>`**:
   - Requires note_id argument
   - Outputs full note with content

3. **`attio note create`**:
   - Requires --parent-object, --parent-record-id, --title, --format, --content
   - Validates format (plaintext or markdown)
   - Handles --content string or --file option
   - Reads content from file if specified
   - Handles --meeting-id optional parameter
   - Outputs created note

4. **`attio note update <note_id>`**:
   - Requires note_id argument
   - Handles --title, --format, --content options
   - Supports --file for content
   - Outputs updated note

5. **`attio note delete <note_id>`**:
   - Requires note_id argument
   - Outputs success message

### Implementation Steps
1. Write test specs for notes endpoints
2. Write API endpoint tests
3. Implement `src/api/endpoints/notes.ts`
4. Run API tests and iterate
5. Write CLI command tests
6. Implement `src/commands/note.ts`
7. Wire up commands in `src/cli.ts`
8. Run CLI tests and iterate
9. Manual testing with real notes

### Deliverables
- `src/api/endpoints/notes.ts`: Notes API methods
- `src/commands/note.ts`: Note CLI commands
- All tests passing
- Working CLI commands

---

## Phase 7a: Tasks

**Goal**: Implement tasks API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Tasks**:
   - Correct endpoint with query parameters
   - Handles filtering (linked_object, linked_record_id, assignee, is_completed)
   - Handles sorting (created_at:asc/desc)
   - Validates response

2. **Get Task**:
   - Correct endpoint with task_id
   - Validates response

3. **Create Task**:
   - Correct endpoint
   - Sends all required fields (content, format, deadline_at, is_completed, linked_records, assignees)
   - Validates content length (max 2000 chars)
   - Handles linked records by ID or matching attribute
   - Handles assignees by ID or email
   - Validates response

4. **Update Task**:
   - Correct endpoint (PATCH)
   - Updates deadline, completion status, linked records, assignees
   - Validates response

5. **Delete Task**:
   - Correct endpoint (DELETE)
   - Returns empty object

#### CLI Command Tests
1. **`attio task list`**:
   - Handles all filter options
   - Handles sort option
   - Outputs tasks array

2. **`attio task get <task_id>`**:
   - Requires task_id argument
   - Outputs full task details

3. **`attio task create`**:
   - Requires --content, --linked-record-id
   - Validates content length
   - Handles optional --deadline, --completed, --assignee flags
   - Supports multiple assignees
   - Outputs created task

4. **`attio task update <task_id>`**:
   - Requires task_id argument
   - Handles optional update fields
   - Outputs updated task

5. **`attio task delete <task_id>`**:
   - Requires task_id argument
   - Outputs success message

### Implementation Steps
1. Write test specs for tasks endpoints
2. Write API endpoint tests
3. Implement `src/api/endpoints/tasks.ts`
4. Run API tests and iterate
5. Write CLI command tests
6. Implement `src/commands/task.ts`
7. Wire up commands in `src/cli.ts`
8. Run CLI tests and iterate
9. Manual testing with real tasks

### Deliverables
- `src/api/endpoints/tasks.ts`: Tasks API methods
- `src/commands/task.ts`: Task CLI commands
- All tests passing
- Working CLI commands

---

## Phase 7b: Meetings

**Goal**: Implement meetings API endpoints and CLI commands

### Test Specifications

#### API Endpoint Tests
1. **List Meetings**:
   - Correct endpoint with query parameters
   - Handles filtering (linked_object, linked_record_id, participants, ends_from, starts_before)
   - Handles cursor-based pagination
   - Handles sorting (start_asc/start_desc)
   - Validates response

2. **Get Meeting**:
   - Correct endpoint with meeting_id
   - Validates response with participants and linked records

#### CLI Command Tests
1. **`attio meeting list`**:
   - Handles all filter options
   - Handles cursor pagination
   - Handles sort option
   - Outputs meetings array with pagination cursor

2. **`attio meeting get <meeting_id>`**:
   - Requires meeting_id argument
   - Outputs full meeting details

### Implementation Steps
1. Write test specs for meetings endpoints
2. Write API endpoint tests
3. Implement `src/api/endpoints/meetings.ts`
4. Run API tests and iterate
5. Write CLI command tests
6. Implement `src/commands/meeting.ts`
7. Wire up commands in `src/cli.ts`
8. Run CLI tests and iterate
9. Manual testing with real meetings

### Deliverables
- `src/api/endpoints/meetings.ts`: Meetings API methods
- `src/commands/meeting.ts`: Meeting CLI commands
- All tests passing
- Working CLI commands

**Note**: Meetings are read-only in the API (no create/update/delete endpoints currently available)

---

## Phase 8: Output Formatting & Polish

**Goal**: Complete output formatters and improve user experience

### Test Specifications
1. **CSV Formatter Tests**:
   - Outputs valid CSV format
   - Handles nested objects (flattens)
   - Handles arrays (joins with semicolon)
   - Includes headers

2. **Error Display Tests**:
   - Shows friendly error messages
   - Includes error details in verbose mode
   - Respects exit codes

3. **Help Text Tests**:
   - All commands have help text
   - Examples are included
   - Options are documented

### Implementation Steps
1. Write test specs for CSV formatter
2. Implement `src/formatters/csv.ts`
3. Run tests and iterate
4. Improve error messages
5. Add examples to all help text
6. Add global --verbose flag
7. Manual testing of all formatters
8. Polish help text and error messages

### Deliverables
- `src/formatters/csv.ts`: CSV output formatter
- Improved error messages
- Comprehensive help text
- All tests passing

---

## Phase 9: Integration Testing & Documentation

**Goal**: End-to-end testing and documentation

### Test Specifications
1. **Integration Test Scenarios**:
   - Create person → Add to list → Add note
   - Create company → Update attributes
   - Query records with filters → Update → Query again
   - Create custom object → Add attributes → Create records
   - Error scenarios (rate limits, validation errors, not found)

### Implementation Steps
1. Write integration test scenarios
2. Implement integration tests (using test API or mocks)
3. Run integration tests and fix issues
4. Write README.md with:
   - Installation instructions
   - Quick start guide
   - Configuration
   - Command reference
   - Examples
5. Write CONTRIBUTING.md
6. Add inline code documentation (JSDoc)
7. Create example scripts in `examples/` directory

### Deliverables
- Integration tests passing
- README.md complete
- CONTRIBUTING.md
- Example scripts
- Code documentation

---

## Phase 10: Build & Distribution

**Goal**: Package for distribution

### Tasks
1. Configure build for production
2. Setup package.json bin entry
3. Test installation from npm locally
4. Add GitHub Actions for CI/CD
5. Add semantic versioning
6. Prepare for npm publish

### Deliverables
- Production build working
- npm package ready
- CI/CD configured
- Ready for distribution

---

## Testing Strategy

### Unit Tests
- Test each function in isolation
- Mock external dependencies
- Focus on edge cases and error handling
- Aim for >90% code coverage

### Integration Tests
- Test complete workflows
- Use test API key or mock server
- Verify CLI commands work end-to-end

### Manual Testing Checklist
- Test each command with real API
- Verify all output formats (JSON, table, CSV)
- Test error scenarios
- Verify help text is clear
- Test with missing/invalid inputs
- Performance testing (rate limit handling)

---

## Development Workflow

### For Each Phase:
1. **Plan**: Review test specifications
2. **Write Tests**: Implement tests first (TDD)
3. **Run Tests**: Verify they fail (red)
4. **Implement**: Write minimal code to pass tests
5. **Run Tests**: Verify they pass (green)
6. **Refactor**: Clean up code while keeping tests passing
7. **Manual Test**: Try commands with real API
8. **Review**: Check code quality, types, error handling
9. **Document**: Update docs and help text
10. **Commit**: Commit working phase

### Quality Checks Before Each Commit:
- `npm run build` - TypeScript compiles without errors
- `npm run test` - All tests pass
- `npm run lint` - No linting errors
- `npm run type-check` - Strict type checking passes
- Manual smoke test of new commands

---

## Success Criteria

### Functionality
- ✅ All CLI commands work as specified
- ✅ All API endpoints properly typed
- ✅ No `null` or `undefined` in codebase (except error boundaries)
- ✅ All tests passing (unit + integration)
- ✅ Proper error handling and user-friendly messages
- ✅ All three output formats working (JSON, table, CSV)

### Code Quality
- ✅ TypeScript strict mode with no errors
- ✅ >90% test coverage
- ✅ No ESLint errors
- ✅ Clean, readable code with documentation
- ✅ Proper separation of concerns

### User Experience
- ✅ Intuitive command structure
- ✅ Helpful error messages
- ✅ Comprehensive help text with examples
- ✅ Fast performance
- ✅ Agent-friendly (predictable, parseable output)

### Documentation
- ✅ API documentation complete
- ✅ README with examples
- ✅ CLI help text for all commands
- ✅ Code documentation (JSDoc)

---

## Time Estimates

Not providing time estimates per requirements, but phases are ordered by:
1. Foundation first (setup, core client)
2. Simple features before complex (workspace before records)
3. Dependencies resolved (types before endpoints)
4. Core features before polish (commands before CSV output)

---

## Next Steps

1. **Review this plan** with you for approval
2. **Phase 0**: Set up project structure
3. **Phase 1-2**: Build foundation (API client, types)
4. **Phase 3-7b**: Implement each feature set iteratively (workspaces, objects, attributes, records, lists, entries, notes, tasks, meetings)
5. **Phase 8-9**: Polish and documentation (output formatting, integration testing)
6. **Phase 10**: Package for distribution

This plan is ready for your review and approval before proceeding with implementation.
