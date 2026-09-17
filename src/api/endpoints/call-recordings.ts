import { AttioClient } from '../client';
import {
  CallRecording,
  CallRecordingSchema,
  CallRecordingSummary,
  CallRecordingsResponseSchema,
} from '../types';
import { validate } from '../../utils/validation';

export interface ListCallRecordingsOptions {
  limit?: number;
  cursor?: string;
}

export interface CallRecordingPage {
  data: CallRecordingSummary[];
  nextCursor: string | null;
}

export interface CompleteCallRecordingInventory {
  data: CallRecordingSummary[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_cursor: null;
  };
}

export class CallRecordingEndpoints {
  constructor(private client: AttioClient) {}

  async listCallRecordingsPage(
    meetingId: string,
    options: ListCallRecordingsOptions = {}
  ): Promise<CallRecordingPage> {
    const limit = options.limit ?? 50;
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new Error(
        'Call recording limit must be an integer between 1 and 50.'
      );
    }

    const params: Record<string, unknown> = { limit };
    if (options.cursor) params.cursor = options.cursor;
    const response = await this.client.get(
      `/meetings/${meetingId}/call_recordings`,
      params
    );
    const validated = validate(CallRecordingsResponseSchema, response);
    return {
      data: validated.data,
      nextCursor: validated.pagination.next_cursor,
    };
  }

  async listAllCallRecordings(
    meetingId: string,
    options: Omit<ListCallRecordingsOptions, 'cursor'> = {}
  ): Promise<CompleteCallRecordingInventory> {
    const byId = new Map<string, CallRecordingSummary>();
    let cursor: string | undefined;
    let pages = 0;
    let observedItems = 0;

    do {
      const page = await this.listCallRecordingsPage(meetingId, {
        ...options,
        ...(cursor ? { cursor } : {}),
        limit: options.limit ?? 50,
      });
      pages += 1;
      observedItems += page.data.length;
      for (const recording of page.data) {
        byId.set(recording.id.call_recording_id, recording);
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

  async getCallRecording(
    meetingId: string,
    callRecordingId: string
  ): Promise<CallRecording> {
    const response = await this.client.get(
      `/meetings/${meetingId}/call_recordings/${callRecordingId}`
    );
    const dataResponse = response as { data: unknown };
    return validate(CallRecordingSchema, dataResponse.data);
  }
}
