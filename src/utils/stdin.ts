let stdinPromise: Promise<string> | undefined;

export function requireAtMostOneStdin(
  inputs: Array<{ name: string; value?: string }>
): void {
  const readers = inputs.filter((input) => input.value === '-');
  if (readers.length > 1) {
    throw new Error(
      `Only one option can read stdin per command; received ${readers.map((input) => input.name).join(', ')}.`
    );
  }
}

export async function readInput(
  value: string | undefined,
  inputName: string
): Promise<string> {
  if (value !== undefined && value !== '-') return value;
  if (process.stdin.isTTY) {
    throw new Error(
      `${inputName} was not provided and stdin has no piped input. Pass it inline or pipe it into the command.`
    );
  }

  stdinPromise ??= readStdin();
  const input = await stdinPromise;
  if (input.length === 0) {
    throw new Error(`${inputName} was not provided because stdin was empty.`);
  }
  return input;
}

export async function readJsonInput<T = unknown>(
  value: string | undefined,
  inputName: string
): Promise<T> {
  const input = await readInput(value, inputName);
  try {
    return JSON.parse(input) as T;
  } catch {
    throw new Error(
      `${inputName} must be valid JSON${value === undefined || value === '-' ? ' from stdin' : ''}.`
    );
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}
