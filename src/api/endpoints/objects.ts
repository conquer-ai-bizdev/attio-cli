import { AttioClient } from '../client';
import {
  ObjectsResponseSchema,
  ObjectSchema,
  ObjectType,
  AttributesResponseSchema,
  Attribute,
} from '../types';
import { validate } from '../../utils/validation';

export class ObjectEndpoints {
  constructor(private client: AttioClient) {}

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

  async listAttributes(objectSlug: string): Promise<Attribute[]> {
    const response = await this.client.get(
      `/objects/${objectSlug}/attributes`
    );
    const validated = validate(AttributesResponseSchema, response);
    return validated.data;
  }

  async getAttribute(
    objectSlug: string,
    attributeSlug: string
  ): Promise<Attribute> {
    const response = await this.client.get(
      `/objects/${objectSlug}/attributes/${attributeSlug}`
    );
    const dataResponse = response as { data: unknown };
    return validate(AttributesResponseSchema, dataResponse).data[0];
  }
}
