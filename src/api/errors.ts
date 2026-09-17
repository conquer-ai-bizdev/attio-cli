export type ApiErrorCategory =
  | 'input'
  | 'authentication'
  | 'permission'
  | 'not_found'
  | 'conflict'
  | 'rate_limit'
  | 'server'
  | 'network'
  | 'unknown';

export interface ApiValidationError {
  field: string;
  message: string;
  code?: string;
  expected?: string;
  received?: string;
}

export interface ApiErrorContext {
  method?: string;
  path?: string;
  requestId?: string;
  attempts?: number;
  retryable?: boolean;
  retryAfterSeconds?: number;
}

export interface SerializableApiError {
  status: number;
  code: string;
  type: string;
  category: ApiErrorCategory;
  message: string;
  operation?: string;
  request_id?: string;
  validation_errors?: ApiValidationError[];
  retryable: boolean;
  retry_after_seconds?: number;
  attempts?: number;
  next_action: string;
}

export class ApiError extends Error {
  public apiMessage: string;

  constructor(
    public statusCode: number,
    public code: string,
    public type: string,
    message: string,
    public context: ApiErrorContext = {},
    public validationErrors: ApiValidationError[] = []
  ) {
    super(message);
    this.apiMessage = message;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
    this.message = this.toHumanString();
  }

  get category(): ApiErrorCategory {
    return categoryForStatus(this.statusCode, this.type);
  }

  get retryable(): boolean {
    return this.context.retryable ?? defaultRetryable(this.category);
  }

  get nextAction(): string {
    return nextActionForCategory(this.category, this.retryable);
  }

  toJSON(): SerializableApiError {
    const operation = formatOperation(this.context);

    return {
      status: this.statusCode,
      code: this.code,
      type: this.type,
      category: this.category,
      message: this.apiMessage,
      ...(operation ? { operation } : {}),
      ...(this.context.requestId
        ? { request_id: this.context.requestId }
        : {}),
      ...(this.validationErrors.length > 0
        ? { validation_errors: this.validationErrors }
        : {}),
      retryable: this.retryable,
      ...(this.context.retryAfterSeconds !== undefined
        ? { retry_after_seconds: this.context.retryAfterSeconds }
        : {}),
      ...(this.context.attempts !== undefined
        ? { attempts: this.context.attempts }
        : {}),
      next_action: this.nextAction,
    };
  }

  toHumanString(): string {
    const operation = formatOperation(this.context);
    const heading = operation
      ? `Attio rejected ${operation} (${this.statusCode} ${this.code}).`
      : `Attio request failed (${this.statusCode} ${this.code}).`;
    const lines = [heading, `Message: ${this.apiMessage}`];

    for (const validationError of this.validationErrors) {
      lines.push(
        `Field ${validationError.field || '(request)'}: ${validationError.message}`
      );
    }

    if (this.context.requestId) {
      lines.push(`Request ID: ${this.context.requestId}`);
    }
    if (this.context.attempts && this.context.attempts > 1) {
      lines.push(`Attempts: ${this.context.attempts}`);
    }
    if (this.context.retryAfterSeconds !== undefined) {
      lines.push(`Retry after: ${this.context.retryAfterSeconds} seconds`);
    }
    lines.push(`Retryable: ${this.retryable ? 'yes' : 'no'}`);
    lines.push(`Next action: ${this.nextAction}`);

    return lines.join('\n');
  }
}

export class RateLimitError extends ApiError {
  constructor(
    public retryAfter: number,
    message: string = 'Rate limit exceeded',
    context: ApiErrorContext = {},
    code = 'rate_limit_exceeded',
    type = 'rate_limit_error'
  ) {
    super(
      429,
      code,
      type,
      message,
      { ...context, retryAfterSeconds: retryAfter },
      []
    );
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message: string = 'Resource not found',
    context: ApiErrorContext = {},
    code = 'not_found',
    type = 'not_found_error'
  ) {
    super(404, code, type, message, context);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends ApiError {
  public errors: ApiValidationError[];

  constructor(
    errors: ApiValidationError[],
    message: string = 'Validation error',
    context: ApiErrorContext = {},
    statusCode = 400,
    code = 'validation_error',
    type = 'validation_error'
  ) {
    super(statusCode, code, type, message, context, errors);
    this.errors = errors;
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends ApiError {
  constructor(
    message: string = 'Authentication failed',
    context: ApiErrorContext = {},
    code = 'authentication_error',
    type = 'authentication_error'
  ) {
    super(401, code, type, message, context);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends ApiError {
  constructor(
    message: string = 'Access forbidden',
    context: ApiErrorContext = {},
    code = 'authorization_error',
    type = 'authorization_error'
  ) {
    super(403, code, type, message, context);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

interface ApiErrorResponse {
  error?: {
    code?: string;
    type?: string;
    message?: string;
    errors?: Array<{ field: string; message: string; code?: string }>;
  };
  message?: string;
  code?: string;
  type?: string;
  validation_errors?: Array<{
    code: string;
    path: string[];
    message: string;
    expected?: string;
    received?: string;
  }>;
}

export function parseApiError(
  statusCode: number,
  data: unknown,
  retryAfter?: number,
  context: ApiErrorContext = {}
): ApiError {
  const errorData = isRecord(data) ? (data as ApiErrorResponse) : {};
  const message =
    errorData.error?.message ||
    errorData.message ||
    (typeof data === 'string' && data.trim() ? data : 'Unknown Attio error');
  const code = errorData.error?.code || errorData.code || 'unknown_error';
  const type = errorData.error?.type || errorData.type || 'api_error';
  const enrichedContext = {
    ...context,
    ...(retryAfter !== undefined ? { retryAfterSeconds: retryAfter } : {}),
  };

  if (statusCode === 429) {
    return new RateLimitError(
      retryAfter ?? 60,
      message,
      enrichedContext,
      code,
      type
    );
  }

  if (statusCode === 404) {
    return new NotFoundError(message, enrichedContext, code, type);
  }

  if (statusCode === 401) {
    return new AuthenticationError(message, enrichedContext, code, type);
  }

  if (statusCode === 403) {
    return new AuthorizationError(message, enrichedContext, code, type);
  }

  const validationErrors = extractValidationErrors(errorData);
  if ((statusCode === 400 || statusCode === 422) && validationErrors.length > 0) {
    return new ValidationError(
      validationErrors,
      message,
      enrichedContext,
      statusCode,
      code,
      type
    );
  }

  return new ApiError(
    statusCode,
    code,
    type,
    message,
    enrichedContext,
    validationErrors
  );
}

export function createNetworkError(
  message: string,
  code: string,
  context: ApiErrorContext
): ApiError {
  return new ApiError(0, code, 'network_error', message, {
    ...context,
    retryable: context.retryable ?? true,
  });
}

function extractValidationErrors(
  errorData: ApiErrorResponse
): ApiValidationError[] {
  if (errorData.error?.errors) {
    return errorData.error.errors.map((error) => ({
      field: error.field,
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
    }));
  }

  return (errorData.validation_errors ?? []).map((error) => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
    ...(error.expected !== undefined ? { expected: error.expected } : {}),
    ...(error.received !== undefined ? { received: error.received } : {}),
  }));
}

function categoryForStatus(
  statusCode: number,
  type: string
): ApiErrorCategory {
  if (type === 'network_error' || statusCode === 0) return 'network';
  if (statusCode === 400 || statusCode === 422) return 'input';
  if (statusCode === 401) return 'authentication';
  if (statusCode === 403) return 'permission';
  if (statusCode === 404) return 'not_found';
  if (statusCode === 409) return 'conflict';
  if (statusCode === 429) return 'rate_limit';
  if (statusCode >= 500) return 'server';
  return 'unknown';
}

function defaultRetryable(category: ApiErrorCategory): boolean {
  return category === 'rate_limit' || category === 'server' || category === 'network';
}

function nextActionForCategory(
  category: ApiErrorCategory,
  retryable: boolean
): string {
  switch (category) {
    case 'input':
      return 'Inspect the live schema or command usage, correct the input, and retry.';
    case 'authentication':
      return 'Repair or refresh the Attio credential before retrying.';
    case 'permission':
      return 'Grant the required Attio scope or use an authorized credential; do not retry unchanged.';
    case 'not_found':
      return 'Refresh the exact resource and verify its ID before deciding whether to retry.';
    case 'conflict':
      return 'Read the current resource state, reconcile the conflict, and then retry if still required.';
    case 'rate_limit':
      return retryable
        ? 'Wait for the stated retry interval and retry the idempotent request.'
        : 'Read back the target before retrying because the write outcome may be unknown.';
    case 'server':
    case 'network':
      return retryable
        ? 'Retry with backoff; for writes, read back the target before another attempt.'
        : 'Read back the target before retrying because the write outcome may be unknown.';
    default:
      return 'Inspect the original Attio error and current resource state before taking another action.';
  }
}

function formatOperation(context: ApiErrorContext): string | undefined {
  if (!context.method && !context.path) return undefined;
  return [context.method?.toUpperCase(), context.path].filter(Boolean).join(' ');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
