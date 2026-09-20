"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownLinesMatch = markdownLinesMatch;
function markdownLinesMatch(requested, stored) {
    return normalizeMarkdownLines(requested) === normalizeMarkdownLines(stored);
}
function normalizeMarkdownLines(value) {
    return value
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.trimEnd())
        .filter((line) => line.trim().length > 0)
        .join('\n');
}
//# sourceMappingURL=markdown.js.map