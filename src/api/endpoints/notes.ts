import { AttioClient } from '../client';
import { NotesResponseSchema, NoteSchema, Note } from '../types';
import { validate } from '../../utils/validation';

/**
 * Convert a simple glob pattern to a RegExp
 * Supports: * (any chars) and ? (single char)
 */
function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
    .replace(/\*/g, '.*') // * -> .*
    .replace(/\?/g, '.'); // ? -> .
  return new RegExp(`^${escaped}$`, 'i'); // Case-insensitive, full match
}

export interface UpdateNoteResult {
  newNote: Note;
  oldNoteId: string;
}

export interface ListNotesOptions {
  limit?: number;
  offset?: number;
  parent_object?: string;
  parent_record_id?: string;
}

export interface CreateNoteData {
  data: {
    parent_object: string;
    parent_record_id: string;
    title: string;
    format: 'plaintext' | 'markdown';
    content: string;
    meeting_id?: string | null;
    created_at?: string;
  };
}

export class NoteEndpoints {
  constructor(private client: AttioClient) {}

  async listNotes(options?: ListNotesOptions): Promise<Note[]> {
    const params: Record<string, unknown> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;
    if (options?.parent_object) params.parent_object = options.parent_object;
    if (options?.parent_record_id)
      params.parent_record_id = options.parent_record_id;

    const response = await this.client.get('/notes', params);
    const validated = validate(NotesResponseSchema, response);
    return validated.data;
  }

  async getNote(noteId: string): Promise<Note> {
    const response = await this.client.get(`/notes/${noteId}`);
    const dataResponse = response as { data: unknown };
    return validate(NoteSchema, dataResponse.data);
  }

  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await this.client.post('/notes', data);
    const dataResponse = response as { data: unknown };
    return validate(NoteSchema, dataResponse.data);
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.client.delete(`/notes/${noteId}`);
  }

  /**
   * Update a note via create-then-delete (Attio API doesn't support PATCH)
   * Creates a new note with updated fields, then deletes the original
   */
  async updateNote(
    noteId: string,
    updates: {
      title?: string;
      content?: string;
      format?: 'plaintext' | 'markdown';
    }
  ): Promise<UpdateNoteResult> {
    // Fetch the original note
    const original = await this.getNote(noteId);

    // Determine the format to use (default to plaintext if not specified)
    // Note: 'html' format from API is converted to 'plaintext' for creation
    const originalFormat = original.format === 'markdown' ? 'markdown' : 'plaintext';
    const newFormat = updates.format || originalFormat;

    // Determine the content to use
    let newContent: string;

    if (updates.content !== undefined) {
      newContent = updates.content;
    } else {
      // Use appropriate content field based on format
      newContent =
        newFormat === 'markdown'
          ? original.content_markdown || original.content_plaintext || ''
          : original.content_plaintext || '';
    }

    // Create new note with same parent, updated fields
    const newNote = await this.createNote({
      data: {
        parent_object: original.parent_object,
        parent_record_id: original.parent_record_id,
        title: updates.title ?? original.title,
        format: newFormat,
        content: newContent,
      },
    });

    // Delete the original note
    try {
      await this.deleteNote(noteId);
    } catch (error) {
      // Warn but don't fail - the new note was created successfully
      console.warn(
        `Warning: Failed to delete original note ${noteId}. New note ${newNote.id.note_id} was created successfully.`
      );
    }

    return {
      newNote,
      oldNoteId: noteId,
    };
  }

  /**
   * Find notes by title (exact match or glob pattern)
   */
  async findNotesByTitle(
    parentObject: string,
    parentRecordId: string,
    options: { title?: string; titlePattern?: string }
  ): Promise<Note[]> {
    // List all notes for the parent record
    const notes = await this.listNotes({
      parent_object: parentObject,
      parent_record_id: parentRecordId,
    });

    // Filter by exact title or pattern
    if (options.title) {
      // Exact match (case-insensitive)
      return notes.filter(
        (note) => note.title.toLowerCase() === options.title!.toLowerCase()
      );
    }

    if (options.titlePattern) {
      const regex = globToRegex(options.titlePattern);
      return notes.filter((note) => regex.test(note.title));
    }

    return notes;
  }
}
