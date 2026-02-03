# Attribute Management Implementation

## Summary

This implementation adds **production-grade attribute management** to the Attio CLI with complete CRUD operations for attributes, select options, and statuses.

## What Was Implemented

### Phase 1: Complete CRUD API Coverage ✅

#### 1. New API Endpoints (`/src/api/endpoints/attributes.ts`)
- `AttributeEndpoints` class with unified handling for both objects and lists
- **Attribute CRUD**: `listAttributes`, `getAttribute`, `createAttribute`, `updateAttribute`, `deleteAttribute`
- **Select Options**: `listSelectOptions`, `createSelectOption`, `updateSelectOption`, `deleteSelectOption`
- **Statuses**: `listStatuses`, `createStatus`, `updateStatus`, `deleteStatus`
- **Convenience Method**: `listAttributesWithValues` (fetches attributes with their options/statuses)

#### 2. Type Schemas (`/src/api/types.ts`)
- `SelectOption` and `SelectOptionSchema`
- `Status` and `StatusSchema`
- `AttributeWithValues` (attribute + select_options/statuses)
- Response schemas for validation

#### 3. Updated Existing Endpoints
- **ObjectEndpoints**: Now delegates attribute operations to `AttributeEndpoints`
- **ListEndpoints**: Added `listAttributes` and `getAttribute` methods

#### 4. Complete CLI Commands (`/src/commands/attribute.ts`)
```bash
# Attribute CRUD
attio attribute list <target> <identifier>
attio attribute get <target> <identifier> <attribute-slug>
attio attribute create <target> <identifier> [options]
attio attribute update <target> <identifier> <attribute-slug> [options]
attio attribute delete <target> <identifier> <attribute-slug>

# Select Options
attio attribute options <target> <identifier> <attribute-slug>
attio attribute option-create <target> <identifier> <attribute-slug> --title "..."
attio attribute option-update <target> <identifier> <attribute-slug> <option-id> [options]
attio attribute option-delete <target> <identifier> <attribute-slug> <option-id>

# Statuses
attio attribute statuses <target> <identifier> <attribute-slug>
attio attribute status-create <target> <identifier> <attribute-slug> --title "..."
attio attribute status-update <target> <identifier> <attribute-slug> <status-id> [options]
attio attribute status-delete <target> <identifier> <attribute-slug> <status-id>
```

Where `<target>` is either `objects` or `lists`.

### Phase 2: Convenience Commands ✅

#### 5. Enhanced Object Commands (`/src/commands/object.ts`)
```bash
# NEW: Get attributes WITH their possible values in one command
attio object attributes-with-values <object-slug> [--show-archived] [--format json|table|csv]
```

#### 6. Enhanced List Commands (`/src/commands/list.ts`)
```bash
# NEW: List attributes for a list
attio list attributes <list-slug> [--format json|table|csv]

# NEW: Get attributes WITH their possible values in one command
attio list attributes-with-values <list-slug> [--show-archived] [--format json|table|csv]
```

### Phase 3: Testing ✅

#### 7. Integration Tests
- **`tests/integration/attributes.test.ts`**: Comprehensive CRUD tests
  - List and get attributes for objects and lists
  - Create, update, delete attributes
  - Select options management
  - Status management
  - Full lifecycle tests with cleanup

- **`tests/integration/convenience.test.ts`**: Convenience command tests
  - Attributes with values for objects and lists
  - Proper population of select_options and statuses
  - Error handling
  - Performance validation

### Phase 4: Documentation ✅

#### 8. Updated README.md
- Complete command reference for all attribute operations
- Detailed examples for common workflows
- Usage patterns for select attributes and statuses
- List attribute management

---

## Key Features

### 1. Unified Target System
Both objects and lists use the same commands with a `target` parameter:
```bash
# Works for objects
attio attribute list objects people

# Works for lists
attio attribute list lists my_list
```

### 2. Complete CRUD (with API Limitations)
Full control over:
- Attributes (create, read, update - **no delete** via API)
- Select options (create, read, update, archive)
- Statuses (create, read, update, archive)

**Important API Limitations:**
- ⚠️ Attributes **cannot be deleted** via the Attio API, only archived by updating
- ⚠️ Status attributes can **only be created on lists and custom objects**, not on built-in objects like "people"
- ℹ️ Select options and statuses should be archived rather than deleted for data integrity

### 3. Convenience Commands
One-command access to full schema with values:
```bash
# Instead of:
attio attribute list objects people
attio attribute options objects people industry
attio attribute options objects people department
# ... one by one

# Just run:
attio object attributes-with-values people --format json
# Returns ALL attributes with their options/statuses populated
```

### 4. Production-Ready
- Full TypeScript typing with Zod validation
- Proper error handling
- Cleanup in tests
- Supports all output formats (JSON, table, CSV)

---

## Example Workflows

### Get Complete Object Schema
```bash
# See all attributes and their possible values
attio object attributes-with-values people --format json > people-schema.json

# View in table format (shows options/statuses as comma-separated)
attio object attributes-with-values companies --format table
```

### Create Industry Select Attribute
```bash
# 1. Create the attribute
attio attribute create objects companies \
  --title "Industry" \
  --slug industry \
  --type select

# 2. Add options
attio attribute option-create objects companies industry --title "Technology"
attio attribute option-create objects companies industry --title "Healthcare"
attio attribute option-create objects companies industry --title "Finance"
attio attribute option-create objects companies industry --title "Manufacturing"

# 3. View all options
attio attribute options objects companies industry --format table
```

### Create Deal Status Attribute
```bash
# 1. Create status attribute
attio attribute create objects deals \
  --title "Deal Stage" \
  --slug deal_stage \
  --type status

# 2. Add statuses
attio attribute status-create objects deals deal_stage --title "Prospecting"
attio attribute status-create objects deals deal_stage --title "Qualified"
attio attribute status-create objects deals deal_stage --title "Proposal"
attio attribute status-create objects deals deal_stage --title "Negotiation"
attio attribute status-create objects deals deal_stage --title "Closed Won" --celebration

# 3. View pipeline
attio attribute statuses objects deals deal_stage --format table
```

### Manage List Attributes
```bash
# Create a priority attribute for a list
attio attribute create lists project_tasks \
  --title "Priority" \
  --slug priority \
  --type select

# Add priority levels
attio attribute option-create lists project_tasks priority --title "Critical"
attio attribute option-create lists project_tasks priority --title "High"
attio attribute option-create lists project_tasks priority --title "Medium"
attio attribute option-create lists project_tasks priority --title "Low"

# View complete list schema
attio list attributes-with-values project_tasks --format json
```

### Update and Archive
```bash
# Update attribute properties
attio attribute update objects people department \
  --title "Team" \
  --required true

# Update option title
attio attribute option-update objects companies industry abc123 \
  --title "Technology & SaaS"

# Archive an option (recommended way to "delete")
attio attribute option-archive objects companies industry old456

# Or manually archive via update
attio attribute option-update objects companies industry old456 \
  --archived true

# Archive a status
attio attribute status-archive lists my_list status_attr status_id

# View including archived
attio attribute options objects companies industry --show-archived --format table
```

---

## Testing

### Run Type Checking
```bash
npm run type-check
```

### Run Integration Tests
```bash
# Set your API key
export ATTIO_API_KEY="your_key_here"

# Run all integration tests
npm run test:integration

# Run specific test file
npm run test:integration tests/integration/attributes.test.ts
```

### Test the CLI Manually
```bash
# Build
npm run build

# Test attribute commands
./dist/cli.js attribute list objects people --format table
./dist/cli.js object attributes-with-values companies --format json
./dist/cli.js list attributes-with-values my_list --format table
```

---

## Architecture Decisions

### Why AttributeEndpoints is Separate
- Objects and lists use identical API patterns (just different `target` param)
- Reduces code duplication
- Single source of truth for attribute logic
- ObjectEndpoints and ListEndpoints delegate to it

### Why Convenience Commands are Separate
- Phase 1 provides atomic CRUD operations (composable, scriptable)
- Phase 2 provides UX-focused convenience commands
- Users can choose their preferred level of control

### Error Handling in listAttributesWithValues
- If fetching options/statuses fails for one attribute, others still succeed
- Logs warnings but doesn't throw
- Graceful degradation for better UX

---

## Files Changed

### New Files
- `/src/api/endpoints/attributes.ts` - AttributeEndpoints class
- `/src/commands/attribute.ts` - Attribute CLI commands
- `/tests/integration/attributes.test.ts` - CRUD integration tests
- `/tests/integration/convenience.test.ts` - Convenience command tests
- `/ATTRIBUTE_MANAGEMENT.md` - This documentation

### Modified Files
- `/src/api/types.ts` - Added SelectOption, Status, AttributeWithValues types
- `/src/api/endpoints/objects.ts` - Delegate to AttributeEndpoints
- `/src/api/endpoints/lists.ts` - Added attribute methods
- `/src/commands/object.ts` - Added attributes-with-values command
- `/src/commands/list.ts` - Added attributes and attributes-with-values commands
- `/src/cli.ts` - Registered attribute command
- `/README.md` - Comprehensive documentation and examples

---

## API Limitations & Workarounds

### Attributes Cannot Be Deleted
The Attio API does not provide an endpoint to delete attributes. Once created, attributes remain in the system.

**Workaround**: Update the attribute with a description indicating it's no longer in use, or leave it archived.

### Status Attributes Restricted to Lists and Custom Objects
Status attributes can only be created on:
- Lists
- Custom objects (not built-in objects like "people", "companies", "deals")

**Workaround**: Create status attributes on lists instead of objects, or use select attributes for built-in objects.

### Options and Statuses Should Be Archived
While the API may provide delete endpoints for options and statuses, archiving is the recommended approach for data integrity.

**Best Practice**: Use `option-archive` and `status-archive` commands instead of attempting deletion.

## Next Steps (Future Enhancements)

1. **Batch Operations**: Create multiple options/statuses at once
2. **Templates**: Save and apply attribute configurations
3. **Validation**: Pre-flight checks before creating attributes
4. **Import/Export**: Bulk schema management via JSON/CSV
5. **Search**: Find attributes by type, name pattern, etc.

---

## Support

For questions or issues:
1. Check the README.md for command examples
2. Run `attio attribute --help` for command reference
3. Run `attio attribute <subcommand> --help` for detailed usage
4. Review integration tests for working examples
