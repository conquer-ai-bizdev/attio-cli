"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class AttributeEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    // Core Attribute CRUD
    async listAttributes(target, identifier, options) {
        const params = {};
        if (options?.show_archived)
            params.show_archived = options.show_archived;
        if (options?.limit)
            params.limit = options.limit;
        if (options?.offset)
            params.offset = options.offset;
        const response = await this.client.get(`/${target}/${identifier}/attributes`, params);
        const validated = (0, validation_1.validate)(types_1.AttributesResponseSchema, response);
        return validated.data;
    }
    async getAttribute(target, identifier, attributeSlug) {
        const response = await this.client.get(`/${target}/${identifier}/attributes/${attributeSlug}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.AttributeSchema, dataResponse.data);
    }
    async createAttribute(target, identifier, data) {
        const response = await this.client.post(`/${target}/${identifier}/attributes`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.AttributeSchema, dataResponse.data);
    }
    async updateAttribute(target, identifier, attributeSlug, data) {
        const response = await this.client.patch(`/${target}/${identifier}/attributes/${attributeSlug}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.AttributeSchema, dataResponse.data);
    }
    async deleteAttribute(target, identifier, attributeSlug) {
        await this.client.delete(`/${target}/${identifier}/attributes/${attributeSlug}`);
    }
    // Select Options
    async listSelectOptions(target, identifier, attributeSlug, options) {
        const params = {};
        if (options?.show_archived)
            params.show_archived = options.show_archived;
        if (options?.limit)
            params.limit = options.limit;
        if (options?.offset)
            params.offset = options.offset;
        const response = await this.client.get(`/${target}/${identifier}/attributes/${attributeSlug}/options`, params);
        const validated = (0, validation_1.validate)(types_1.SelectOptionsResponseSchema, response);
        return validated.data;
    }
    async createSelectOption(target, identifier, attributeSlug, data) {
        const response = await this.client.post(`/${target}/${identifier}/attributes/${attributeSlug}/options`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.SelectOptionSchema, dataResponse.data);
    }
    async updateSelectOption(target, identifier, attributeSlug, optionId, data) {
        const response = await this.client.patch(`/${target}/${identifier}/attributes/${attributeSlug}/options/${optionId}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.SelectOptionSchema, dataResponse.data);
    }
    async deleteSelectOption(target, identifier, attributeSlug, optionId) {
        await this.client.delete(`/${target}/${identifier}/attributes/${attributeSlug}/options/${optionId}`);
    }
    // Statuses
    async listStatuses(target, identifier, attributeSlug, options) {
        const params = {};
        if (options?.show_archived)
            params.show_archived = options.show_archived;
        if (options?.limit)
            params.limit = options.limit;
        if (options?.offset)
            params.offset = options.offset;
        const response = await this.client.get(`/${target}/${identifier}/attributes/${attributeSlug}/statuses`, params);
        const validated = (0, validation_1.validate)(types_1.StatusesResponseSchema, response);
        return validated.data;
    }
    async createStatus(target, identifier, attributeSlug, data) {
        const response = await this.client.post(`/${target}/${identifier}/attributes/${attributeSlug}/statuses`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.StatusSchema, dataResponse.data);
    }
    async updateStatus(target, identifier, attributeSlug, statusId, data) {
        const response = await this.client.patch(`/${target}/${identifier}/attributes/${attributeSlug}/statuses/${statusId}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.StatusSchema, dataResponse.data);
    }
    async deleteStatus(target, identifier, attributeSlug, statusId) {
        await this.client.delete(`/${target}/${identifier}/attributes/${attributeSlug}/statuses/${statusId}`);
    }
    // Convenience method - list attributes with their values (Phase 2)
    async listAttributesWithValues(target, identifier, options) {
        // 1. Get all attributes
        const attributes = await this.listAttributes(target, identifier, options);
        // 2. For each select/status attribute, fetch options/statuses
        const attributesWithValues = await Promise.all(attributes.map(async (attr) => {
            try {
                if (attr.type === 'select' || attr.type === 'multiselect') {
                    const select_options = await this.listSelectOptions(target, identifier, attr.api_slug);
                    return { ...attr, select_options };
                }
                else if (attr.type === 'status') {
                    const statuses = await this.listStatuses(target, identifier, attr.api_slug);
                    return { ...attr, statuses };
                }
            }
            catch (error) {
                // If fetching options/statuses fails, just return the attribute without them
                console.error(`Warning: Could not fetch values for attribute ${attr.api_slug}:`, error instanceof Error ? error.message : String(error));
            }
            return attr;
        }));
        return attributesWithValues;
    }
}
exports.AttributeEndpoints = AttributeEndpoints;
//# sourceMappingURL=attributes.js.map