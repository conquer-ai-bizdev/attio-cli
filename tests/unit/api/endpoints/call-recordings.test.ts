import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { CallRecordingEndpoints } from '../../../../src/api/endpoints/call-recordings';

const recording = (id: string) => ({
  id: {
    workspace_id: 'workspace-id',
    meeting_id: 'meeting-id',
    call_recording_id: id,
  },
  status: 'completed' as const,
  web_url: 'https://app.attio.com/example/calls/meeting-id/recording-id',
  created_by_actor: { type: 'system' as const, id: null },
  created_at: '2026-09-17T00:00:00.000Z',
});

describe('CallRecordingEndpoints', () => {
  let mockClient: AttioClient;
  let recordings: CallRecordingEndpoints;

  beforeEach(() => {
    mockClient = { get: vi.fn() } as unknown as AttioClient;
    recordings = new CallRecordingEndpoints(mockClient);
  });

  it('returns one page and its cursor', async () => {
    vi.mocked(mockClient.get).mockResolvedValue({
      data: [recording('one')],
      pagination: { next_cursor: 'next' },
    });

    const result = await recordings.listCallRecordingsPage('meeting-id', {
      limit: 50,
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/meetings/meeting-id/call_recordings',
      { limit: 50 }
    );
    expect(result.nextCursor).toBe('next');
  });

  it('traverses every cursor and reports completion', async () => {
    vi.mocked(mockClient.get)
      .mockResolvedValueOnce({
        data: [recording('one')],
        pagination: { next_cursor: 'next' },
      })
      .mockResolvedValueOnce({
        data: [recording('two')],
        pagination: { next_cursor: null },
      });

    const result = await recordings.listAllCallRecordings('meeting-id');

    expect(result.data.map((item) => item.id.call_recording_id)).toEqual([
      'one',
      'two',
    ]);
    expect(result.pagination).toEqual({
      complete: true,
      pages: 2,
      items: 2,
      duplicates_removed: 0,
      next_cursor: null,
    });
  });
});
