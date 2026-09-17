import { AttioClient } from '../client';
import { RecordsResponseSchema, RecordSchema, AttioRecord } from '../types';
import { validate } from '../../utils/validation';
import { NotFoundError } from '../errors';

export interface ListRecordsOptions {
  limit?: number;
  offset?: number;
  filter?: Record<string, unknown>;
  sorts?: Array<{ attribute: string; direction: 'asc' | 'desc' }>;
}

export interface RecordPage {
  data: AttioRecord[];
  pagination: {
    complete: boolean;
    offset: number;
    limit: number;
    next_offset: number | null;
  };
}

export interface CompleteRecordInventory {
  data: AttioRecord[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_offset: null;
  };
}

export interface CreateRecordData {
  data: Record<string, unknown>;
}

export interface UpdateRecordData {
  data: Record<string, unknown>;
}

export class RecordEndpoints {
  constructor(private client: AttioClient) {}

  async listRecords(
    objectSlug: string,
    options?: ListRecordsOptions
  ): Promise<AttioRecord[]> {
    return (await this.listRecordsPage(objectSlug, options)).data;
  }

  async listRecordsPage(
    objectSlug: string,
    options: ListRecordsOptions = {}
  ): Promise<RecordPage> {
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    validateOffsetPage(limit, offset, 'Record');
    const body: Record<string, unknown> = { limit, offset };
    if (options.filter !== undefined) body.filter = options.filter;
    if (options.sorts !== undefined) body.sorts = options.sorts;

    const response = await this.client.post(
      `/objects/${objectSlug}/records/query`,
      body
    );
    const validated = validate(RecordsResponseSchema, response);
    const complete = validated.data.length < limit;
    return {
      data: validated.data,
      pagination: {
        complete,
        offset,
        limit,
        next_offset: complete ? null : offset + validated.data.length,
      },
    };
  }

  async listAllRecords(
    objectSlug: string,
    options: Omit<ListRecordsOptions, 'offset'> = {}
  ): Promise<CompleteRecordInventory> {
    const limit = options.limit ?? 50;
    validateOffsetPage(limit, 0, 'Record');
    const byId = new Map<string, AttioRecord>();
    let offset = 0;
    let pages = 0;
    let observedItems = 0;

    while (true) {
      const page = await this.listRecordsPage(objectSlug, {
        ...options,
        limit,
        offset,
      });
      pages += 1;
      observedItems += page.data.length;
      for (const record of page.data) byId.set(record.id.record_id, record);
      if (page.pagination.complete) break;
      offset = page.pagination.next_offset!;
    }

    const data = [...byId.values()];
    return {
      data,
      pagination: {
        complete: true,
        pages,
        items: data.length,
        duplicates_removed: observedItems - data.length,
        next_offset: null,
      },
    };
  }

  async getRecord(objectSlug: string, recordId: string): Promise<AttioRecord> {
    const response = await this.client.get(
      `/objects/${objectSlug}/records/${recordId}`
    );
    const dataResponse = response as { data: unknown };
    return validate(RecordSchema, dataResponse.data);
  }

  async getRecordsByIds(
    objectSlug: string,
    recordIds: string[]
  ): Promise<AttioRecord[]> {
    const uniqueIds = [...new Set(recordIds)];
    const records: AttioRecord[] = [];

    for (let index = 0; index < uniqueIds.length; index += 10) {
      const batch = uniqueIds.slice(index, index + 10);
      const results = await Promise.all(
        batch.map(async (recordId) => {
          try {
            return await this.getRecord(objectSlug, recordId);
          } catch (error) {
            if (error instanceof NotFoundError) return null;
            throw error;
          }
        })
      );
      records.push(
        ...results.filter((record): record is AttioRecord => record !== null)
      );
    }

    return records;
  }

  async createRecord(
    objectSlug: string,
    data: CreateRecordData
  ): Promise<AttioRecord> {
    const response = await this.client.post(
      `/objects/${objectSlug}/records`,
      data
    );
    const dataResponse = response as { data: unknown };
    return validate(RecordSchema, dataResponse.data);
  }

  async updateRecord(
    objectSlug: string,
    recordId: string,
    data: UpdateRecordData
  ): Promise<AttioRecord> {
    const response = await this.client.patch(
      `/objects/${objectSlug}/records/${recordId}`,
      data
    );
    const dataResponse = response as { data: unknown };
    return validate(RecordSchema, dataResponse.data);
  }

  async deleteRecord(objectSlug: string, recordId: string): Promise<void> {
    await this.client.delete(`/objects/${objectSlug}/records/${recordId}`);
  }

  async mergeRecords(
    objectSlug: string,
    primaryRecordId: string,
    secondaryRecordId: string
  ): Promise<{ new_record_id: string }> {
    if (primaryRecordId === secondaryRecordId) {
      throw new Error('Primary and secondary record IDs must be different.');
    }
    const response = await this.client.post(
      `/objects/${objectSlug}/records/merge`,
      {
        data: {
          primary_record_id: primaryRecordId,
          secondary_record_id: secondaryRecordId,
        },
      }
    );
    const data = (response as { data?: { new_record_id?: unknown } }).data;
    if (!data || typeof data.new_record_id !== 'string') {
      throw new Error('Attio returned an invalid record merge response.');
    }
    return { new_record_id: data.new_record_id };
  }

  async assertRecord(
    objectSlug: string,
    matchingAttribute: string,
    data: CreateRecordData
  ): Promise<AttioRecord> {
    const response = await this.client.put(
      `/objects/${objectSlug}/records?matching_attribute=${matchingAttribute}`,
      data
    );
    const dataResponse = response as { data: unknown };
    return validate(RecordSchema, dataResponse.data);
  }
}

function validateOffsetPage(
  limit: number,
  offset: number,
  label: string
): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error(`${label} limit must be an integer between 1 and 50.`);
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error(`${label} offset must be a non-negative integer.`);
  }
}
