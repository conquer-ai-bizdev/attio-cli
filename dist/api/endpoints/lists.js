"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
const attributes_1 = require("./attributes");
class ListEndpoints {
    client;
    attributeEndpoints;
    constructor(client) {
        this.client = client;
        this.attributeEndpoints = new attributes_1.AttributeEndpoints(client);
    }
    async listLists(options) {
        const params = {};
        if (options?.limit)
            params.limit = options.limit;
        if (options?.offset)
            params.offset = options.offset;
        const response = await this.client.get('/lists', params);
        const validated = (0, validation_1.validate)(types_1.ListsResponseSchema, response);
        return validated.data;
    }
    async getList(listSlug) {
        const response = await this.client.get(`/lists/${listSlug}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListSchema, dataResponse.data);
    }
    async listEntries(listSlug, options) {
        const response = await this.client.post(`/lists/${listSlug}/entries/query`, {
            filter: options?.filter,
            sorts: options?.sorts,
            limit: options?.limit,
            offset: options?.offset,
        });
        const validated = (0, validation_1.validate)(types_1.ListEntriesResponseSchema, response);
        return validated.data;
    }
    async getEntry(listSlug, entryId) {
        const response = await this.client.get(`/lists/${listSlug}/entries/${entryId}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListEntrySchema, dataResponse.data);
    }
    async createEntry(listSlug, entryData) {
        const response = await this.client.post(`/lists/${listSlug}/entries`, entryData);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListEntrySchema, dataResponse.data);
    }
    async updateEntry(listSlug, entryId, data) {
        const response = await this.client.patch(`/lists/${listSlug}/entries/${entryId}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListEntrySchema, dataResponse.data);
    }
    async deleteEntry(listSlug, entryId) {
        await this.client.delete(`/lists/${listSlug}/entries/${entryId}`);
    }
    async assertEntry(listSlug, data) {
        const response = await this.client.put(`/lists/${listSlug}/entries`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListEntrySchema, dataResponse.data);
    }
    async listEntryAttributeValues(listSlug, entryId, attributeSlug, options) {
        const params = {};
        if (options?.show_historic)
            params.show_historic = options.show_historic;
        if (options?.limit)
            params.limit = options.limit;
        if (options?.offset)
            params.offset = options.offset;
        const response = await this.client.get(`/lists/${listSlug}/entries/${entryId}/attributes/${attributeSlug}/values`, params);
        const dataResponse = response;
        return dataResponse.data.map((item) => (0, validation_1.validate)(types_1.AttributeValueHistorySchema, item));
    }
    async createList(data) {
        const response = await this.client.post('/lists', data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListSchema, dataResponse.data);
    }
    async updateList(listSlug, data) {
        const response = await this.client.patch(`/lists/${listSlug}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ListSchema, dataResponse.data);
    }
    // Delegate attribute operations to AttributeEndpoints for consistency
    async listAttributes(listSlug) {
        return this.attributeEndpoints.listAttributes('lists', listSlug);
    }
    async getAttribute(listSlug, attributeSlug) {
        return this.attributeEndpoints.getAttribute('lists', listSlug, attributeSlug);
    }
}
exports.ListEndpoints = ListEndpoints;
//# sourceMappingURL=lists.js.map