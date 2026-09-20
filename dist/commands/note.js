"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteCommand = createNoteCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const notes_1 = require("../api/endpoints/notes");
const json_1 = require("../formatters/json");
const resource_1 = require("../formatters/resource");
const connected_service_1 = require("../api/connected-service");
const time_window_1 = require("../utils/time-window");
const page_limit_1 = require("../utils/page-limit");
const stdin_1 = require("../utils/stdin");
function createNoteCommand() {
    const note = new commander_1.Command('note').description('Manage notes');
    note
        .command('search')
        .description('Search note content by meaning')
        .argument('<query>', 'Search query')
        .action(async (query) => {
        try {
            console.log((0, json_1.formatJson)(await (0, connected_service_1.callAttio)('semantic-search-notes', { query })));
        }
        catch (error) {
            fail(error);
        }
    });
    note
        .command('metadata-search')
        .description('Search notes by parent, author, meeting, or creation time')
        .option('--parent-object <slug-or-id>', 'Parent record object')
        .option('--parent-record-id <id>', 'Parent record ID')
        .option('--meeting-id <id>', 'Associated meeting ID')
        .option('--workspace-member-id <id>', 'Author workspace member ID')
        .option('--from <timestamp>', 'Inclusive interval start')
        .option('--before <timestamp>', 'Exclusive interval end')
        .option('--limit <number>', 'Maximum notes to return', parseInt)
        .option('--offset <number>', 'Number of notes to skip', parseInt)
        .option('--all', 'Return every matching note')
        .action(async (options) => {
        try {
            if (Boolean(options.parentObject) !== Boolean(options.parentRecordId)) {
                throw new Error('--parent-object and --parent-record-id must be provided together.');
            }
            if (options.all && options.limit !== undefined) {
                throw new Error('Cannot combine --all with --limit.');
            }
            const limit = (0, page_limit_1.requirePageLimit)(options.limit, 50, 'Note') ?? 10;
            const offset = options.offset ?? 0;
            if (!Number.isInteger(offset) || offset < 0) {
                throw new Error('Note offset must be a non-negative integer.');
            }
            const from = typeof options.from === 'string'
                ? (0, time_window_1.attioExclusiveLowerBound)(options.from)
                : undefined;
            const notes = (await new notes_1.NoteEndpoints(new client_1.AttioClient(options.apiKey)).listAllNotes()).data.filter((note) => {
                const raw = note;
                const actor = note.created_by_actor;
                return ((!options.parentObject ||
                    (note.parent_object === options.parentObject &&
                        note.parent_record_id === options.parentRecordId)) &&
                    (!options.meetingId || raw.meeting_id === options.meetingId) &&
                    (!options.workspaceMemberId ||
                        actor.id === options.workspaceMemberId) &&
                    (!from || note.created_at > from) &&
                    (!options.before || note.created_at < options.before));
            });
            const results = options.all
                ? notes.slice(offset)
                : notes.slice(offset, offset + limit);
            const hasMore = offset + results.length < notes.length;
            console.log((0, json_1.formatJson)({
                results,
                has_more: options.all ? false : hasMore,
                next_offset: options.all || !hasMore ? null : offset + results.length,
            }));
        }
        catch (error) {
            fail(error);
        }
    });
    // List notes
    note
        .command('list')
        .description('List notes')
        .option('--limit <number>', 'Maximum notes to return', parseInt)
        .option('--offset <number>', 'Number of notes to skip', parseInt)
        .option('--all', 'Fetch every page and return a completion receipt')
        .option('--parent-object <slug>', 'Filter by parent object (e.g., people)')
        .option('--parent-record-id <id>', 'Filter by parent record ID')
        .action(async (options) => {
        try {
            if (options.all && options.offset !== undefined) {
                throw new Error('Cannot combine --all with --offset.');
            }
            const client = new client_1.AttioClient(options.apiKey);
            const noteApi = new notes_1.NoteEndpoints(client);
            const request = {
                limit: options.limit,
                offset: options.offset,
                parent_object: options.parentObject,
                parent_record_id: options.parentRecordId,
            };
            const result = options.all
                ? await noteApi.listAllNotes(request)
                : await noteApi.listNotesPage(request);
            console.log((0, json_1.formatJson)((0, resource_1.formatCollection)(result, resource_1.formatNote)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Get note
    note
        .command('get')
        .description('Get a specific note')
        .argument('<note-id>', 'Note ID')
        .action(async (noteId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const noteApi = new notes_1.NoteEndpoints(client);
            const n = await noteApi.getNote(noteId);
            console.log((0, json_1.formatJson)((0, resource_1.formatNote)(n)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Create note
    note
        .command('create')
        .description('Create a new note')
        .argument('<object>', 'Parent object slug or ID')
        .argument('<record-id>', 'Parent record ID')
        .argument('<title>', 'Note title')
        .argument('[content]', 'Note body; defaults to stdin')
        .option('--markdown', 'Interpret the body as Markdown')
        .option('--meeting <id>', 'Associated meeting ID')
        .action(async (parentObject, parentRecordId, title, content, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const noteApi = new notes_1.NoteEndpoints(client);
            const data = {
                data: {
                    parent_object: parentObject,
                    parent_record_id: parentRecordId,
                    title,
                    format: options.markdown
                        ? 'markdown'
                        : 'plaintext',
                    content: await (0, stdin_1.readInput)(content, 'Note body'),
                    meeting_id: options.meeting || null,
                },
            };
            const n = await noteApi.createVerifiedNote(data);
            console.log((0, json_1.formatJson)((0, resource_1.formatNote)(n)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Delete note
    note
        .command('delete')
        .description('Delete a note')
        .argument('<note-id>', 'Note ID')
        .action(async (noteId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const noteApi = new notes_1.NoteEndpoints(client);
            await noteApi.deleteNote(noteId);
            console.log((0, json_1.formatJson)({ deleted: true, note_id: noteId }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Update note
    note
        .command('update')
        .description('Update a note in place')
        .argument('<note-id>', 'Note ID to update')
        .argument('[content]', 'New note body; defaults to stdin when provided as -')
        .option('--title <title>', 'New note title')
        .option('--markdown', 'Interpret the new body as Markdown')
        .action(async (noteId, content, options) => {
        try {
            // Validate at least one update field is provided
            if (!options.title && content === undefined) {
                console.error('Error: Provide a body argument (or - for stdin) or --title.');
                process.exit(1);
            }
            const client = new client_1.AttioClient(options.apiKey);
            const noteApi = new notes_1.NoteEndpoints(client);
            const updates = {};
            if (options.title)
                updates.title = options.title;
            if (content !== undefined) {
                updates.content = await (0, stdin_1.readInput)(content, 'Note body');
                updates.format = options.markdown ? 'markdown' : 'plaintext';
            }
            const updated = await noteApi.updateNote(noteId, updates);
            console.log((0, json_1.formatJson)((0, resource_1.formatNote)(updated)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Find notes by title
    note
        .command('find')
        .description('Find notes by title for a parent record')
        .argument('<parent-object>', 'Parent object slug (e.g., people, deals)')
        .argument('<parent-record-id>', 'Parent record ID')
        .option('--title <title>', 'Exact title to match')
        .option('--title-pattern <pattern>', 'Glob pattern to match (* = any chars, ? = single char)')
        .action(async (parentObject, parentRecordId, options) => {
        try {
            // Validate exactly one of title or title-pattern is provided
            if (!options.title && !options.titlePattern) {
                console.error('Error: Either --title or --title-pattern must be provided');
                process.exit(1);
            }
            if (options.title && options.titlePattern) {
                console.error('Error: Cannot use both --title and --title-pattern');
                process.exit(1);
            }
            const client = new client_1.AttioClient(options.apiKey);
            const noteApi = new notes_1.NoteEndpoints(client);
            const notes = await noteApi.findNotesByTitle(parentObject, parentRecordId, {
                title: options.title,
                titlePattern: options.titlePattern,
            });
            console.log((0, json_1.formatJson)(notes));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return note;
}
function fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
}
//# sourceMappingURL=note.js.map