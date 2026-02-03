import { describe, it, expect } from 'vitest';
import {
  validate,
  isUUID,
  isSlug,
  validateUUID,
  validateSlug,
} from '../../../src/utils/validation';
import { z } from 'zod';

describe('validation', () => {
  describe('validate', () => {
    const TestSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it('should validate valid data', () => {
      const data = { name: 'John', age: 30 };
      const result = validate(TestSchema, data);
      expect(result).toEqual(data);
    });

    it('should throw error for invalid data', () => {
      const data = { name: 'John', age: 'thirty' };
      expect(() => validate(TestSchema, data)).toThrow('Validation error');
    });

    it('should include field path in error message', () => {
      const data = { name: 'John', age: 'thirty' };
      try {
        validate(TestSchema, data);
      } catch (error) {
        expect((error as Error).message).toContain('age');
      }
    });

    it('should handle nested validation errors', () => {
      const NestedSchema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      });

      const data = { user: { name: 'John', email: 'invalid-email' } };
      expect(() => validate(NestedSchema, data)).toThrow('Validation error');
    });
  });

  describe('isUUID', () => {
    it('should return true for valid UUIDs', () => {
      expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should return false for invalid UUIDs', () => {
      expect(isUUID('not-a-uuid')).toBe(false);
      expect(isUUID('123e4567')).toBe(false);
      expect(isUUID('123e4567-e89b-12d3-a456')).toBe(false);
      expect(isUUID('')).toBe(false);
      expect(isUUID('123e4567-e89b-12d3-a456-42661417400g')).toBe(false); // invalid character
    });

    it('should be case insensitive', () => {
      expect(isUUID('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
    });
  });

  describe('isSlug', () => {
    it('should return true for valid slugs', () => {
      expect(isSlug('people')).toBe(true);
      expect(isSlug('companies')).toBe(true);
      expect(isSlug('my-list')).toBe(true);
      expect(isSlug('test_list')).toBe(true);
      expect(isSlug('list-123')).toBe(true);
    });

    it('should return false for invalid slugs', () => {
      expect(isSlug('My List')).toBe(false); // uppercase and space
      expect(isSlug('my list')).toBe(false); // space
      expect(isSlug('my/list')).toBe(false); // slash
      expect(isSlug('my.list')).toBe(false); // dot
      expect(isSlug('')).toBe(false);
    });
  });

  describe('validateUUID', () => {
    it('should not throw for valid UUIDs', () => {
      expect(() =>
        validateUUID('123e4567-e89b-12d3-a456-426614174000')
      ).not.toThrow();
    });

    it('should throw for invalid UUIDs', () => {
      expect(() => validateUUID('not-a-uuid')).toThrow('Invalid UUID format');
      expect(() => validateUUID('')).toThrow('Invalid UUID format');
    });

    it('should include the invalid value in error message', () => {
      try {
        validateUUID('not-a-uuid');
      } catch (error) {
        expect((error as Error).message).toContain('not-a-uuid');
      }
    });
  });

  describe('validateSlug', () => {
    it('should not throw for valid slugs', () => {
      expect(() => validateSlug('people')).not.toThrow();
      expect(() => validateSlug('my-list')).not.toThrow();
    });

    it('should throw for invalid slugs', () => {
      expect(() => validateSlug('My List')).toThrow('Invalid slug format');
      expect(() => validateSlug('')).toThrow('Invalid slug format');
    });

    it('should include helpful message', () => {
      try {
        validateSlug('My List');
      } catch (error) {
        expect((error as Error).message).toContain('lowercase');
      }
    });
  });
});
