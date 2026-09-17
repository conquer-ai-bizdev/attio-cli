import { describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { CommentEndpoints } from '../../../../src/api/endpoints/comments';

const comment = {
  id: { workspace_id: 'workspace-id', comment_id: 'comment-id' },
  thread_id: 'comment-id',
  content_plaintext: 'Review this deal',
  entry: null,
  record: { object_id: 'object-id', record_id: 'record-id' },
  resolved_at: null,
  resolved_by: null,
  created_at: '2026-09-17T00:00:00.000Z',
  author: { type: 'workspace-member' as const, id: 'member-id' },
};

describe('CommentEndpoints', () => {
  it('creates a record comment with an explicit author', async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue({ data: comment }),
    } as unknown as AttioClient;
    const comments = new CommentEndpoints(mockClient);

    const result = await comments.createRecordComment('deals', 'record-id', {
      content: 'Review this deal',
      authorId: 'member-id',
    });

    expect(mockClient.post).toHaveBeenCalledWith('/comments', {
      data: {
        format: 'plaintext',
        content: 'Review this deal',
        author: { type: 'workspace-member', id: 'member-id' },
        record: { object: 'deals', record_id: 'record-id' },
      },
    });
    expect(result.id.comment_id).toBe('comment-id');
  });
});
