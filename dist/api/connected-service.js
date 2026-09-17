"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAttio = callAttio;
const yaml_1 = require("yaml");
const provider_1 = require("../mcp/provider");
async function callAttio(operation, args) {
    const provider = new provider_1.OfficialAttioMcpProvider();
    try {
        const result = (await provider.callTool({
            name: operation,
            arguments: args,
        }));
        if (result.isError)
            throw new Error(readError(result));
        if (result.structuredContent !== undefined) {
            return normalize(result.structuredContent);
        }
        const text = (result.content ?? [])
            .filter((block) => block.type === 'text' && typeof block.text === 'string')
            .map((block) => block.text)
            .join('\n')
            .trim();
        if (!text)
            return null;
        return normalize(await parseText(text));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(cleanError(message));
    }
    finally {
        await provider.close().catch(() => undefined);
    }
}
async function parseText(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        try {
            const { decode } = await import('@toon-format/toon');
            return decode(text);
        }
        catch {
            try {
                return (0, yaml_1.parse)(text);
            }
            catch {
                return text;
            }
        }
    }
}
function normalize(value) {
    if (Array.isArray(value))
        return value.map(normalize);
    if (!value || typeof value !== 'object')
        return value;
    const normalized = {};
    for (const [rawKey, rawValue] of Object.entries(value)) {
        const match = rawKey.match(/^(.*)\[(\d+)\]$/);
        const key = match?.[1] ?? rawKey;
        const count = match ? Number(match[2]) : undefined;
        let next = normalize(rawValue);
        if (count === 0 && (next === null || next === ''))
            next = [];
        if (key === '' && Array.isArray(next))
            return next;
        normalized[key] = next;
    }
    return normalized;
}
function readError(result) {
    const text = (result.content ?? [])
        .filter((block) => block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n')
        .trim();
    return text || 'Attio rejected the operation.';
}
function cleanError(message) {
    return message
        .replace(/official Attio MCP/gi, 'Attio')
        .replace(/Attio MCP/gi, 'Attio')
        .replace(/\bMCP\b/g, 'Attio service')
        .replace(/\bREST\b/g, 'Attio API')
        .replace(/\btool\b/gi, 'operation')
        .replace(/Attio service error -32602: operation ([^\n]+) not found/gi, 'Attio operation "$1" was not found.');
}
//# sourceMappingURL=connected-service.js.map