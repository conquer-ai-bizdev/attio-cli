import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { AttributeEndpoints } from '../../src/api/endpoints/attributes';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Attributes Integration Tests', () => {
  let client: AttioClient;
  let attributeApi: AttributeEndpoints;
  let createdAttributeSlug: string | null = null;
  let createdSelectOptionId: string | null = null;
  let createdStatusId: string | null = null;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    attributeApi = new AttributeEndpoints(client);
  });

  afterAll(async () => {
    // Note: Attio API does not support deleting attributes
    // Attributes created during tests will remain but will be archived
    // This is acceptable for integration tests
    if (createdAttributeSlug) {
      console.log(
        `Note: Test attribute ${createdAttributeSlug} remains (cannot be deleted via API)`
      );
    }
  });

  describe('List Attributes', () => {
    it('should list attributes for an object', async () => {
      const attributes = await attributeApi.listAttributes('objects', 'people');

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
        expect(typeof attr.is_archived).toBe('boolean');
      });
    });

    it('should list attributes for a list', async () => {
      // First get a list to test with
      const listsResponse = await client.get('/lists');
      const lists = listsResponse.data;

      if (lists.length > 0) {
        const listSlug = lists[0].api_slug;
        const attributes = await attributeApi.listAttributes('lists', listSlug);

        expect(attributes).toBeInstanceOf(Array);
        // Lists may have 0 or more custom attributes
        attributes.forEach((attr) => {
          expect(attr.id).toBeDefined();
          expect(attr.api_slug).toBeDefined();
          expect(attr.title).toBeDefined();
          expect(attr.type).toBeDefined();
        });
      }
    });
  });

  describe('Get Attribute', () => {
    it('should get a specific attribute', async () => {
      // First list to get a valid slug
      const attributes = await attributeApi.listAttributes('objects', 'people');
      expect(attributes.length).toBeGreaterThan(0);

      const firstAttr = attributes[0];
      const attr = await attributeApi.getAttribute(
        'objects',
        'people',
        firstAttr.api_slug
      );

      expect(attr).toBeDefined();
      expect(attr.api_slug).toBe(firstAttr.api_slug);
      expect(attr.title).toBeDefined();
      expect(attr.type).toBeDefined();
    });

    it('should throw error for invalid attribute slug', async () => {
      await expect(
        attributeApi.getAttribute(
          'objects',
          'people',
          'nonexistent_attribute_12345'
        )
      ).rejects.toThrow();
    });
  });

  describe('Select Options', () => {
    it('should list select options for a select attribute', async () => {
      // Find a select or multiselect attribute
      const attributes = await attributeApi.listAttributes('objects', 'people');
      const selectAttr = attributes.find(
        (a) => a.type === 'select' || a.type === 'multiselect'
      );

      if (selectAttr) {
        const options = await attributeApi.listSelectOptions(
          'objects',
          'people',
          selectAttr.api_slug
        );

        expect(options).toBeInstanceOf(Array);
        // May be empty if no options defined
        options.forEach((opt) => {
          expect(opt.id).toBeDefined();
          expect(opt.id.option_id).toBeDefined();
          expect(opt.title).toBeDefined();
          expect(typeof opt.is_archived).toBe('boolean');
        });
      }
    });
  });

  describe('Statuses', () => {
    it('should list statuses for a status attribute', async () => {
      // Find a status attribute
      const attributes = await attributeApi.listAttributes('objects', 'people');
      const statusAttr = attributes.find((a) => a.type === 'status');

      if (statusAttr) {
        const statuses = await attributeApi.listStatuses(
          'objects',
          'people',
          statusAttr.api_slug
        );

        expect(statuses).toBeInstanceOf(Array);
        // May be empty if no statuses defined
        statuses.forEach((status) => {
          expect(status.id).toBeDefined();
          expect(status.id.status_id).toBeDefined();
          expect(status.title).toBeDefined();
          expect(typeof status.is_archived).toBe('boolean');
          expect(typeof status.celebration_enabled).toBe('boolean');
        });
      }
    });
  });

  describe('Attributes with Values (Convenience)', () => {
    it('should list attributes with their values for an object', async () => {
      const attributes = await attributeApi.listAttributesWithValues(
        'objects',
        'people'
      );

      expect(attributes).toBeInstanceOf(Array);
      expect(attributes.length).toBeGreaterThan(0);

      attributes.forEach((attr) => {
        expect(attr.id).toBeDefined();
        expect(attr.api_slug).toBeDefined();
        expect(attr.title).toBeDefined();

        // Check if select/status attributes have their values populated
        if (attr.type === 'select' || attr.type === 'multiselect') {
          if (attr.select_options) {
            expect(attr.select_options).toBeInstanceOf(Array);
          }
        } else if (attr.type === 'status') {
          if (attr.statuses) {
            expect(attr.statuses).toBeInstanceOf(Array);
          }
        }
      });
    });

    it('should list attributes with their values for a list', async () => {
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
        // Lists may have 0 or more attributes
      }
    });
  });

  describe('CRUD Operations', () => {
    it('should create and update a text attribute', async () => {
      const timestamp = Date.now();
      const attributeSlug = `test_attr_${timestamp}`;

      // Create
      const created = await attributeApi.createAttribute('objects', 'people', {
        data: {
          title: `Test Attribute ${timestamp}`,
          api_slug: attributeSlug,
          type: 'text',
          description: 'Test description',
          is_required: false,
          is_unique: false,
          is_multiselect: false,
          config: {},
        },
      });

      expect(created).toBeDefined();
      expect(created.api_slug).toBe(attributeSlug);
      expect(created.title).toContain('Test Attribute');
      createdAttributeSlug = attributeSlug;

      // Update
      const updated = await attributeApi.updateAttribute(
        'objects',
        'people',
        attributeSlug,
        {
          data: {
            title: `Updated Test Attribute ${timestamp}`,
            description: 'Updated description',
          },
        }
      );

      expect(updated).toBeDefined();
      expect(updated.api_slug).toBe(attributeSlug);
      expect(updated.title).toContain('Updated Test Attribute');

      // Get
      const fetched = await attributeApi.getAttribute(
        'objects',
        'people',
        attributeSlug
      );
      expect(fetched.api_slug).toBe(attributeSlug);

      // Note: Attio API does not support deleting attributes
      // Archive instead by updating
      const archived = await attributeApi.updateAttribute(
        'objects',
        'people',
        attributeSlug,
        {
          data: {
            description: 'Archived - test completed',
          },
        }
      );
      expect(archived.api_slug).toBe(attributeSlug);

      createdAttributeSlug = null; // Don't try to delete in cleanup
    });

    it('should create and manage a select attribute with options', async () => {
      const timestamp = Date.now();
      const attributeSlug = `test_select_${timestamp}`;

      // Create select attribute
      const created = await attributeApi.createAttribute('objects', 'people', {
        data: {
          title: `Test Select ${timestamp}`,
          api_slug: attributeSlug,
          type: 'select',
          description: '',
          is_required: false,
          is_unique: false,
          is_multiselect: false,
          config: {},
        },
      });

      expect(created).toBeDefined();
      expect(created.api_slug).toBe(attributeSlug);
      createdAttributeSlug = attributeSlug;

      // Create select option
      const option = await attributeApi.createSelectOption(
        'objects',
        'people',
        attributeSlug,
        {
          data: {
            title: 'Test Option',
          },
        }
      );

      expect(option).toBeDefined();
      expect(option.title).toBe('Test Option');
      expect(option.is_archived).toBe(false);
      createdSelectOptionId = option.id.option_id;

      // List options
      const options = await attributeApi.listSelectOptions(
        'objects',
        'people',
        attributeSlug
      );
      expect(options.length).toBeGreaterThan(0);
      expect(options.some((o) => o.title === 'Test Option')).toBe(true);

      // Update option
      const updatedOption = await attributeApi.updateSelectOption(
        'objects',
        'people',
        attributeSlug,
        option.id.option_id,
        {
          data: {
            title: 'Updated Test Option',
          },
        }
      );
      expect(updatedOption.title).toBe('Updated Test Option');

      // Archive option instead of deleting
      const archivedOption = await attributeApi.updateSelectOption(
        'objects',
        'people',
        attributeSlug,
        option.id.option_id,
        {
          data: {
            is_archived: true,
          },
        }
      );
      expect(archivedOption.is_archived).toBe(true);
      createdSelectOptionId = null;
      createdAttributeSlug = null; // Don't try to delete in cleanup
    });

    it('should create and manage status attributes on lists', async () => {
      // Status attributes can only be created on lists and custom objects
      // Get a list to test with
      const listsResponse = await client.get('/lists');
      const lists = listsResponse.data;

      if (lists.length === 0) {
        console.log('Skipping status test - no lists available');
        return;
      }

      const listSlug = lists[0].api_slug;
      const timestamp = Date.now();
      const attributeSlug = `test_status_${timestamp}`;

      // Create status attribute on a list
      const created = await attributeApi.createAttribute('lists', listSlug, {
        data: {
          title: `Test Status ${timestamp}`,
          api_slug: attributeSlug,
          type: 'status',
          description: '',
          is_required: false,
          is_unique: false,
          is_multiselect: false,
          config: {},
        },
      });

      expect(created).toBeDefined();
      expect(created.api_slug).toBe(attributeSlug);
      createdAttributeSlug = attributeSlug;

      // Create status
      const status = await attributeApi.createStatus(
        'lists',
        listSlug,
        attributeSlug,
        {
          data: {
            title: 'Test Status',
            celebration_enabled: true,
          },
        }
      );

      expect(status).toBeDefined();
      expect(status.title).toBe('Test Status');
      expect(status.celebration_enabled).toBe(true);
      expect(status.is_archived).toBe(false);
      createdStatusId = status.id.status_id;

      // List statuses
      const statuses = await attributeApi.listStatuses(
        'lists',
        listSlug,
        attributeSlug
      );
      expect(statuses.length).toBeGreaterThan(0);
      expect(statuses.some((s) => s.title === 'Test Status')).toBe(true);

      // Update status
      const updatedStatus = await attributeApi.updateStatus(
        'lists',
        listSlug,
        attributeSlug,
        status.id.status_id,
        {
          data: {
            title: 'Updated Test Status',
            celebration_enabled: false,
          },
        }
      );
      expect(updatedStatus.title).toBe('Updated Test Status');
      expect(updatedStatus.celebration_enabled).toBe(false);

      // Archive status instead of deleting
      const archivedStatus = await attributeApi.updateStatus(
        'lists',
        listSlug,
        attributeSlug,
        status.id.status_id,
        {
          data: {
            is_archived: true,
          },
        }
      );
      expect(archivedStatus.is_archived).toBe(true);
      createdStatusId = null;
      createdAttributeSlug = null; // Don't try to delete in cleanup
    });
  });
});
