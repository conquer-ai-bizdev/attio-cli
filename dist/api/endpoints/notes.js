"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
/**
 * Convert a simple glob pattern to a RegExp
 * Supports: * (any chars) and ? (single char)
 */
function globToRegex(pattern) {
    const escaped = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
        .replace(/\*/g, '.*') // * -> .*
        .replace(/\?/g, '.'); // ? -> .
    return new RegExp(`^${escaped}$`, 'i'); // Case-insensitive, full match
}
class NoteEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listNotes(options) {
        return (await this.listNotesPage(options)).data;
    }
    async listNotesPage(options = {}) {
        validateNoteOptions(options);
        const limit = options.limit ?? 10;
        const offset = options.offset ?? 0;
        const params = { limit, offset };
        if (options.parent_object)
            params.parent_object = options.parent_object;
        if (options.parent_record_id)
            params.parent_record_id = options.parent_record_id;
        const response = await this.client.get('/notes', params);
        const validated = (0, validation_1.validate)(types_1.NotesResponseSchema, response);
        const complete = validated.data.length < limit;
        return {
            data: validated.data,
            pagination: {
                complete,
                offset,
                limit,
                next_offset: complete ? null : offset + validated.data.length,
            },
        };
    }
    async listAllNotes(options = {}) {
        const limit = options.limit ?? 50;
        validateNoteOptions({ ...options, limit });
        const byId = new Map();
        let offset = 0;
        let pages = 0;
        let observedItems = 0;
        while (true) {
            const page = await this.listNotesPage({ ...options, limit, offset });
            pages += 1;
            observedItems += page.data.length;
            for (const note of page.data)
                byId.set(note.id.note_id, note);
            if (page.pagination.complete)
                break;
            offset = page.pagination.next_offset;
        }
        const data = [...byId.values()];
        return {
            data,
            pagination: {
                complete: true,
                pages,
                items: data.length,
                duplicates_removed: observedItems - data.length,
                next_offset: null,
            },
        };
    }
    async getNote(noteId) {
        const response = await this.client.get(`/notes/${noteId}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.NoteSchema, dataResponse.data);
    }
    async createNote(data) {
        const response = await this.client.post('/notes', data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.NoteSchema, dataResponse.data);
    }
    async deleteNote(noteId) {
        await this.client.delete(`/notes/${noteId}`);
    }
    async updateNote(noteId, updates) {
        const response = await this.client.patch(`/notes/${noteId}`, {
            data: updates,
        });
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.NoteSchema, dataResponse.data);
    }
    /**
     * Find notes by title (exact match or glob pattern)
     */
    async findNotesByTitle(parentObject, parentRecordId, options) {
        // List all notes for the parent record
        const notes = (await this.listAllNotes({
            parent_object: parentObject,
            parent_record_id: parentRecordId,
        })).data;
        // Filter by exact title or pattern
        if (options.title) {
            // Exact match (case-insensitive)
            return notes.filter((note) => note.title.toLowerCase() === options.title.toLowerCase());
        }
        if (options.titlePattern) {
            const regex = globToRegex(options.titlePattern);
            return notes.filter((note) => regex.test(note.title));
        }
        return notes;
    }
}
exports.NoteEndpoints = NoteEndpoints;
function validateNoteOptions(options) {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        throw new Error('Note limit must be an integer between 1 and 50.');
    }
    if (!Number.isInteger(offset) || offset < 0) {
        throw new Error('Note offset must be a non-negative integer.');
    }
    if (Boolean(options.parent_object) !== Boolean(options.parent_record_id)) {
        throw new Error('--parent-object and --parent-record-id must be provided together.');
    }
}
//# sourceMappingURL=notes.js.map