# Attio Core Concepts

## Overview
Attio is a customizable CRM platform with a powerful API for building integrations, automations, and data workflows.

## Key Concepts

### Objects
- Objects are the foundational data types (like database tables or classes)
- Default objects: **people** and **companies**
- Optional objects: **deals**, **users**, **workspaces**
- Objects contain **records** (individual instances) and **attributes** (data fields)

### Records
- Individual instances of objects (e.g., a specific person or company)
- Equivalent to rows in a database
- Each record has a unique ID

### Attributes
- Data fields that describe what can be stored
- Can exist on objects or lists
- Types: text, number, select, currency, date, timestamp, status, rating, record references, actor references, location, domain, email address, phone number, interaction, personal name, checkbox
- Some are system-defined, others are custom

### Lists
- Collections of records used to model specific processes
- Each list contains **entries** (rows referencing a single record)
- Lists can have their own attributes in addition to object attributes
- Example: A "Sales Pipeline" list might track deals with list-specific fields like "Stage" or "Close Date"

### List Entries
- Elements within a list
- Each entry references a parent record
- Contains data from list-specific attributes

### Workspaces
- Company-level accounts containing objects, records, and lists
- All API interactions are scoped to a workspace

### Users & Workspace Members
- **Users**: Individual login accounts identified by email
- **Workspace Members**: Links a user to a workspace with specific permissions
- API interactions use workspace members, not users directly

### Actors
- Entities that perform actions (for audit trails)
- Types:
  - **Workspace Member**: Human user (has UUID)
  - **API Token**: Integration/app (has UUID)
  - **System**: Internal Attio processes (null ID)

### Slugs vs IDs
- **IDs**: UUIDs that uniquely identify entities (e.g., `workspace_id`, `object_id`, `record_id`)
  - Use for resilience against changes
  - Full uniqueness requires complete ID combination
- **Slugs**: Human-readable identifiers (e.g., `people`, `companies`)
  - Use for readability and convenience
  - System slugs are consistent across workspaces
  - Immutable (don't change when entities are renamed)

### Default Values
- Pre-populate fields automatically
- **Static**: Fixed values applied directly
- **Dynamic**: Generated based on context
  - `current-user` for actor-reference attributes
  - ISO 8601 Duration for timestamp/date attributes

### Archiving vs Deleting
- **Archive**: Hide data without permanent removal (reversible)
  - Set `is_archived: true` to archive, `false` to restore
- **Delete**: Permanent removal from servers (irreversible)
  - Use `DELETE` HTTP verb
  - Cannot be undone
