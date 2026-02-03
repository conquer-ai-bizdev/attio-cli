import { describe, it, expect } from 'vitest';
import { validateFilterStructure } from '../../../src/utils/filter-validator';

describe('Filter Validator', () => {
  describe('validateFilterStructure', () => {
    it('should accept valid filter with operator', () => {
      const filter = {
        email_addresses: {
          email_address: {
            $eq: 'test@example.com',
          },
        },
      };

      const result = validateFilterStructure(filter);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept multiple filters with operators', () => {
      const filter = {
        email_addresses: {
          email_address: {
            $contains: '@example.com',
          },
        },
        name: {
          first_name: {
            $starts_with: 'John',
          },
        },
      };

      const result = validateFilterStructure(filter);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object filter', () => {
      const result = validateFilterStructure('not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Filter must be an object');
    });

    it('should reject null filter', () => {
      const result = validateFilterStructure(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Filter must be an object');
    });

    it('should reject filter with non-object attribute filter', () => {
      const filter = {
        email_addresses: 'not an object',
      };

      const result = validateFilterStructure(filter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Filter for attribute "email_addresses" must be an object'
      );
    });

    it('should reject filter missing operator', () => {
      const filter = {
        email_addresses: {
          email_address: {
            // Missing $ operator
            value: 'test@example.com',
          },
        },
      };

      const result = validateFilterStructure(filter);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Filter for "email_addresses" must contain an operator like $eq, $contains, $starts_with, or $ends_with'
      );
    });

    it('should accept nested filters with operators', () => {
      const filter = {
        company: {
          target_record_id: {
            $eq: 'record-id-123',
          },
        },
      };

      const result = validateFilterStructure(filter);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect multiple errors', () => {
      const filter = {
        email_addresses: 'not an object',
        name: {
          first_name: {
            // Missing operator
            value: 'John',
          },
        },
      };

      const result = validateFilterStructure(filter);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
