import { describe, it, expect } from 'vitest';
import { formatJson } from '../../../src/formatters/json';

describe('formatJson', () => {
  it('formats simple objects as compact JSON', () => {
    const data = { name: 'John', age: 30 };
    const result = formatJson(data);

    expect(result).toBe(JSON.stringify(data));
  });

  it('formats arrays as compact JSON', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const result = formatJson(data);

    expect(result).toBe(JSON.stringify(data));
  });

  it('should handle nested objects', () => {
    const data = {
      user: {
        name: 'John',
        address: {
          city: 'New York',
          country: 'USA',
        },
      },
    };
    const result = formatJson(data);

    expect(result).toBe(JSON.stringify(data));
  });

  it('should handle null values', () => {
    const data = { name: 'John', avatar: null };
    const result = formatJson(data);

    expect(result).toBe('{"name":"John","avatar":null}');
  });

  it('should handle empty objects', () => {
    const data = {};
    const result = formatJson(data);

    expect(result).toBe('{}');
  });

  it('should handle empty arrays', () => {
    const data: unknown[] = [];
    const result = formatJson(data);

    expect(result).toBe('[]');
  });
});
