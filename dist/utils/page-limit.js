"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePageLimit = requirePageLimit;
function requirePageLimit(value, maximum, resource) {
    if (value === undefined)
        return undefined;
    if (!Number.isInteger(value) || value < 1 || value > maximum) {
        throw new Error(`${resource} limit must be an integer between 1 and ${maximum}. Use --all to fetch every page.`);
    }
    return value;
}
//# sourceMappingURL=page-limit.js.map