import { AttioClient } from '../client';
import { Note } from '../types';
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
export declare class NoteEndpoints {
    private client;
    constructor(client: AttioClient);
    listNotes(options?: ListNotesOptions): Promise<Note[]>;
    listNotesPage(options?: ListNotesOptions): Promise<NotePage>;
    listAllNotes(options?: Omit<ListNotesOptions, 'offset'>): Promise<CompleteNoteInventory>;
    getNote(noteId: string): Promise<Note>;
    createNote(data: CreateNoteData): Promise<Note>;
    deleteNote(noteId: string): Promise<void>;
    updateNote(noteId: string, updates: {
        title?: string;
        content?: string;
        format?: 'plaintext' | 'markdown';
    }): Promise<Note>;
    /**
     * Find notes by title (exact match or glob pattern)
     */
    findNotesByTitle(parentObject: string, parentRecordId: string, options: {
        title?: string;
        titlePattern?: string;
    }): Promise<Note[]>;
}
//# sourceMappingURL=notes.d.ts.map