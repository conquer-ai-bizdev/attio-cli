import { AttioClient } from '../client';
import { MeetingsResponseSchema, MeetingSchema, Meeting } from '../types';
import { validate } from '../../utils/validation';

export interface ListMeetingsOptions {
  limit?: number;
  cursor?: string;
  sort?: 'start_asc' | 'start_desc';
  linkedObject?: string;
  linkedRecordId?: string;
  participants?: string[];
  endsFrom?: string;
  startsBefore?: string;
  timezone?: string;
}

export interface MeetingPage {
  data: Meeting[];
  nextCursor: string | null;
}

export interface CompleteMeetingInventory {
  data: Meeting[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_cursor: null;
  };
}

export class MeetingEndpoints {
  constructor(private client: AttioClient) {}

  async listMeetingsPage(
    options: ListMeetingsOptions = {}
  ): Promise<MeetingPage> {
    validateMeetingOptions(options);
    const limit = options.limit ?? 50;
    const params: Record<string, unknown> = { limit };
    if (options.cursor) params.cursor = options.cursor;
    if (options.sort) params.sort = options.sort;
    if (options.linkedObject) params.linked_object = options.linkedObject;
    if (options.linkedRecordId)
      params.linked_record_id = options.linkedRecordId;
    if (options.participants?.length)
      params.participants = options.participants.join(',');
    if (options.endsFrom) params.ends_from = options.endsFrom;
    if (options.startsBefore) params.starts_before = options.startsBefore;
    if (options.timezone) params.timezone = options.timezone;

    const response = await this.client.get('/meetings', params);
    const validated = validate(MeetingsResponseSchema, response);
    return {
      data: validated.data,
      nextCursor: validated.pagination.next_cursor,
    };
  }

  async listAllMeetings(
    options: Omit<ListMeetingsOptions, 'cursor'> = {}
  ): Promise<CompleteMeetingInventory> {
    const byId = new Map<string, Meeting>();
    let cursor: string | undefined;
    let pages = 0;
    let observedItems = 0;

    do {
      const page = await this.listMeetingsPage({
        ...options,
        ...(cursor ? { cursor } : {}),
        limit: options.limit ?? 200,
      });
      pages += 1;
      observedItems += page.data.length;
      for (const meeting of page.data) {
        byId.set(meeting.id.meeting_id, meeting);
      }
      cursor = page.nextCursor ?? undefined;
    } while (cursor);

    const data = [...byId.values()];
    return {
      data,
      pagination: {
        complete: true,
        pages,
        items: data.length,
        duplicates_removed: observedItems - data.length,
        next_cursor: null,
      },
    };
  }

  async getMeeting(meetingId: string): Promise<Meeting> {
    const response = await this.client.get(`/meetings/${meetingId}`);
    const dataResponse = response as { data: unknown };
    return validate(MeetingSchema, dataResponse.data);
  }
}

function validateMeetingOptions(options: ListMeetingsOptions): void {
  const limit = options.limit ?? 50;
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new Error('Meeting limit must be an integer between 1 and 200.');
  }
  if (Boolean(options.linkedObject) !== Boolean(options.linkedRecordId)) {
    throw new Error(
      '--linked-object and --linked-record-id must be provided together.'
    );
  }
}
