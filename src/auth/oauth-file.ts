import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type OAuthCredential = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenEndpoint: string;
  clientId: string;
  scope?: string;
};

type OAuthTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

const EXPIRY_BUFFER_MS = 60_000;
const LOCK_STALE_MS = 30_000;

export async function getFileMcpAccessToken(
  forceRefresh = false
): Promise<string | undefined> {
  const credentialPath = resolveCredentialPath();
  if (!(await exists(credentialPath))) return undefined;

  const initial = await readCredential(credentialPath);
  if (!forceRefresh && isCurrent(initial)) return initial.accessToken;

  return withCredentialLock(credentialPath, async () => {
    const credential = await readCredential(credentialPath);
    if (!forceRefresh && isCurrent(credential)) return credential.accessToken;

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
      .catch(() => ({}))) as OAuthTokenResponse;
    if (!response.ok || !body.access_token) {
      const detail =
        body.error_description ||
        body.error ||
        `${response.status} ${response.statusText}`;
      throw new Error(`Attio authorization refresh failed: ${detail}`);
    }

    const updated: OAuthCredential = {
      ...credential,
      accessToken: body.access_token,
      refreshToken: body.refresh_token || credential.refreshToken,
      expiresAt: Date.now() + Math.max(body.expires_in ?? 3600, 60) * 1000,
    };
    await writeCredential(credentialPath, updated);
    return updated.accessToken;
  });
}

function resolveCredentialPath(): string {
  if (process.env.ATTIO_AUTH_FILE) return process.env.ATTIO_AUTH_FILE;
  const configHome =
    process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(configHome, 'attio', 'oauth.json');
}

function isCurrent(credential: OAuthCredential): boolean {
  return credential.expiresAt > Date.now() + EXPIRY_BUFFER_MS;
}

async function readCredential(
  credentialPath: string
): Promise<OAuthCredential> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await fs.readFile(credentialPath, 'utf8'));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read Attio authorization file: ${detail}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Attio authorization file must contain a JSON object.');
  }
  const value = parsed as Record<string, unknown>;
  for (const key of [
    'accessToken',
    'refreshToken',
    'expiresAt',
    'tokenEndpoint',
    'clientId',
  ]) {
    if (
      !(key in value) ||
      (key === 'expiresAt'
        ? typeof value[key] !== 'number'
        : typeof value[key] !== 'string')
    ) {
      throw new Error(`Attio authorization file is missing ${key}.`);
    }
  }
  return value as OAuthCredential;
}

async function writeCredential(
  credentialPath: string,
  credential: OAuthCredential
): Promise<void> {
  const directory = path.dirname(credentialPath);
  const temporaryPath = `${credentialPath}.${process.pid}.tmp`;
  const mode = process.env.ATTIO_AUTH_FILE_MODE === '0660' ? 0o660 : 0o600;
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  await fs.writeFile(temporaryPath, `${JSON.stringify(credential)}\n`, {
    mode,
  });
  await fs.rename(temporaryPath, credentialPath);
  await fs.chmod(credentialPath, mode);
}

async function withCredentialLock<T>(
  credentialPath: string,
  operation: () => Promise<T>
): Promise<T> {
  const lockPath = `${credentialPath}.lock`;
  const startedAt = Date.now();
  while (true) {
    try {
      await fs.mkdir(lockPath, { mode: 0o770 });
      break;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'EEXIST') throw error;
      const stat = await fs.stat(lockPath).catch(() => undefined);
      if (stat && Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
        await fs.rm(lockPath, { recursive: true, force: true });
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
  } finally {
    await fs.rm(lockPath, { recursive: true, force: true });
  }
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
