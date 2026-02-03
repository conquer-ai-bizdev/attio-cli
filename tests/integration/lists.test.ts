import { describe, it, expect, beforeAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { ListEndpoints } from '../../src/api/endpoints/lists';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Lists Integration Tests', () => {
  let client: AttioClient;
  let listApi: ListEndpoints;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    listApi = new ListEndpoints(client);
  });

  describe('List Lists', () => {
    it('should list all lists', async () => {
      const lists = await listApi.listLists({ limit: 10 });

      expect(lists).toBeInstanceOf(Array);

      if (lists.length > 0) {
        const list = lists[0];
        expect(list.id).toBeDefined();
        expect(list.id.list_id).toBeDefined();
        expect(list.api_slug).toBeDefined();
        expect(list.name).toBeDefined();
        expect(list.parent_object).toBeDefined();
        expect(list.created_at).toBeDefined();
      }
    });

    it('should accept limit parameter (may not be enforced by API)', async () => {
      // Note: The /lists endpoint may not actually enforce limit/offset
      // This test just verifies the parameter doesn't cause errors
      const lists = await listApi.listLists({ limit: 2 });

      expect(lists).toBeInstanceOf(Array);
      // API may return more than limit - just verify it works
    });
  });

  describe('Get List', () => {
    it.skip('should get a specific list by slug', async () => {
      // First get a list to use for testing
      const lists = await listApi.listLists({ limit: 1 });

      if (lists.length === 0) {
        console.log('No lists available for testing');
        return;
      }

      const listSlug = lists[0].api_slug;
      const list = await listApi.getList(listSlug);

      expect(list).toBeDefined();
      expect(list.api_slug).toBe(listSlug);
      expect(list.id).toBeDefined();
      expect(list.name).toBeDefined();
    });
  });

  describe('List Entries', () => {
    it.skip('should list entries without filter', async () => {
      // First get a list to use for testing
      const lists = await listApi.listLists({ limit: 1 });

      if (lists.length === 0) {
        console.log('No lists available for testing');
        return;
      }

      const listSlug = lists[0].api_slug;
      const entries = await listApi.listEntries(listSlug, { limit: 5 });

      expect(entries).toBeInstanceOf(Array);

      if (entries.length > 0) {
        const entry = entries[0];
        expect(entry.id).toBeDefined();
        expect(entry.id.entry_id).toBeDefined();
        expect(entry.parent_record_id).toBeDefined();
        expect(entry.created_at).toBeDefined();
      }
    });

    it.skip('should filter entries by attribute', async () => {
      // This test is skipped because we don't know what attributes exist
      // in the workspace's lists. This is a placeholder for future testing
      // when we know the structure of a specific list.
      expect(true).toBe(true);
    });

    it.skip('should sort entries', async () => {
      // First get a list to use for testing
      const lists = await listApi.listLists({ limit: 1 });

      if (lists.length === 0) {
        console.log('No lists available for testing');
        return;
      }

      const listSlug = lists[0].api_slug;
      const entries = await listApi.listEntries(listSlug, {
        sorts: [{ attribute: 'created_at', direction: 'desc' }],
        limit: 5,
      });

      expect(entries).toBeInstanceOf(Array);

      // Verify sorting
      if (entries.length > 1) {
        for (let i = 0; i < entries.length - 1; i++) {
          const current = new Date(entries[i].created_at);
          const next = new Date(entries[i + 1].created_at);
          expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid list slug', async () => {
      await expect(
        listApi.getList('nonexistent-list-slug-12345')
      ).rejects.toThrow();
    });

    it.skip('should handle invalid filter on entries', async () => {
      // First get a list to use for testing
      const lists = await listApi.listLists({ limit: 1 });

      if (lists.length === 0) {
        console.log('No lists available for testing');
        return;
      }

      const listSlug = lists[0].api_slug;
      const filter = {
        nonexistent_attribute_12345: {
          $eq: 'value',
        },
      };

      // Should throw error for unknown attribute
      await expect(
        listApi.listEntries(listSlug, {
          filter,
          limit: 5,
        })
      ).rejects.toThrow();
    });
  });
});
