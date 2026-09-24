"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileMcpAccessToken = getFileMcpAccessToken;
const node_fs_1 = require("node:fs");
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const EXPIRY_BUFFER_MS = 60_000;
const LOCK_STALE_MS = 30_000;
async function getFileMcpAccessToken(forceRefresh = false) {
    const credentialPath = resolveCredentialPath();
    if (!(await exists(credentialPath)))
        return undefined;
    const initial = await readCredential(credentialPath);
    if (!forceRefresh && isCurrent(initial))
        return initial.accessToken;
    return withCredentialLock(credentialPath, async () => {
        const credential = await readCredential(credentialPath);
        if (!forceRefresh && isCurrent(credential))
            return credential.accessToken;
        const response = await fetch(credential.tokenEndpoint, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: credential.refreshToken,
                client_id: credential.clientId,
                ...(credential.scope ? { scope: credential.scope } : {}),
            }),
        });
        const body = (await response
            .json()
            .catch(() => ({})));
        if (!response.ok || !body.access_token) {
            const detail = body.error_description ||
                body.error ||
                `${response.status} ${response.statusText}`;
            throw new Error(`Attio authorization refresh failed: ${detail}`);
        }
        const updated = {
            ...credential,
            accessToken: body.access_token,
            refreshToken: body.refresh_token || credential.refreshToken,
            expiresAt: Date.now() + Math.max(body.expires_in ?? 3600, 60) * 1000,
        };
        await writeCredential(credentialPath, updated);
        return updated.accessToken;
    });
}
function resolveCredentialPath() {
    if (process.env.ATTIO_AUTH_FILE)
        return process.env.ATTIO_AUTH_FILE;
    const configHome = process.env.XDG_CONFIG_HOME || node_path_1.default.join(node_os_1.default.homedir(), '.config');
    return node_path_1.default.join(configHome, 'attio', 'oauth.json');
}
function isCurrent(credential) {
    return credential.expiresAt > Date.now() + EXPIRY_BUFFER_MS;
}
async function readCredential(credentialPath) {
    let parsed;
    try {
        parsed = JSON.parse(await node_fs_1.promises.readFile(credentialPath, 'utf8'));
    }
    catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(`Cannot read Attio authorization file: ${detail}`);
    }
    if (!parsed || typeof parsed !== 'object') {
        throw new Error('Attio authorization file must contain a JSON object.');
    }
    const value = parsed;
    for (const key of [
        'accessToken',
        'refreshToken',
        'expiresAt',
        'tokenEndpoint',
        'clientId',
    ]) {
        if (!(key in value) ||
            (key === 'expiresAt'
                ? typeof value[key] !== 'number'
                : typeof value[key] !== 'string')) {
            throw new Error(`Attio authorization file is missing ${key}.`);
        }
    }
    return value;
}
async function writeCredential(credentialPath, credential) {
    const directory = node_path_1.default.dirname(credentialPath);
    const temporaryPath = `${credentialPath}.${process.pid}.tmp`;
    const mode = process.env.ATTIO_AUTH_FILE_MODE === '0660' ? 0o660 : 0o600;
    await node_fs_1.promises.mkdir(directory, { recursive: true, mode: 0o700 });
    await node_fs_1.promises.writeFile(temporaryPath, `${JSON.stringify(credential)}\n`, {
        mode,
    });
    await node_fs_1.promises.rename(temporaryPath, credentialPath);
    await node_fs_1.promises.chmod(credentialPath, mode);
}
async function withCredentialLock(credentialPath, operation) {
    const lockPath = `${credentialPath}.lock`;
    const startedAt = Date.now();
    while (true) {
        try {
            await node_fs_1.promises.mkdir(lockPath, { mode: 0o770 });
            break;
        }
        catch (error) {
            const code = error.code;
            if (code !== 'EEXIST')
                throw error;
            const stat = await node_fs_1.promises.stat(lockPath).catch(() => undefined);
            if (stat && Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
                await node_fs_1.promises.rm(lockPath, { recursive: true, force: true });
                continue;
            }
            if (Date.now() - startedAt > LOCK_STALE_MS) {
                throw new Error('Timed out waiting for Attio authorization refresh.');
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    try {
        return await operation();
    }
    finally {
        await node_fs_1.promises.rm(lockPath, { recursive: true, force: true });
    }
}
async function exists(filePath) {
    try {
        await node_fs_1.promises.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=oauth-file.js.map