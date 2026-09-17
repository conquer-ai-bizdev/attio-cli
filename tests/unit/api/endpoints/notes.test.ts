import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { NoteEndpoints } from '../../../../src/api/endpoints/notes';

const note = {
  id: {
    workspace_id: 'f7859c0b-3bf2-46b4-a561-8bb105ed30d5',
    note_id: '353c040e-338c-4b1f-b8b5-4ee4757f2ad2',
  },
  title: 'Updated title',
  content_plaintext: 'Updated body',
  content_markdown: 'Updated body',
  format: 'markdown',
  parent_object: 'deals',
  parent_record_id: '2056e2b4-0502-4c41-8523-2b75020f437a',
  created_at: '2026-09-17T12:00:00.000Z',
  created_by_actor: {
    type: 'workspace-member',
    id: 'e8fe09cb-b72d-479e-83c2-1cdd3d376b8e',
  },
};

describe('NoteEndpoints', () => {
  beforeEach(() => {
    process.env.ATTIO_API_KEY = 'test-api-key';
  });

  it('updates a note in place through the current PATCH endpoint', async () => {
    const client = {
      patch: vi.fn().mockResolvedValue({ data: note }),
    } as unknown as AttioClient;
    const notes = new NoteEndpoints(client);

    const result = await notes.updateNote(note.id.note_id, {
      title: note.title,
      content: note.content_markdown,
      format: 'markdown',
    });

    expect(client.patch).toHaveBeenCalledWith(`/notes/${note.id.note_id}`, {
      data: {
        title: note.title,
        content: note.content_markdown,
        format: 'markdown',
      },
    });
    expect(result.id.note_id).toBe(note.id.note_id);
  });

  it('deletes the exact note ID through the current DELETE endpoint', async () => {
    const client = {
      delete: vi.fn().mockResolvedValue({}),
    } as unknown as AttioClient;
    const notes = new NoteEndpoints(client);

    await notes.deleteNote(note.id.note_id);

    expect(client.delete).toHaveBeenCalledWith(`/notes/${note.id.note_id}`);
  });
});
