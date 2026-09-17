import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { MeetingEndpoints } from '../../../../src/api/endpoints/meetings';

const meeting = (meetingId: string) => ({
  id: { workspace_id: 'workspace-id', meeting_id: meetingId },
  title: 'Customer call',
  description: '',
  is_all_day: false,
  start: { datetime: '2026-09-17T10:00:00.000Z', timezone: 'UTC' },
  end: { datetime: '2026-09-17T10:30:00.000Z', timezone: 'UTC' },
  participants: [],
  linked_records: [],
  created_at: '2026-09-16T10:00:00.000Z',
  created_by_actor: { type: 'workspace-member', id: 'member-id' },
});

describe('MeetingEndpoints', () => {
  let mockClient: AttioClient;
  let meetings: MeetingEndpoints;

  beforeEach(() => {
    mockClient = { get: vi.fn() } as unknown as AttioClient;
    meetings = new MeetingEndpoints(mockClient);
  });

  it('uses the current filter and pagination parameter names', async () => {
    vi.mocked(mockClient.get).mockResolvedValue({
      data: [],
      pagination: { next_cursor: null },
    });

    await meetings.listMeetingsPage({
      limit: 50,
      participants: ['buyer@example.com'],
      endsFrom: '2026-08-17T00:00:00Z',
      startsBefore: '2026-09-17T00:00:00Z',
      timezone: 'UTC',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/meetings', {
      limit: 50,
      participants: 'buyer@example.com',
      ends_from: '2026-08-17T00:00:00Z',
      starts_before: '2026-09-17T00:00:00Z',
      timezone: 'UTC',
    });
  });

  it('continues through empty pages while the cursor exists', async () => {
    vi.mocked(mockClient.get)
      .mockResolvedValueOnce({
        data: [meeting('first')],
        pagination: { next_cursor: 'cursor-1' },
      })
      .mockResolvedValueOnce({
        data: [],
        pagination: { next_cursor: 'cursor-2' },
      })
      .mockResolvedValueOnce({
        data: [meeting('last')],
        pagination: { next_cursor: null },
      });

    const result = await meetings.listAllMeetings();

    expect(result.data.map((item) => item.id.meeting_id)).toEqual([
      'first',
      'last',
    ]);
    expect(result.pagination).toEqual({
      complete: true,
      pages: 3,
      items: 2,
      duplicates_removed: 0,
      next_cursor: null,
    });
  });

  it('requires linked object and record filters together', async () => {
    await expect(
      meetings.listMeetingsPage({ linkedObject: 'companies' })
    ).rejects.toThrow('must be provided together');
    expect(mockClient.get).not.toHaveBeenCalled();
  });
});
