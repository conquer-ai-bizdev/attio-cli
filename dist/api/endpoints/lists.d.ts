import { AttioClient } from '../client';
import { List, ListEntry, AttributeValueHistory, Attribute } from '../types';
export interface ListOptions {
    limit?: number;
    offset?: number;
}
export interface ListEntriesOptions {
    limit?: number;
    offset?: number;
    filter?: Record<string, unknown>;
    sorts?: Array<{
        attribute: string;
        direction: 'asc' | 'desc';
    }>;
}
export interface CreateEntryData {
    data: {
        parent_record_id: string;
        parent_object: string;
        entry_values: Record<string, unknown>;
    };
}
export interface UpdateEntryData {
    data: {
        entry_values: Record<string, unknown>;
    };
}
export interface AssertEntryData {
    data: {
        parent_record_id?: string;
        parent_object?: string;
        entry_values: Record<string, unknown>;
    };
}
export interface ListEntryAttributeValuesOptions {
    show_historic?: boolean;
    limit?: number;
    offset?: number;
}
export interface CreateListData {
    data: {
        api_slug: string;
        name: string;
        parent_object: string;
        workspace_access?: 'full-access' | 'read-and-write' | 'read-only' | null;
        workspace_member_access: Array<{
            workspace_member_id: string;
            level: 'full-access' | 'read-and-write' | 'read-only';
        }>;
    };
}
export interface UpdateListData {
    data: {
        name?: string;
        workspace_access?: 'full-access' | 'read-and-write' | 'read-only' | null;
    };
}
export declare class ListEndpoints {
    private client;
    private attributeEndpoints;
    constructor(client: AttioClient);
    listLists(options?: ListOptions): Promise<List[]>;
    getList(listSlug: string): Promise<List>;
    listEntries(listSlug: string, options?: ListEntriesOptions): Promise<ListEntry[]>;
    getEntry(listSlug: string, entryId: string): Promise<ListEntry>;
    createEntry(listSlug: string, entryData: CreateEntryData): Promise<ListEntry>;
    updateEntry(listSlug: string, entryId: string, data: UpdateEntryData): Promise<ListEntry>;
    deleteEntry(listSlug: string, entryId: string): Promise<void>;
    assertEntry(listSlug: string, data: AssertEntryData): Promise<ListEntry>;
    listEntryAttributeValues(listSlug: string, entryId: string, attributeSlug: string, options?: ListEntryAttributeValuesOptions): Promise<AttributeValueHistory[]>;
    createList(data: CreateListData): Promise<List>;
    updateList(listSlug: string, data: UpdateListData): Promise<List>;
    listAttributes(listSlug: string): Promise<Attribute[]>;
    getAttribute(listSlug: string, attributeSlug: string): Promise<Attribute>;
}
//# sourceMappingURL=lists.d.ts.map