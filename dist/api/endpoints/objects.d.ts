import { AttioClient } from '../client';
import { ObjectType, ObjectView, Attribute } from '../types';
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
export declare class ObjectEndpoints {
    private client;
    private attributeEndpoints;
    constructor(client: AttioClient);
    listObjects(): Promise<ObjectType[]>;
    getObject(objectSlug: string): Promise<ObjectType>;
    listViewsPage(objectSlug: string, options?: ListObjectViewsOptions): Promise<ObjectViewPage>;
    listAllViews(objectSlug: string, options?: Omit<ListObjectViewsOptions, 'cursor'>): Promise<CompleteObjectViewInventory>;
    listAttributes(objectSlug: string): Promise<Attribute[]>;
    getAttribute(objectSlug: string, attributeSlug: string): Promise<Attribute>;
}
//# sourceMappingURL=objects.d.ts.map