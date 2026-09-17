import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { RecordEndpoints } from '../../../../src/api/endpoints/records';
import { NotFoundError } from '../../../../src/api/errors';

const record = (recordId: string) => ({
  data: {
    id: {
      workspace_id: '9780942b-3be5-4d62-b188-a0bd03da1aeb',
      object_id: 'companies-object-id',
      record_id: recordId,
    },
    values: {},
    created_at: '2026-09-17T00:00:00.000Z',
  },
});

describe('RecordEndpoints.getRecordsByIds', () => {
  let mockClient: AttioClient;
  let records: RecordEndpoints;

  beforeEach(() => {
    mockClient = { get: vi.fn() } as unknown as AttioClient;
    records = new RecordEndpoints(mockClient);
  });

  it('returns an empty list when none of the requested records exist', async () => {
    vi.mocked(mockClient.get).mockRejectedValue(new NotFoundError());

    await expect(
      records.getRecordsByIds('companies', ['missing-1', 'missing-2'])
    ).resolves.toEqual([]);
  });

  it('returns existing records in request order and omits missing records', async () => {
    vi.mocked(mockClient.get).mockImplementation(async (path) => {
      if (String(path).endsWith('/missing')) throw new NotFoundError();
      if (String(path).endsWith('/first')) return record('first');
      return record('second');
    });

    await expect(
      records.getRecordsByIds('companies', ['first', 'missing', 'second'])
    ).resolves.toEqual([record('first').data, record('second').data]);
  });

  it('deduplicates requested IDs before reading Attio', async () => {
    vi.mocked(mockClient.get).mockResolvedValue(record('first'));

    await records.getRecordsByIds('companies', ['first', 'first']);

    expect(mockClient.get).toHaveBeenCalledTimes(1);
  });
});

describe('RecordEndpoints.mergeRecords', () => {
  it('uses the documented data wrapper and returns the new record ID', async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue({
        data: { new_record_id: 'merged-record' },
      }),
    } as unknown as AttioClient;
    const records = new RecordEndpoints(mockClient);

    const result = await records.mergeRecords(
      'companies',
      'primary-record',
      'secondary-record'
    );

    expect(mockClient.post).toHaveBeenCalledWith(
      '/objects/companies/records/merge',
      {
        data: {
          primary_record_id: 'primary-record',
          secondary_record_id: 'secondary-record',
        },
      }
    );
    expect(result).toEqual({ new_record_id: 'merged-record' });
  });
});

describe('RecordEndpoints.listAllRecords', () => {
  it('continues until a short page proves the inventory is complete', async () => {
    const mockClient = {
      post: vi
        .fn()
        .mockResolvedValueOnce({
          data: [record('one').data, record('two').data],
        })
        .mockResolvedValueOnce({ data: [] }),
    } as unknown as AttioClient;
    const records = new RecordEndpoints(mockClient);

    const result = await records.listAllRecords('companies', { limit: 2 });

    expect(mockClient.post).toHaveBeenNthCalledWith(
      2,
      '/objects/companies/records/query',
      { limit: 2, offset: 2 }
    );
    expect(result.pagination).toEqual({
      complete: true,
      pages: 2,
      items: 2,
      duplicates_removed: 0,
      next_offset: null,
    });
  });
});
