"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePageLimit = requirePageLimit;
function requirePageLimit(value, maximum, resource, paginationHint = 'Use --all to fetch every page.') {
    if (value === undefined)
        return undefined;
    if (!Number.isInteger(value) || value < 1 || value > maximum) {
        throw new Error(`${resource} limit must be an integer between 1 and ${maximum}. ${paginationHint}`);
    }
    return value;
}
//# sourceMappingURL=page-limit.js.map