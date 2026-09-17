import { AttioClient } from '../client';
import { Email, EmailsResponseSchema } from '../types';
import { validate } from '../../utils/validation';

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

export class EmailEndpoints {
  constructor(private client: AttioClient) {}

  async listEmailsPage(options: ListEmailsOptions): Promise<EmailPage> {
    validateEmailFilters(options);
    const limit = options.limit ?? 25;
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new Error('Email limit must be an integer between 1 and 50.');
    }

    const params: Record<string, unknown> = { limit };
    if (options.cursor) params.cursor = options.cursor;
    if (options.linkedObject) params.linked_object = options.linkedObject;
    if (options.linkedRecordIds?.length) {
      params.linked_record_ids = options.linkedRecordIds.join(',');
    }
    if (options.participants?.length) {
      params.participants = options.participants.join(',');
    }
    if (options.domain) params.domain = options.domain;
    if (options.sentAfter) params.sent_after = options.sentAfter;
    if (options.sentBefore) params.sent_before = options.sentBefore;
    if (options.excludeAutomatedParticipants !== undefined) {
      params.exclude_automated_participants =
        options.excludeAutomatedParticipants;
    }

    const response = await this.client.get('/emails', params);
    const validated = validate(EmailsResponseSchema, response);
    return {
      data: validated.data,
      nextCursor: validated.pagination.next_cursor,
    };
  }

  async listAllEmails(
    options: Omit<ListEmailsOptions, 'cursor'>
  ): Promise<CompleteEmailInventory> {
    const byId = new Map<string, Email>();
    let cursor: string | undefined;
    let pages = 0;
    let observedItems = 0;

    do {
      const page = await this.listEmailsPage({
        ...options,
        ...(cursor ? { cursor } : {}),
        limit: options.limit ?? 50,
      });
      pages += 1;
      observedItems += page.data.length;
      for (const email of page.data) {
        byId.set(email.id.email_id, email);
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
}

function validateEmailFilters(options: ListEmailsOptions): void {
  const hasLinkedRecords = Boolean(
    options.linkedObject && options.linkedRecordIds?.length
  );
  const hasParticipants = Boolean(options.participants?.length);
  const hasDomain = Boolean(options.domain?.trim());

  if (!hasLinkedRecords && !hasParticipants && !hasDomain) {
    throw new Error(
      'Email search requires linked records, at least one participant, or a domain.'
    );
  }
  if (
    Boolean(options.linkedObject) !== Boolean(options.linkedRecordIds?.length)
  ) {
    throw new Error(
      '--linked-object and --linked-record-id must be provided together.'
    );
  }
  if ((options.linkedRecordIds?.length ?? 0) > 10) {
    throw new Error('Email search accepts at most 10 linked record IDs.');
  }
  if ((options.participants?.length ?? 0) > 10) {
    throw new Error('Email search accepts at most 10 participant addresses.');
  }
}
