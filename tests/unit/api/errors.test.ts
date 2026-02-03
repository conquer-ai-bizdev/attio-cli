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
      expect(error.message).toBe('Something went wrong');
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
      expect(error.message).toBe('Rate limit exceeded');
    });

    it('should accept custom message', () => {
      const error = new RateLimitError(120, 'Too many requests');

      expect(error.retryAfter).toBe(120);
      expect(error.message).toBe('Too many requests');
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error', () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should accept custom message', () => {
      const error = new NotFoundError('User not found');

      expect(error.message).toBe('User not found');
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
      expect(error.message).toBe('Authentication failed');
    });
  });

  describe('AuthorizationError', () => {
    it('should create an authorization error', () => {
      const error = new AuthorizationError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access forbidden');
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
      expect(error.message).toBe('Resource not found');
    });

    it('should parse authentication error', () => {
      const error = parseApiError(401, {
        error: {
          message: 'Invalid API key',
        },
      });

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Invalid API key');
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
      expect(error.message).toBe('Server error');
    });

    it('should handle unknown error format', () => {
      const error = parseApiError(500, {});

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe('Unknown error');
    });
  });
});
