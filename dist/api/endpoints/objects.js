"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
const attributes_1 = require("./attributes");
class ObjectEndpoints {
    client;
    attributeEndpoints;
    constructor(client) {
        this.client = client;
        this.attributeEndpoints = new attributes_1.AttributeEndpoints(client);
    }
    async listObjects() {
        const response = await this.client.get('/objects');
        const validated = (0, validation_1.validate)(types_1.ObjectsResponseSchema, response);
        return validated.data;
    }
    async getObject(objectSlug) {
        const response = await this.client.get(`/objects/${objectSlug}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.ObjectSchema, dataResponse.data);
    }
    async listViewsPage(objectSlug, options = {}) {
        const limit = options.limit ?? 500;
        if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
            throw new Error('Object view limit must be an integer between 1 and 1000.');
        }
        const params = { limit };
        if (options.show_archived)
            params.show_archived = true;
        if (options.cursor)
            params.cursor = options.cursor;
        const response = await this.client.get(`/objects/${objectSlug}/views`, params);
        return (0, validation_1.validate)(types_1.ObjectViewsResponseSchema, response);
    }
    async listAllViews(objectSlug, options = {}) {
        const byId = new Map();
        let cursor;
        let pages = 0;
        let observedItems = 0;
        do {
            const page = await this.listViewsPage(objectSlug, {
                ...options,
                ...(cursor ? { cursor } : {}),
            });
            pages += 1;
            observedItems += page.data.length;
            for (const view of page.data)
                byId.set(view.id.view_id, view);
            cursor = page.pagination.next_cursor ?? undefined;
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
    // Delegate attribute operations to AttributeEndpoints for consistency
    async listAttributes(objectSlug) {
        return this.attributeEndpoints.listAttributes('objects', objectSlug);
    }
    async getAttribute(objectSlug, attributeSlug) {
        return this.attributeEndpoints.getAttribute('objects', objectSlug, attributeSlug);
    }
}
exports.ObjectEndpoints = ObjectEndpoints;
//# sourceMappingURL=objects.js.map