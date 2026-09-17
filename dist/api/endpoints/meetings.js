"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class MeetingEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listMeetingsPage(options = {}) {
        validateMeetingOptions(options);
        const limit = options.limit ?? 50;
        const params = { limit };
        if (options.cursor)
            params.cursor = options.cursor;
        if (options.sort)
            params.sort = options.sort;
        if (options.linkedObject)
            params.linked_object = options.linkedObject;
        if (options.linkedRecordId)
            params.linked_record_id = options.linkedRecordId;
        if (options.participants?.length)
            params.participants = options.participants.join(',');
        if (options.endsFrom)
            params.ends_from = options.endsFrom;
        if (options.startsBefore)
            params.starts_before = options.startsBefore;
        if (options.timezone)
            params.timezone = options.timezone;
        const response = await this.client.get('/meetings', params);
        const validated = (0, validation_1.validate)(types_1.MeetingsResponseSchema, response);
        return {
            data: validated.data,
            nextCursor: validated.pagination.next_cursor,
        };
    }
    async listAllMeetings(options = {}) {
        const byId = new Map();
        let cursor;
        let pages = 0;
        let observedItems = 0;
        do {
            const page = await this.listMeetingsPage({
                ...options,
                ...(cursor ? { cursor } : {}),
                limit: options.limit ?? 50,
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
    async getMeeting(meetingId) {
        const response = await this.client.get(`/meetings/${meetingId}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.MeetingSchema, dataResponse.data);
    }
}
exports.MeetingEndpoints = MeetingEndpoints;
function validateMeetingOptions(options) {
    const limit = options.limit ?? 50;
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        throw new Error('Meeting limit must be an integer between 1 and 50.');
    }
    if (Boolean(options.linkedObject) !== Boolean(options.linkedRecordId)) {
        throw new Error('--linked-object and --linked-record-id must be provided together.');
    }
}
//# sourceMappingURL=meetings.js.map