import { AttioClient } from '../client';
import { MeetingsResponseSchema, MeetingSchema, Meeting } from '../types';
import { validate } from '../../utils/validation';

export interface ListMeetingsOptions {
  limit?: number;
  offset?: number;
  sort?: 'start_asc' | 'start_desc';
  linked_object?: string;
  linked_record_id?: string;
  organizer?: string;
  attendee?: string;
}

export class MeetingEndpoints {
  constructor(private client: AttioClient) {}

  async listMeetings(options?: ListMeetingsOptions): Promise<Meeting[]> {
    const params: Record<string, unknown> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;
    if (options?.sort) params.sort = options.sort;
    if (options?.linked_object) params.linked_object = options.linked_object;
    if (options?.linked_record_id)
      params.linked_record_id = options.linked_record_id;
    if (options?.organizer) params.organizer = options.organizer;
    if (options?.attendee) params.attendee = options.attendee;

    const response = await this.client.get('/meetings', params);
    const validated = validate(MeetingsResponseSchema, response);
    return validated.data;
  }

  async getMeeting(meetingId: string): Promise<Meeting> {
    const response = await this.client.get(`/meetings/${meetingId}`);
    const dataResponse = response as { data: unknown };
    return validate(MeetingSchema, dataResponse.data);
  }
}
