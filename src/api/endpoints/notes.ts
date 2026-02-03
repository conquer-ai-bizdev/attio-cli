import { AttioClient } from '../client';
import { NotesResponseSchema, NoteSchema, Note } from '../types';
import { validate } from '../../utils/validation';

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

export interface UpdateNoteData {
  data: {
    title?: string;
    format?: 'plaintext' | 'markdown';
    content?: string;
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

  async updateNote(noteId: string, data: UpdateNoteData): Promise<Note> {
    const response = await this.client.patch(`/notes/${noteId}`, data);
    const dataResponse = response as { data: unknown };
    return validate(NoteSchema, dataResponse.data);
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.client.delete(`/notes/${noteId}`);
  }
}
