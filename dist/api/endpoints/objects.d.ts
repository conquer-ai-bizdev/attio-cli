import { AttioClient } from '../client';
import { ObjectType, Attribute } from '../types';
export declare class ObjectEndpoints {
    private client;
    private attributeEndpoints;
    constructor(client: AttioClient);
    listObjects(): Promise<ObjectType[]>;
    getObject(objectSlug: string): Promise<ObjectType>;
    listAttributes(objectSlug: string): Promise<Attribute[]>;
    getAttribute(objectSlug: string, attributeSlug: string): Promise<Attribute>;
}
//# sourceMappingURL=objects.d.ts.map