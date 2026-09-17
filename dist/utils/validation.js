"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.isUUID = isUUID;
exports.isSlug = isSlug;
exports.validateUUID = validateUUID;
exports.validateSlug = validateSlug;
const zod_1 = require("zod");
function validate(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const issues = error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');
            throw new Error(`Validation error: ${issues}`);
        }
        throw error;
    }
}
function isUUID(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
function isSlug(value) {
    return /^[a-z0-9_-]+$/.test(value);
}
function validateUUID(value) {
    if (!isUUID(value)) {
        throw new Error(`Invalid UUID format: ${value}`);
    }
}
function validateSlug(value) {
    if (!isSlug(value)) {
        throw new Error(`Invalid slug format: ${value}. Slugs must be lowercase alphanumeric with hyphens or underscores.`);
    }
}
//# sourceMappingURL=validation.js.map