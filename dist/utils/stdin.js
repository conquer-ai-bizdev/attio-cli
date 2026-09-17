"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAtMostOneStdin = requireAtMostOneStdin;
exports.readInput = readInput;
exports.readJsonInput = readJsonInput;
let stdinPromise;
function requireAtMostOneStdin(inputs) {
    const readers = inputs.filter((input) => input.value === '-');
    if (readers.length > 1) {
        throw new Error(`Only one option can read stdin per command; received ${readers.map((input) => input.name).join(', ')}.`);
    }
}
async function readInput(value, inputName) {
    if (value !== undefined && value !== '-')
        return value;
    if (process.stdin.isTTY) {
        throw new Error(`${inputName} was not provided and stdin has no piped input. Pass it inline or pipe it into the command.`);
    }
    stdinPromise ??= readStdin();
    const input = await stdinPromise;
    if (input.length === 0) {
        throw new Error(`${inputName} was not provided because stdin was empty.`);
    }
    return input;
}
async function readJsonInput(value, inputName) {
    const input = await readInput(value, inputName);
    try {
        return JSON.parse(input);
    }
    catch {
        throw new Error(`${inputName} must be valid JSON${value === undefined || value === '-' ? ' from stdin' : ''}.`);
    }
}
async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
}
//# sourceMappingURL=stdin.js.map