import { describe, it, expect, beforeAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { MeetingEndpoints } from '../../src/api/endpoints/meetings';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Meetings Integration Tests (Read-Only)', () => {
  let meetingApi: MeetingEndpoints;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    meetingApi = new MeetingEndpoints(new AttioClient());
  });

  it('lists a live page using the current response shape', async () => {
    const page = await meetingApi.listMeetingsPage({ limit: 5 });

    expect(page.data).toBeInstanceOf(Array);
    expect(page.data.length).toBeLessThanOrEqual(5);
    expect(
      page.nextCursor === null || typeof page.nextCursor === 'string'
    ).toBe(true);
    if (page.data.length > 0) {
      const meeting = page.data[0];
      expect(meeting.id.meeting_id).toBeDefined();
      expect(meeting.start).toBeDefined();
      expect(meeting.end).toBeDefined();
      expect(meeting.participants).toBeInstanceOf(Array);
      expect(meeting.linked_records).toBeInstanceOf(Array);
    }
  });

  it('gets a live meeting by ID', async () => {
    const page = await meetingApi.listMeetingsPage({ limit: 1 });
    if (page.data.length === 0) return;

    const meetingId = page.data[0].id.meeting_id;
    const meeting = await meetingApi.getMeeting(meetingId);
    expect(meeting.id.meeting_id).toBe(meetingId);
  });

  it('returns a completion receipt for an interval inventory', async () => {
    const result = await meetingApi.listAllMeetings({
      endsFrom: '2026-09-01T00:00:00Z',
      startsBefore: '2026-09-02T00:00:00Z',
    });

    expect(result.pagination.complete).toBe(true);
    expect(result.pagination.next_cursor).toBeNull();
    expect(result.pagination.items).toBe(result.data.length);
  });
});
