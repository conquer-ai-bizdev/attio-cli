import { AttioClient } from '../client';
import {
  ObjectsResponseSchema,
  ObjectSchema,
  ObjectType,
  Attribute,
} from '../types';
import { validate } from '../../utils/validation';
import { AttributeEndpoints } from './attributes';

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
