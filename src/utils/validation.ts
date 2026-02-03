import { z } from 'zod';

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new Error(`Validation error: ${issues}`);
    }
    throw error;
  }
}

export function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9_-]+$/.test(value);
}

export function validateUUID(value: string): void {
  if (!isUUID(value)) {
    throw new Error(`Invalid UUID format: ${value}`);
  }
}

export function validateSlug(value: string): void {
  if (!isSlug(value)) {
    throw new Error(
      `Invalid slug format: ${value}. Slugs must be lowercase alphanumeric with hyphens or underscores.`
    );
  }
}
