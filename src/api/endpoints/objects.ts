import { AttioClient } from '../client';
import {
  ObjectsResponseSchema,
  ObjectSchema,
  ObjectType,
  ObjectView,
  ObjectViewsResponseSchema,
  Attribute,
} from '../types';
import { validate } from '../../utils/validation';
import { AttributeEndpoints } from './attributes';

export interface ListObjectViewsOptions {
  show_archived?: boolean;
  limit?: number;
  cursor?: string;
}

export interface ObjectViewPage {
  data: ObjectView[];
  pagination: {
    next_cursor: string | null;
  };
}

export interface CompleteObjectViewInventory {
  data: ObjectView[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_cursor: null;
  };
}

export class ObjectEndpoints {
  private attributeEndpoints: AttributeEndpoints;

  constructor(private client: AttioClient) {
    this.attributeEndpoints = new AttributeEndpoints(client);
  }

  async listObjects(): Promise<ObjectType[]> {
    const response = await this.client.get('/objects');
    const validated = validate(ObjectsResponseSchema, response);
    return validated.data;
  }

  async getObject(objectSlug: string): Promise<ObjectType> {
    const response = await this.client.get(`/objects/${objectSlug}`);
    const dataResponse = response as { data: unknown };
    return validate(ObjectSchema, dataResponse.data);
  }

  async listViewsPage(
    objectSlug: string,
    options: ListObjectViewsOptions = {}
  ): Promise<ObjectViewPage> {
    const limit = options.limit ?? 500;
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      throw new Error('Object view limit must be an integer between 1 and 1000.');
    }

    const params: Record<string, unknown> = { limit };
    if (options.show_archived) params.show_archived = true;
    if (options.cursor) params.cursor = options.cursor;

    const response = await this.client.get(
      `/objects/${objectSlug}/views`,
      params
    );
    return validate(ObjectViewsResponseSchema, response);
  }

  async listAllViews(
    objectSlug: string,
    options: Omit<ListObjectViewsOptions, 'cursor'> = {}
  ): Promise<CompleteObjectViewInventory> {
    const byId = new Map<string, ObjectView>();
    let cursor: string | undefined;
    let pages = 0;
    let observedItems = 0;

    do {
      const page = await this.listViewsPage(objectSlug, {
        ...options,
        ...(cursor ? { cursor } : {}),
      });
      pages += 1;
      observedItems += page.data.length;
      for (const view of page.data) byId.set(view.id.view_id, view);
      cursor = page.pagination.next_cursor ?? undefined;
    } while (cursor);

    const data = [...byId.values()];
    return {
      data,
      pagination: {
        complete: true,
        pages,
        items: data.length,
        duplicates_removed: observedItems - data.length,
        next_cursor: null,
      },
    };
  }

  // Delegate attribute operations to AttributeEndpoints for consistency
  async listAttributes(objectSlug: string): Promise<Attribute[]> {
    return this.attributeEndpoints.listAttributes('objects', objectSlug);
  }

  async getAttribute(
    objectSlug: string,
    attributeSlug: string
  ): Promise<Attribute> {
    return this.attributeEndpoints.getAttribute(
      'objects',
      objectSlug,
      attributeSlug
    );
  }
}
