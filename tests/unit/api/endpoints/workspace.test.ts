import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkspaceEndpoints } from '../../../../src/api/endpoints/workspace';
import { AttioClient } from '../../../../src/api/client';

describe('WorkspaceEndpoints', () => {
  let mockClient: AttioClient;
  let workspaceEndpoints: WorkspaceEndpoints;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as AttioClient;
    workspaceEndpoints = new WorkspaceEndpoints(mockClient);
  });

  describe('listMembers', () => {
    it('should fetch workspace members without options', async () => {
      const mockResponse = {
        data: [
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
        ],
      };

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await workspaceEndpoints.listMembers();

      expect(mockClient.get).toHaveBeenCalledWith('/workspace_members', {});
      expect(result).toEqual(mockResponse.data);
      expect(result).toHaveLength(1);
      expect(result[0].first_name).toBe('John');
    });

    it('should apply limit client-side', async () => {
      const mockResponse = {
        data: [
          {
            id: { workspace_id: 'ws-1', workspace_member_id: 'mem-1' },
            first_name: 'A',
            last_name: 'B',
            email_address: 'a@b.com',
            avatar_url: null,
            access_level: 'admin',
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: { workspace_id: 'ws-1', workspace_member_id: 'mem-2' },
            first_name: 'C',
            last_name: 'D',
            email_address: 'c@d.com',
            avatar_url: null,
            access_level: 'member',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      };
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await workspaceEndpoints.listMembers({ limit: 1 });

      expect(mockClient.get).toHaveBeenCalledWith('/workspace_members', {});
      expect(result).toHaveLength(1);
      expect(result[0].first_name).toBe('A');
    });

    it('should apply offset client-side', async () => {
      const mockResponse = {
        data: [
          {
            id: { workspace_id: 'ws-1', workspace_member_id: 'mem-1' },
            first_name: 'A',
            last_name: 'B',
            email_address: 'a@b.com',
            avatar_url: null,
            access_level: 'admin',
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: { workspace_id: 'ws-1', workspace_member_id: 'mem-2' },
            first_name: 'C',
            last_name: 'D',
            email_address: 'c@d.com',
            avatar_url: null,
            access_level: 'member',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      };
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await workspaceEndpoints.listMembers({ offset: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].first_name).toBe('C');
    });

    it('should validate response against schema', async () => {
      const invalidResponse = {
        data: [
          {
            id: { workspace_id: 'ws-123', workspace_member_id: 'mem-456' },
            // Missing required fields
          },
        ],
      };

      vi.mocked(mockClient.get).mockResolvedValue(invalidResponse);

      await expect(workspaceEndpoints.listMembers()).rejects.toThrow();
    });
  });

  describe('getMember', () => {
    it('should fetch a specific workspace member', async () => {
      const mockMember = {
        id: {
          workspace_id: 'ws-123',
          workspace_member_id: 'mem-456',
        },
        first_name: 'Jane',
        last_name: 'Smith',
        email_address: 'jane@example.com',
        avatar_url: null,
        access_level: 'member',
        created_at: '2024-01-01T00:00:00.000000000Z',
      };

      vi.mocked(mockClient.get).mockResolvedValue({ data: mockMember });

      const result = await workspaceEndpoints.getMember('mem-456');

      expect(mockClient.get).toHaveBeenCalledWith('/workspace_members/mem-456');
      expect(result).toEqual(mockMember);
      expect(result.first_name).toBe('Jane');
    });

    it('should validate response against schema', async () => {
      const invalidMember = {
        id: { workspace_id: 'ws-123', workspace_member_id: 'mem-456' },
        // Missing required fields
      };

      vi.mocked(mockClient.get).mockResolvedValue({ data: invalidMember });

      await expect(workspaceEndpoints.getMember('mem-456')).rejects.toThrow();
    });
  });
});
