import { AttioClient } from '../client';
import { AttioRecord } from '../types';
export interface ListRecordsOptions {
    limit?: number;
    offset?: number;
    filter?: Record<string, unknown>;
    filter_view_id?: string;
    sorts?: Array<{
        attribute: string;
        field?: string;
        direction: 'asc' | 'desc';
    }>;
}
export interface RecordPage {
    data: AttioRecord[];
    pagination: {
        complete: boolean;
        offset: number;
        limit: number;
        next_offset: number | null;
    };
}
export interface CompleteRecordInventory {
    data: AttioRecord[];
    pagination: {
        complete: true;
        pages: number;
        items: number;
        duplicates_removed: number;
        next_offset: null;
    };
}
export interface CreateRecordData {
    data: Record<string, unknown>;
}
export interface UpdateRecordData {
    data: Record<string, unknown>;
}
export declare class RecordEndpoints {
    private client;
    constructor(client: AttioClient);
    listRecords(objectSlug: string, options?: ListRecordsOptions): Promise<AttioRecord[]>;
    listRecordsPage(objectSlug: string, options?: ListRecordsOptions): Promise<RecordPage>;
    listAllRecords(objectSlug: string, options?: Omit<ListRecordsOptions, 'offset'>): Promise<CompleteRecordInventory>;
    getRecord(objectSlug: string, recordId: string): Promise<AttioRecord>;
    getRecordsByIds(objectSlug: string, recordIds: string[]): Promise<AttioRecord[]>;
    createRecord(objectSlug: string, data: CreateRecordData): Promise<AttioRecord>;
    updateRecord(objectSlug: string, recordId: string, data: UpdateRecordData): Promise<AttioRecord>;
    deleteRecord(objectSlug: string, recordId: string): Promise<void>;
    mergeRecords(objectSlug: string, primaryRecordId: string, secondaryRecordId: string): Promise<{
        new_record_id: string;
    }>;
    assertRecord(objectSlug: string, matchingAttribute: string, data: CreateRecordData): Promise<AttioRecord>;
}
//# sourceMappingURL=records.d.ts.map