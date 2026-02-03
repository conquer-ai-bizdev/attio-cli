import { AttioClient } from '../client';
import {
  ListsResponseSchema,
  ListSchema,
  List,
  ListEntriesResponseSchema,
  ListEntry,
} from '../types';
import { validate } from '../../utils/validation';

export interface ListOptions {
  limit?: number;
  offset?: number;
}

export interface ListEntriesOptions {
  limit?: number;
  offset?: number;
  filter?: Record<string, unknown>;
  sorts?: Array<{ attribute: string; direction: 'asc' | 'desc' }>;
}

export class ListEndpoints {
  constructor(private client: AttioClient) {}

  async listLists(options?: ListOptions): Promise<List[]> {
    const params: Record<string, unknown> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;

    const response = await this.client.get('/lists', params);
    const validated = validate(ListsResponseSchema, response);
    return validated.data;
  }

  async getList(listSlug: string): Promise<List> {
    const response = await this.client.get(`/lists/${listSlug}`);
    const dataResponse = response as { data: unknown };
    return validate(ListSchema, dataResponse.data);
  }

  async listEntries(
    listSlug: string,
    options?: ListEntriesOptions
  ): Promise<ListEntry[]> {
    const response = await this.client.post(
      `/lists/${listSlug}/entries/query`,
      {
        filter: options?.filter,
        sorts: options?.sorts,
        limit: options?.limit,
        offset: options?.offset,
      }
    );
    const validated = validate(ListEntriesResponseSchema, response);
    return validated.data;
  }
}
