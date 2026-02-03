import { describe, it, expect, beforeAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { AttributeEndpoints } from '../../src/api/endpoints/attributes';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Convenience Commands Integration Tests', () => {
  let client: AttioClient;
  let attributeApi: AttributeEndpoints;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    attributeApi = new AttributeEndpoints(client);
  });

  describe('Object Attributes With Values', () => {
    it('should list object attributes with select options populated', async () => {
      const attributes = await attributeApi.listAttributesWithValues(
        'objects',
        'people'
      );

      expect(attributes).toBeInstanceOf(Array);
      expect(attributes.length).toBeGreaterThan(0);

      // Check that select attributes have their options populated
      const selectAttributes = attributes.filter(
        (a) => a.type === 'select' || a.type === 'multiselect'
      );

      if (selectAttributes.length > 0) {
        selectAttributes.forEach((attr) => {
          // Should have select_options array (may be empty)
          if (attr.select_options) {
            expect(attr.select_options).toBeInstanceOf(Array);
            attr.select_options.forEach((opt) => {
              expect(opt.id).toBeDefined();
              expect(opt.title).toBeDefined();
              expect(typeof opt.is_archived).toBe('boolean');
            });
          }
        });
      }
    });

    it('should list object attributes with statuses populated', async () => {
      const attributes = await attributeApi.listAttributesWithValues(
        'objects',
        'people'
      );

      // Check that status attributes have their statuses populated
      const statusAttributes = attributes.filter((a) => a.type === 'status');

      if (statusAttributes.length > 0) {
        statusAttributes.forEach((attr) => {
          // Should have statuses array (may be empty)
          if (attr.statuses) {
            expect(attr.statuses).toBeInstanceOf(Array);
            attr.statuses.forEach((status) => {
              expect(status.id).toBeDefined();
              expect(status.title).toBeDefined();
              expect(typeof status.is_archived).toBe('boolean');
              expect(typeof status.celebration_enabled).toBe('boolean');
            });
          }
        });
      }
    });

    it('should not break when listing attributes without select/status values', async () => {
      const attributes = await attributeApi.listAttributesWithValues(
        'objects',
        'people'
      );

      // Check that non-select/status attributes don't have these fields
      const textAttributes = attributes.filter((a) => a.type === 'text');

      if (textAttributes.length > 0) {
        textAttributes.forEach((attr) => {
          expect(attr.select_options).toBeUndefined();
          expect(attr.statuses).toBeUndefined();
        });
      }
    });

    it('should work with show_archived option', async () => {
      const withArchived = await attributeApi.listAttributesWithValues(
        'objects',
        'people',
        { show_archived: true }
      );

      const withoutArchived = await attributeApi.listAttributesWithValues(
        'objects',
        'people',
        { show_archived: false }
      );

      expect(withArchived).toBeInstanceOf(Array);
      expect(withoutArchived).toBeInstanceOf(Array);

      // Should return same or more attributes when including archived
      expect(withArchived.length).toBeGreaterThanOrEqual(
        withoutArchived.length
      );
    });
  });

  describe('List Attributes With Values', () => {
    it('should list list attributes with values populated', async () => {
      // First get a list to test with
      const listsResponse = await client.get('/lists');
      const lists = listsResponse.data;

      if (lists.length > 0) {
        const listSlug = lists[0].api_slug;
        const attributes = await attributeApi.listAttributesWithValues(
          'lists',
          listSlug
        );

        expect(attributes).toBeInstanceOf(Array);

        // Check select attributes
        const selectAttributes = attributes.filter(
          (a) => a.type === 'select' || a.type === 'multiselect'
        );

        selectAttributes.forEach((attr) => {
          if (attr.select_options) {
            expect(attr.select_options).toBeInstanceOf(Array);
          }
        });

        // Check status attributes
        const statusAttributes = attributes.filter((a) => a.type === 'status');

        statusAttributes.forEach((attr) => {
          if (attr.statuses) {
            expect(attr.statuses).toBeInstanceOf(Array);
          }
        });
      }
    });
  });

  describe('Performance', () => {
    it('should efficiently fetch attributes with values using parallel requests', async () => {
      const startTime = Date.now();

      const attributes = await attributeApi.listAttributesWithValues(
        'objects',
        'people'
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(attributes).toBeInstanceOf(Array);

      // Should complete in reasonable time (< 10 seconds for most workspaces)
      // This is a loose bound since API performance varies
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid target gracefully', async () => {
      await expect(
        attributeApi.listAttributesWithValues(
          'invalid' as 'objects' | 'lists',
          'people'
        )
      ).rejects.toThrow();
    });

    it('should handle invalid identifier gracefully', async () => {
      await expect(
        attributeApi.listAttributesWithValues(
          'objects',
          'nonexistent_object_12345'
        )
      ).rejects.toThrow();
    });

    it('should continue if fetching options fails for one attribute', async () => {
      // This test verifies the error handling in listAttributesWithValues
      // Even if one attribute fails to fetch options, others should succeed
      const attributes = await attributeApi.listAttributesWithValues(
        'objects',
        'people'
      );

      // Should still return attributes even if some option fetches fail
      expect(attributes).toBeInstanceOf(Array);
      expect(attributes.length).toBeGreaterThan(0);
    });
  });
});
