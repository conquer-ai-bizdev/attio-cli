"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attioExclusiveLowerBound = attioExclusiveLowerBound;
function attioExclusiveLowerBound(value) {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) {
        throw new Error(`Invalid interval start: ${value}`);
    }
    return new Date(timestamp - 1).toISOString();
}
//# sourceMappingURL=time-window.js.map