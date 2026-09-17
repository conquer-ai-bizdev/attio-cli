import { AttioClient } from '../client';
import { CallRecording, CallRecordingSummary } from '../types';
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
export declare class CallRecordingEndpoints {
    private client;
    constructor(client: AttioClient);
    listCallRecordingsPage(meetingId: string, options?: ListCallRecordingsOptions): Promise<CallRecordingPage>;
    listAllCallRecordings(meetingId: string, options?: Omit<ListCallRecordingsOptions, 'cursor'>): Promise<CompleteCallRecordingInventory>;
    getCallRecording(meetingId: string, callRecordingId: string): Promise<CallRecording>;
}
//# sourceMappingURL=call-recordings.d.ts.map