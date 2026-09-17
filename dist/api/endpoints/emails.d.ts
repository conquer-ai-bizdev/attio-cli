import { AttioClient } from '../client';
import { Email } from '../types';
export interface ListEmailsOptions {
    limit?: number;
    cursor?: string;
    linkedObject?: string;
    linkedRecordIds?: string[];
    participants?: string[];
    domain?: string;
    sentAfter?: string;
    sentBefore?: string;
    excludeAutomatedParticipants?: boolean;
}
export interface EmailPage {
    data: Email[];
    nextCursor: string | null;
}
export interface CompleteEmailInventory {
    data: Email[];
    pagination: {
        complete: true;
        pages: number;
        items: number;
        duplicates_removed: number;
        next_cursor: null;
    };
}
export declare class EmailEndpoints {
    private client;
    constructor(client: AttioClient);
    listEmailsPage(options: ListEmailsOptions): Promise<EmailPage>;
    listAllEmails(options: Omit<ListEmailsOptions, 'cursor'>): Promise<CompleteEmailInventory>;
}
//# sourceMappingURL=emails.d.ts.map