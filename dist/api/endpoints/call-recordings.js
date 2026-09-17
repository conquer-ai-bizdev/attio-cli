"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallRecordingEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class CallRecordingEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listCallRecordingsPage(meetingId, options = {}) {
        const limit = options.limit ?? 50;
        if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
            throw new Error('Call recording limit must be an integer between 1 and 50.');
        }
        const params = { limit };
        if (options.cursor)
            params.cursor = options.cursor;
        const response = await this.client.get(`/meetings/${meetingId}/call_recordings`, params);
        const validated = (0, validation_1.validate)(types_1.CallRecordingsResponseSchema, response);
        return {
            data: validated.data,
            nextCursor: validated.pagination.next_cursor,
        };
    }
    async listAllCallRecordings(meetingId, options = {}) {
        const byId = new Map();
        let cursor;
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
    async getCallRecording(meetingId, callRecordingId) {
        const response = await this.client.get(`/meetings/${meetingId}/call_recordings/${callRecordingId}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.CallRecordingSchema, dataResponse.data);
    }
}
exports.CallRecordingEndpoints = CallRecordingEndpoints;
//# sourceMappingURL=call-recordings.js.map