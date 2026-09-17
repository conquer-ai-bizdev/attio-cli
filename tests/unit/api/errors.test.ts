import { describe, it, expect } from 'vitest';
import {
  ApiError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  parseApiError,
} from '../../../src/api/errors';

describe('errors', () => {
  describe('ApiError', () => {
    it('should create an API error with all properties', () => {
      const error = new ApiError(
        500,
        'internal_error',
        'server_error',
        'Something went wrong'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('internal_error');
      expect(error.type).toBe('server_error');
      expect(error.apiMessage).toBe('Something went wrong');
      expect(error.message).toContain('Attio request failed (500 internal_error).');
      expect(error.message).toContain('Retryable: yes');
      expect(error.name).toBe('ApiError');
    });
  });

  describe('RateLimitError', () => {
    it('should create a rate limit error', () => {
      const error = new RateLimitError(60);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(60);
      expect(error.apiMessage).toBe('Rate limit exceeded');
      expect(error.message).toContain('Retry after: 60 seconds');
    });

    it('should accept custom message', () => {
      const error = new RateLimitError(120, 'Too many requests');

      expect(error.retryAfter).toBe(120);
      expect(error.apiMessage).toBe('Too many requests');
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error', () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
      expect(error.apiMessage).toBe('Resource not found');
      expect(error.message).toContain('Retryable: no');
    });

    it('should accept custom message', () => {
      const error = new NotFoundError('User not found');

      expect(error.apiMessage).toBe('User not found');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error', () => {
      const errors = [
        { field: 'email', message: 'Invalid email format' },
        { field: 'name', message: 'Name is required' },
      ];
      const error = new ValidationError(errors);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.errors).toEqual(errors);
    });
  });

  describe('AuthenticationError', () => {
    it('should create an authentication error', () => {
      const error = new AuthenticationError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(401);
      expect(error.apiMessage).toBe('Authentication failed');
    });
  });

  describe('AuthorizationError', () => {
    it('should create an authorization error', () => {
      const error = new AuthorizationError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(403);
      expect(error.apiMessage).toBe('Access forbidden');
    });
  });

  describe('parseApiError', () => {
    it('should parse rate limit error', () => {
      const error = parseApiError(
        429,
        {
          error: {
            code: 'rate_limit_exceeded',
            type: 'rate_limit_error',
            message: 'Too many requests',
          },
        },
        60
      );

      expect(error).toBeInstanceOf(RateLimitError);
      expect((error as RateLimitError).retryAfter).toBe(60);
    });

    it('should parse not found error', () => {
      const error = parseApiError(404, {
        error: {
          message: 'Resource not found',
        },
      });

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.apiMessage).toBe('Resource not found');
    });

    it('should parse authentication error', () => {
      const error = parseApiError(401, {
        error: {
          message: 'Invalid API key',
        },
      });

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.apiMessage).toBe('Invalid API key');
    });

    it('should parse authorization error', () => {
      const error = parseApiError(403, {
        error: {
          message: 'Access forbidden',
        },
      });

      expect(error).toBeInstanceOf(AuthorizationError);
    });

    it('should parse validation error', () => {
      const error = parseApiError(400, {
        error: {
          message: 'Validation failed',
          errors: [{ field: 'email', message: 'Invalid email' }],
        },
      });

      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).errors).toHaveLength(1);
    });

    it('should handle response without error object', () => {
      const error = parseApiError(500, { message: 'Server error' });

      expect(error).toBeInstanceOf(ApiError);
      expect(error.apiMessage).toBe('Server error');
    });

    it('should handle unknown error format', () => {
      const error = parseApiError(500, {});

      expect(error).toBeInstanceOf(ApiError);
      expect(error.apiMessage).toBe('Unknown Attio error');
    });

    it('preserves operation, request id, validation details, and recovery guidance', () => {
      const error = parseApiError(
        400,
        {
          code: 'validation_type',
          type: 'invalid_request_error',
          message: 'Validation failed',
          validation_errors: [
            {
              code: 'invalid_value',
              path: ['data', 'values', 'stage'],
              message: 'Unknown status',
              expected: 'A valid status title or ID',
              received: 'Made up',
            },
          ],
        },
        undefined,
        {
          method: 'PATCH',
          path: '/objects/deals/records/abc',
          requestId: 'req_123',
          retryable: false,
          attempts: 1,
        }
      );

      expect(error.message).toContain(
        'Attio rejected PATCH /objects/deals/records/abc (400 validation_type).'
      );
      expect(error.message).toContain('Field data.values.stage: Unknown status');
      expect(error.message).toContain('Request ID: req_123');
      expect(error.message).toContain('Retryable: no');
      expect(error.toJSON()).toEqual(
        expect.objectContaining({
          status: 400,
          code: 'validation_type',
          category: 'input',
          message: 'Validation failed',
          operation: 'PATCH /objects/deals/records/abc',
          request_id: 'req_123',
          retryable: false,
        })
      );
      expect(error.toJSON().validation_errors).toEqual([
        {
          code: 'invalid_value',
          field: 'data.values.stage',
          message: 'Unknown status',
          expected: 'A valid status title or ID',
          received: 'Made up',
        },
      ]);
    });
  });
});
