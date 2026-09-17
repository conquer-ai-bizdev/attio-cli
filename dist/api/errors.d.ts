export type ApiErrorCategory = 'input' | 'authentication' | 'permission' | 'not_found' | 'conflict' | 'rate_limit' | 'server' | 'network' | 'unknown';
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
export declare class ApiError extends Error {
    statusCode: number;
    code: string;
    type: string;
    context: ApiErrorContext;
    validationErrors: ApiValidationError[];
    apiMessage: string;
    constructor(statusCode: number, code: string, type: string, message: string, context?: ApiErrorContext, validationErrors?: ApiValidationError[]);
    get category(): ApiErrorCategory;
    get retryable(): boolean;
    get nextAction(): string;
    toJSON(): SerializableApiError;
    toHumanString(): string;
}
export declare class RateLimitError extends ApiError {
    retryAfter: number;
    constructor(retryAfter: number, message?: string, context?: ApiErrorContext, code?: string, type?: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message?: string, context?: ApiErrorContext, code?: string, type?: string);
}
export declare class ValidationError extends ApiError {
    errors: ApiValidationError[];
    constructor(errors: ApiValidationError[], message?: string, context?: ApiErrorContext, statusCode?: number, code?: string, type?: string);
}
export declare class AuthenticationError extends ApiError {
    constructor(message?: string, context?: ApiErrorContext, code?: string, type?: string);
}
export declare class AuthorizationError extends ApiError {
    constructor(message?: string, context?: ApiErrorContext, code?: string, type?: string);
}
export declare function parseApiError(statusCode: number, data: unknown, retryAfter?: number, context?: ApiErrorContext): ApiError;
export declare function createNetworkError(message: string, code: string, context: ApiErrorContext): ApiError;
//# sourceMappingURL=errors.d.ts.map