import { describe, it, expect } from 'vitest';
import {
  formatWorkspaceMembersTable,
  formatGenericTable,
} from '../../../src/formatters/table';
import { WorkspaceMember } from '../../../src/api/types';

describe('table formatter', () => {
  describe('formatWorkspaceMembersTable', () => {
    it('should format workspace members as a table', () => {
      const members: WorkspaceMember[] = [
        {
          id: {
            workspace_id: 'ws-123',
            workspace_member_id: 'mem-456',
          },
          first_name: 'John',
          last_name: 'Doe',
          email_address: 'john@example.com',
          avatar_url: 'https://example.com/avatar.jpg',
          access_level: 'admin',
          created_at: '2024-01-01T00:00:00.000000000Z',
        },
      ];

      const result = formatWorkspaceMembersTable(members);

      expect(result).toContain('Member ID');
      expect(result).toContain('First Name');
      expect(result).toContain('Last Name');
      expect(result).toContain('Email');
      expect(result).toContain('Access Level');
      expect(result).toContain('mem-456');
      expect(result).toContain('John');
      expect(result).toContain('Doe');
      expect(result).toContain('john@example.com');
      expect(result).toContain('admin');
    });

    it('should handle multiple members', () => {
      const members: WorkspaceMember[] = [
        {
          id: {
            workspace_id: 'ws-123',
            workspace_member_id: 'mem-1',
          },
          first_name: 'John',
          last_name: 'Doe',
          email_address: 'john@example.com',
          avatar_url: null,
          access_level: 'admin',
          created_at: '2024-01-01T00:00:00.000000000Z',
        },
        {
          id: {
            workspace_id: 'ws-123',
            workspace_member_id: 'mem-2',
          },
          first_name: 'Jane',
          last_name: 'Smith',
          email_address: 'jane@example.com',
          avatar_url: null,
          access_level: 'member',
          created_at: '2024-01-02T00:00:00.000000000Z',
        },
      ];

      const result = formatWorkspaceMembersTable(members);

      expect(result).toContain('mem-1');
      expect(result).toContain('mem-2');
      expect(result).toContain('John');
      expect(result).toContain('Jane');
    });

    it('should handle empty member list', () => {
      const members: WorkspaceMember[] = [];
      const result = formatWorkspaceMembersTable(members);

      expect(result).toContain('Member ID');
      expect(result).toBeTruthy();
    });
  });

  describe('formatGenericTable', () => {
    it('should format generic data as a table', () => {
      const data = [
        { id: '1', name: 'Alice', status: 'active' },
        { id: '2', name: 'Bob', status: 'inactive' },
      ];

      const result = formatGenericTable(data);

      expect(result).toContain('id');
      expect(result).toContain('name');
      expect(result).toContain('status');
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });

    it('should handle null values', () => {
      const data = [{ id: '1', name: 'Alice', avatar: null }];

      const result = formatGenericTable(data);

      expect(result).toBeTruthy();
      expect(result).toContain('Alice');
    });

    it('should handle nested objects by stringifying', () => {
      const data = [{ id: '1', metadata: { key: 'value' } }];

      const result = formatGenericTable(data);

      expect(result).toContain('id');
      expect(result).toContain('metadata');
      expect(result).toContain('key');
    });

    it('should return message for empty data', () => {
      const data: Array<Record<string, unknown>> = [];

      const result = formatGenericTable(data);

      expect(result).toBe('No data to display');
    });
  });
});
