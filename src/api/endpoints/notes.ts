import { AttioClient } from '../client';
import { NotesResponseSchema, NoteSchema, Note } from '../types';
import { validate } from '../../utils/validation';
import { markdownLinesMatch } from '../../utils/markdown';

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

export interface ListNotesOptions {
  limit?: number;
  offset?: number;
  parent_object?: string;
  parent_record_id?: string;
}

export interface NotePage {
  data: Note[];
  pagination: {
    complete: boolean;
    offset: number;
    limit: number;
    next_offset: number | null;
  };
}

export interface CompleteNoteInventory {
  data: Note[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_offset: null;
  };
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
    return (await this.listNotesPage(options)).data;
  }

  async listNotesPage(options: ListNotesOptions = {}): Promise<NotePage> {
    validateNoteOptions(options);
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const params: Record<string, unknown> = { limit, offset };
    if (options.parent_object) params.parent_object = options.parent_object;
    if (options.parent_record_id)
      params.parent_record_id = options.parent_record_id;

    const response = await this.client.get('/notes', params);
    const validated = validate(NotesResponseSchema, response);
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

  async listAllNotes(
    options: Omit<ListNotesOptions, 'offset'> = {}
  ): Promise<CompleteNoteInventory> {
    const limit = options.limit ?? 50;
    validateNoteOptions({ ...options, limit });
    const byId = new Map<string, Note>();
    let offset = 0;
    let pages = 0;
    let observedItems = 0;

    while (true) {
      const page = await this.listNotesPage({ ...options, limit, offset });
      pages += 1;
      observedItems += page.data.length;
      for (const note of page.data) byId.set(note.id.note_id, note);
      if (page.pagination.complete) break;
      offset = page.pagination.next_offset!;
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

  async createVerifiedNote(data: CreateNoteData): Promise<Note> {
    const note = await this.createNote(data);
    if (data.data.format !== 'markdown') return note;

    const stored = note.content_markdown;
    if (
      typeof stored === 'string' &&
      markdownLinesMatch(data.data.content, stored)
    ) {
      return note;
    }

    try {
      await this.deleteNote(note.id.note_id);
    } catch (cleanupError) {
      const detail =
        cleanupError instanceof Error
          ? cleanupError.message
          : String(cleanupError);
      throw new Error(
        `Attio changed the Markdown note content, and cleanup of note ${note.id.note_id} failed: ${detail}`
      );
    }
    throw new Error(
      'Attio changed the Markdown note content. The incomplete note was removed.'
    );
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.client.delete(`/notes/${noteId}`);
  }

  async updateNote(
    noteId: string,
    updates: {
      title?: string;
      content?: string;
      format?: 'plaintext' | 'markdown';
    }
  ): Promise<Note> {
    const response = await this.client.patch(`/notes/${noteId}`, {
      data: updates,
    });
    const dataResponse = response as { data: unknown };
    return validate(NoteSchema, dataResponse.data);
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
    const notes = (
      await this.listAllNotes({
        parent_object: parentObject,
        parent_record_id: parentRecordId,
      })
    ).data;

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

function validateNoteOptions(options: ListNotesOptions): void {
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error('Note limit must be an integer between 1 and 50.');
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error('Note offset must be a non-negative integer.');
  }
  if (Boolean(options.parent_object) !== Boolean(options.parent_record_id)) {
    throw new Error(
      '--parent-object and --parent-record-id must be provided together.'
    );
  }
}
