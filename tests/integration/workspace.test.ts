import { describe, it, expect, beforeAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { WorkspaceEndpoints } from '../../src/api/endpoints/workspace';
import { formatJson } from '../../src/formatters/json';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Workspace Integration Tests', () => {
  let client: AttioClient;
  let workspaceApi: WorkspaceEndpoints;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    workspaceApi = new WorkspaceEndpoints(client);
  });

  describe('List Workspace Members', () => {
    it('should list all workspace members', async () => {
      const members = await workspaceApi.listMembers();

      expect(members).toBeInstanceOf(Array);
      expect(members.length).toBeGreaterThan(0);

      // Verify each member has required fields
      members.forEach((member) => {
        expect(member.id).toBeDefined();
        expect(member.id.workspace_id).toBeDefined();
        expect(member.id.workspace_member_id).toBeDefined();
        expect(member.first_name).toBeDefined();
        expect(member.last_name).toBeDefined();
        expect(member.email_address).toBeDefined();
        expect(member.access_level).toBeDefined();
        expect(['admin', 'member', 'suspended']).toContain(
          member.access_level
        );
      });
    });

    it('should respect limit option', async () => {
      const members = await workspaceApi.listMembers({ limit: 2 });

      expect(members).toBeInstanceOf(Array);
      expect(members.length).toBeLessThanOrEqual(2);
    });

    it('should respect offset option', async () => {
      const allMembers = await workspaceApi.listMembers();
      const offsetMembers = await workspaceApi.listMembers({ offset: 1 });

      expect(offsetMembers).toBeInstanceOf(Array);

      // If there are enough members, offset should skip the first one
      if (allMembers.length > 1) {
        expect(offsetMembers.length).toBe(allMembers.length - 1);
        expect(offsetMembers[0].id.workspace_member_id).toBe(
          allMembers[1].id.workspace_member_id
        );
      }
    });

    it('should work with limit and offset together', async () => {
      const members = await workspaceApi.listMembers({ limit: 1, offset: 1 });

      expect(members).toBeInstanceOf(Array);
      expect(members.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Get Workspace Member', () => {
    it('should get a specific workspace member', async () => {
      // First get the list to get a valid member ID
      const members = await workspaceApi.listMembers({ limit: 1 });
      expect(members.length).toBeGreaterThan(0);

      const memberId = members[0].id.workspace_member_id;

      // Now get that specific member
      const member = await workspaceApi.getMember(memberId);

      expect(member).toBeDefined();
      expect(member.id.workspace_member_id).toBe(memberId);
      expect(member.first_name).toBeDefined();
      expect(member.last_name).toBeDefined();
      expect(member.email_address).toBeDefined();
    });

    it('should throw error for invalid member ID', async () => {
      await expect(
        workspaceApi.getMember('invalid-member-id-12345')
      ).rejects.toThrow();
    });
  });

  describe('Formatters', () => {
    it('should format members as JSON', async () => {
      const members = await workspaceApi.listMembers({ limit: 1 });
      const json = formatJson(members);

      expect(json).toBeDefined();
      expect(() => JSON.parse(json)).not.toThrow();

      const parsed = JSON.parse(json);
      expect(parsed).toBeInstanceOf(Array);
      expect(parsed.length).toBe(members.length);
    });

  });

  describe('End-to-End Workflow', () => {
    it('should complete full list workflow', async () => {
      // List members
      const members = await workspaceApi.listMembers({ limit: 5 });
      expect(members.length).toBeGreaterThan(0);

      // Format as JSON
      const json = formatJson(members);
      expect(JSON.parse(json)).toEqual(members);

    });

    it('should complete full get workflow', async () => {
      // Get first member's ID
      const members = await workspaceApi.listMembers({ limit: 1 });
      const memberId = members[0].id.workspace_member_id;

      // Get specific member
      const member = await workspaceApi.getMember(memberId);
      expect(member.id.workspace_member_id).toBe(memberId);

      // Format outputs
      const json = formatJson(member);
      expect(JSON.parse(json).id.workspace_member_id).toBe(memberId);

    });
  });
});
