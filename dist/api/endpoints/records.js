"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
const errors_1 = require("../errors");
class RecordEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listRecords(objectSlug, options) {
        return (await this.listRecordsPage(objectSlug, options)).data;
    }
    async listRecordsPage(objectSlug, options = {}) {
        const limit = options.limit ?? 50;
        const offset = options.offset ?? 0;
        validateOffsetPage(limit, offset, 'Record');
        const body = { limit, offset };
        if (options.filter !== undefined && options.filter_view_id !== undefined) {
            throw new Error('Cannot combine a record filter with a saved view.');
        }
        if (options.filter !== undefined)
            body.filter = options.filter;
        if (options.filter_view_id !== undefined) {
            body.filter_view_id = options.filter_view_id;
        }
        if (options.sorts !== undefined) {
            body.sorts = options.sorts.map((sort) => sort.attribute === 'last_interaction' && sort.field === undefined
                ? { ...sort, field: 'interacted_at' }
                : sort);
        }
        const response = await this.client.post(`/objects/${objectSlug}/records/query`, body);
        const validated = (0, validation_1.validate)(types_1.RecordsResponseSchema, response);
        const complete = validated.data.length < limit;
        return {
            data: validated.data,
            pagination: {
                complete,
                offset,
                limit,
                next_offset: complete ? null : offset + validated.data.length,
            },
        };
    }
    async listAllRecords(objectSlug, options = {}) {
        const limit = options.limit ?? 50;
        validateOffsetPage(limit, 0, 'Record');
        const byId = new Map();
        let offset = 0;
        let pages = 0;
        let observedItems = 0;
        while (true) {
            const page = await this.listRecordsPage(objectSlug, {
                ...options,
                limit,
                offset,
            });
            pages += 1;
            observedItems += page.data.length;
            for (const record of page.data)
                byId.set(record.id.record_id, record);
            if (page.pagination.complete)
                break;
            offset = page.pagination.next_offset;
        }
        const data = [...byId.values()];
        return {
            data,
            pagination: {
                complete: true,
                pages,
                items: data.length,
                duplicates_removed: observedItems - data.length,
                next_offset: null,
            },
        };
    }
    async getRecord(objectSlug, recordId) {
        const response = await this.client.get(`/objects/${objectSlug}/records/${recordId}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.RecordSchema, dataResponse.data);
    }
    async getRecordsByIds(objectSlug, recordIds) {
        const uniqueIds = [...new Set(recordIds)];
        const records = [];
        for (let index = 0; index < uniqueIds.length; index += 10) {
            const batch = uniqueIds.slice(index, index + 10);
            const results = await Promise.all(batch.map(async (recordId) => {
                try {
                    return await this.getRecord(objectSlug, recordId);
                }
                catch (error) {
                    if (error instanceof errors_1.NotFoundError)
                        return null;
                    throw error;
                }
            }));
            records.push(...results.filter((record) => record !== null));
        }
        return records;
    }
    async createRecord(objectSlug, data) {
        const response = await this.client.post(`/objects/${objectSlug}/records`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.RecordSchema, dataResponse.data);
    }
    async updateRecord(objectSlug, recordId, data) {
        const response = await this.client.patch(`/objects/${objectSlug}/records/${recordId}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.RecordSchema, dataResponse.data);
    }
    async deleteRecord(objectSlug, recordId) {
        await this.client.delete(`/objects/${objectSlug}/records/${recordId}`);
    }
    async mergeRecords(objectSlug, primaryRecordId, secondaryRecordId) {
        if (primaryRecordId === secondaryRecordId) {
            throw new Error('Primary and secondary record IDs must be different.');
        }
        const response = await this.client.post(`/objects/${objectSlug}/records/merge`, {
            data: {
                primary_record_id: primaryRecordId,
                secondary_record_id: secondaryRecordId,
            },
        });
        const data = response.data;
        if (!data || typeof data.new_record_id !== 'string') {
            throw new Error('Attio returned an invalid record merge response.');
        }
        return { new_record_id: data.new_record_id };
    }
    async assertRecord(objectSlug, matchingAttribute, data) {
        const response = await this.client.put(`/objects/${objectSlug}/records?matching_attribute=${matchingAttribute}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.RecordSchema, dataResponse.data);
    }
}
exports.RecordEndpoints = RecordEndpoints;
function validateOffsetPage(limit, offset, label) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        throw new Error(`${label} limit must be an integer between 1 and 50.`);
    }
    if (!Number.isInteger(offset) || offset < 0) {
        throw new Error(`${label} offset must be a non-negative integer.`);
    }
}
//# sourceMappingURL=records.js.map