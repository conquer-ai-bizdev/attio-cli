import { describe, it, expect } from 'vitest';
import { formatJson } from '../../../src/formatters/json';

describe('formatJson', () => {
  it('should format simple objects as pretty JSON', () => {
    const data = { name: 'John', age: 30 };
    const result = formatJson(data);

    expect(result).toBe(JSON.stringify(data, null, 2));
    expect(result).toContain('"name": "John"');
    expect(result).toContain('"age": 30');
  });

  it('should format arrays as pretty JSON', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const result = formatJson(data);

    expect(result).toBe(JSON.stringify(data, null, 2));
    expect(result).toContain('"id": 1');
    expect(result).toContain('"name": "Alice"');
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

    expect(result).toBe(JSON.stringify(data, null, 2));
    expect(result).toContain('"city": "New York"');
  });

  it('should handle null values', () => {
    const data = { name: 'John', avatar: null };
    const result = formatJson(data);

    expect(result).toContain('"avatar": null');
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
