import { describe, it, expect, beforeAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { ObjectEndpoints } from '../../src/api/endpoints/objects';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Objects Integration Tests', () => {
  let client: AttioClient;
  let objectApi: ObjectEndpoints;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    objectApi = new ObjectEndpoints(client);
  });

  describe('List Objects', () => {
    it('should list all objects', async () => {
      const objects = await objectApi.listObjects();

      expect(objects).toBeInstanceOf(Array);
      expect(objects.length).toBeGreaterThan(0);

      objects.forEach((obj) => {
        expect(obj.id).toBeDefined();
        expect(obj.api_slug).toBeDefined();
        expect(obj.singular_noun).toBeDefined();
        expect(obj.plural_noun).toBeDefined();
        // is_built_in and is_workspace_level are optional in API
        if (obj.is_built_in !== undefined) {
          expect(typeof obj.is_built_in).toBe('boolean');
        }
        if (obj.is_workspace_level !== undefined) {
          expect(typeof obj.is_workspace_level).toBe('boolean');
        }
      });
    });

    it('should include standard objects like people and companies', async () => {
      const objects = await objectApi.listObjects();
      const slugs = objects.map((o) => o.api_slug);

      expect(slugs).toContain('people');
      expect(slugs).toContain('companies');
    });
  });

  describe('Get Object', () => {
    it('should get object by slug', async () => {
      const obj = await objectApi.getObject('people');

      expect(obj).toBeDefined();
      expect(obj.api_slug).toBe('people');
      expect(obj.singular_noun).toBeDefined();
      expect(obj.plural_noun).toBeDefined();
    });

    it('should throw error for invalid slug', async () => {
      await expect(
        objectApi.getObject('nonexistent-object-12345')
      ).rejects.toThrow();
    });
  });

  describe('List Attributes', () => {
    it('should list attributes for an object', async () => {
      const attributes = await objectApi.listAttributes('people');

      expect(attributes).toBeInstanceOf(Array);
      expect(attributes.length).toBeGreaterThan(0);

      attributes.forEach((attr) => {
        expect(attr.id).toBeDefined();
        expect(attr.api_slug).toBeDefined();
        expect(attr.title).toBeDefined();
        expect(attr.type).toBeDefined();
        expect(typeof attr.is_required).toBe('boolean');
        expect(typeof attr.is_unique).toBe('boolean');
        expect(typeof attr.is_system_attribute).toBe('boolean');
      });
    });

    it('should include standard attributes like name', async () => {
      const attributes = await objectApi.listAttributes('people');
      const slugs = attributes.map((a) => a.api_slug);

      expect(slugs.some((s) => s.includes('name'))).toBe(true);
    });
  });
});
