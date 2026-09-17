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