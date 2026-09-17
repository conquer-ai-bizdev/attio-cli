"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class EmailEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listEmailsPage(options) {
        validateEmailFilters(options);
        const limit = options.limit ?? 25;
        if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
            throw new Error('Email limit must be an integer between 1 and 50.');
        }
        const params = { limit };
        if (options.cursor)
            params.cursor = options.cursor;
        if (options.linkedObject)
            params.linked_object = options.linkedObject;
        if (options.linkedRecordIds?.length) {
            params.linked_record_ids = options.linkedRecordIds.join(',');
        }
        if (options.participants?.length) {
            params.participants = options.participants.join(',');
        }
        if (options.domain)
            params.domain = options.domain;
        if (options.sentAfter)
            params.sent_after = options.sentAfter;
        if (options.sentBefore)
            params.sent_before = options.sentBefore;
        if (options.excludeAutomatedParticipants !== undefined) {
            params.exclude_automated_participants =
                options.excludeAutomatedParticipants;
        }
        const response = await this.client.get('/emails', params);
        const validated = (0, validation_1.validate)(types_1.EmailsResponseSchema, response);
        return {
            data: validated.data,
            nextCursor: validated.pagination.next_cursor,
        };
    }
    async listAllEmails(options) {
        const byId = new Map();
        let cursor;
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
exports.EmailEndpoints = EmailEndpoints;
function validateEmailFilters(options) {
    const hasLinkedRecords = Boolean(options.linkedObject && options.linkedRecordIds?.length);
    const hasParticipants = Boolean(options.participants?.length);
    const hasDomain = Boolean(options.domain?.trim());
    if (!hasLinkedRecords && !hasParticipants && !hasDomain) {
        throw new Error('Email search requires linked records, at least one participant, or a domain.');
    }
    if (Boolean(options.linkedObject) !== Boolean(options.linkedRecordIds?.length)) {
        throw new Error('--linked-object and --linked-record-id must be provided together.');
    }
    if ((options.linkedRecordIds?.length ?? 0) > 10) {
        throw new Error('Email search accepts at most 10 linked record IDs.');
    }
    if ((options.participants?.length ?? 0) > 10) {
        throw new Error('Email search accepts at most 10 participant addresses.');
    }
}
//# sourceMappingURL=emails.js.map