import { AttioClient } from '../client';
import { Meeting } from '../types';
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
export interface MeetingLink {
    object: string;
    record_id: string;
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
export declare class MeetingEndpoints {
    private client;
    constructor(client: AttioClient);
    listMeetingsPage(options?: ListMeetingsOptions): Promise<MeetingPage>;
    listAllMeetings(options?: Omit<ListMeetingsOptions, 'cursor'>): Promise<CompleteMeetingInventory>;
    getMeeting(meetingId: string): Promise<Meeting>;
    appendLinkedRecords(meetingId: string, linkedRecords: MeetingLink[]): Promise<Meeting>;
}
//# sourceMappingURL=meetings.d.ts.map