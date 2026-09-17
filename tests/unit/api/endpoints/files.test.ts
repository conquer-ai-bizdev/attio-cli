import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { FileEndpoints } from '../../../../src/api/endpoints/files';

const file = (id: string) => ({
  id: { workspace_id: 'workspace-id', file_id: id },
  object_id: 'object-id',
  object_slug: 'deals',
  record_id: 'record-id',
  storage_provider: 'attio' as const,
  created_by_actor: { type: 'api-token' as const, id: 'token-id' },
  created_at: '2026-09-17T00:00:00.000Z',
  file_type: 'file' as const,
  name: 'proposal.pdf',
  content_type: 'application/pdf',
  content_size: 123,
  parent_folder_id: null,
});

describe('FileEndpoints', () => {
  let mockClient: AttioClient;
  let files: FileEndpoints;

  beforeEach(() => {
    mockClient = { get: vi.fn() } as unknown as AttioClient;
    files = new FileEndpoints(mockClient);
  });

  it('lists files for an exact record', async () => {
    vi.mocked(mockClient.get).mockResolvedValue({
      data: [file('one')],
      pagination: { next_cursor: null },
    });

    const result = await files.listFilesPage('deals', 'record-id');

    expect(mockClient.get).toHaveBeenCalledWith('/files', {
      object: 'deals',
      record_id: 'record-id',
      limit: 50,
    });
    expect(result.data[0].id.file_id).toBe('one');
  });

  it('follows cursors through empty pages', async () => {
    vi.mocked(mockClient.get)
      .mockResolvedValueOnce({
        data: [file('one')],
        pagination: { next_cursor: 'next' },
      })
      .mockResolvedValueOnce({
        data: [],
        pagination: { next_cursor: 'last' },
      })
      .mockResolvedValueOnce({
        data: [file('two')],
        pagination: { next_cursor: null },
      });

    const result = await files.listAllFiles('deals', 'record-id');

    expect(result.data).toHaveLength(2);
    expect(result.pagination.complete).toBe(true);
    expect(result.pagination.pages).toBe(3);
  });
});
