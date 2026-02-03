import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { RecordEndpoints } from '../../src/api/endpoints/records';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Records Integration Tests', () => {
  let client: AttioClient;
  let recordApi: RecordEndpoints;
  let testRecordId: string | null = null;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    recordApi = new RecordEndpoints(client);
  });

  afterAll(async () => {
    // Cleanup: delete test record if it was created
    if (testRecordId) {
      try {
        await recordApi.deleteRecord('people', testRecordId);
        console.log(`Cleaned up test record: ${testRecordId}`);
      } catch (error) {
        console.warn(`Failed to cleanup test record: ${error}`);
      }
    }
  });

  describe('List Records', () => {
    it('should list people records', async () => {
      const records = await recordApi.listRecords('people', { limit: 5 });

      expect(records).toBeInstanceOf(Array);

      if (records.length > 0) {
        const record = records[0];
        expect(record.id).toBeDefined();
        expect(record.id.record_id).toBeDefined();
        expect(record.values).toBeDefined();
        expect(record.created_at).toBeDefined();
      }
    });

    it('should respect limit parameter', async () => {
      const records = await recordApi.listRecords('people', { limit: 2 });

      expect(records).toBeInstanceOf(Array);
      expect(records.length).toBeLessThanOrEqual(2);
    });

    it('should list company records', async () => {
      const records = await recordApi.listRecords('companies', { limit: 5 });

      expect(records).toBeInstanceOf(Array);
    });
  });

  describe('Create, Get, Update, Delete Record', () => {
    it.skip('should create a new person record', async () => {
      const testData = {
        data: {
          values: {
            email_addresses: [
              {
                email_address: `test-cli-${Date.now()}@example.com`,
                original_email_address: `test-cli-${Date.now()}@example.com`,
              },
            ],
          },
        },
      };

      const record = await recordApi.createRecord('people', testData);

      expect(record).toBeDefined();
      expect(record.id.record_id).toBeDefined();
      expect(record.values).toBeDefined();

      // Save for later tests and cleanup
      testRecordId = record.id.record_id;
    });

    it.skip('should get the created record', async () => {
      if (!testRecordId) {
        throw new Error('No test record created');
      }

      const record = await recordApi.getRecord('people', testRecordId);

      expect(record).toBeDefined();
      expect(record.id.record_id).toBe(testRecordId);
      expect(record.values).toBeDefined();
    });

    it.skip('should update the record', async () => {
      if (!testRecordId) {
        throw new Error('No test record created');
      }

      const updateData = {
        data: {
          values: {
            email_addresses: [
              {
                email_address: `updated-test-${Date.now()}@example.com`,
                original_email_address: `updated-test-${Date.now()}@example.com`,
              },
            ],
          },
        },
      };

      const record = await recordApi.updateRecord(
        'people',
        testRecordId,
        updateData
      );

      expect(record).toBeDefined();
      expect(record.id.record_id).toBe(testRecordId);
      // Values should be updated
      expect(record.values).toBeDefined();
    });

    it.skip('should delete the record', async () => {
      if (!testRecordId) {
        throw new Error('No test record created');
      }

      await recordApi.deleteRecord('people', testRecordId);

      // Verify deletion by trying to get it (should throw)
      await expect(
        recordApi.getRecord('people', testRecordId)
      ).rejects.toThrow();

      // Mark as null so afterAll doesn't try to delete again
      testRecordId = null;
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid record ID', async () => {
      await expect(
        recordApi.getRecord('people', 'invalid-record-id-12345')
      ).rejects.toThrow();
    });

    it('should throw error for invalid object slug', async () => {
      await expect(
        recordApi.listRecords('nonexistent-object-12345')
      ).rejects.toThrow();
    });
  });
});
