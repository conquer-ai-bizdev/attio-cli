import { AttioClient } from '../client';
import { Attribute, SelectOption, Status, AttributeWithValues } from '../types';
export interface ListAttributesOptions {
    show_archived?: boolean;
    limit?: number;
    offset?: number;
}
export interface CreateAttributeData {
    data: {
        title: string;
        api_slug: string;
        type: string;
        description: string;
        is_required: boolean;
        is_unique: boolean;
        is_multiselect: boolean;
        config: Record<string, unknown>;
    };
}
export interface UpdateAttributeData {
    data: {
        title?: string;
        description?: string;
        is_required?: boolean;
        is_unique?: boolean;
        config?: Record<string, unknown>;
    };
}
export interface ListOptionsOptions {
    show_archived?: boolean;
    limit?: number;
    offset?: number;
}
export interface CreateSelectOptionData {
    data: {
        title: string;
    };
}
export interface UpdateSelectOptionData {
    data: {
        title?: string;
        is_archived?: boolean;
    };
}
export interface ListStatusesOptions {
    show_archived?: boolean;
    limit?: number;
    offset?: number;
}
export interface CreateStatusData {
    data: {
        title: string;
        celebration_enabled?: boolean;
        target_time_in_status?: string;
    };
}
export interface UpdateStatusData {
    data: {
        title?: string;
        is_archived?: boolean;
        celebration_enabled?: boolean;
        target_time_in_status?: string | null;
    };
}
export declare class AttributeEndpoints {
    private client;
    constructor(client: AttioClient);
    listAttributes(target: 'objects' | 'lists', identifier: string, options?: ListAttributesOptions): Promise<Attribute[]>;
    getAttribute(target: 'objects' | 'lists', identifier: string, attributeSlug: string): Promise<Attribute>;
    createAttribute(target: 'objects' | 'lists', identifier: string, data: CreateAttributeData): Promise<Attribute>;
    updateAttribute(target: 'objects' | 'lists', identifier: string, attributeSlug: string, data: UpdateAttributeData): Promise<Attribute>;
    deleteAttribute(target: 'objects' | 'lists', identifier: string, attributeSlug: string): Promise<void>;
    listSelectOptions(target: 'objects' | 'lists', identifier: string, attributeSlug: string, options?: ListOptionsOptions): Promise<SelectOption[]>;
    createSelectOption(target: 'objects' | 'lists', identifier: string, attributeSlug: string, data: CreateSelectOptionData): Promise<SelectOption>;
    updateSelectOption(target: 'objects' | 'lists', identifier: string, attributeSlug: string, optionId: string, data: UpdateSelectOptionData): Promise<SelectOption>;
    deleteSelectOption(target: 'objects' | 'lists', identifier: string, attributeSlug: string, optionId: string): Promise<void>;
    listStatuses(target: 'objects' | 'lists', identifier: string, attributeSlug: string, options?: ListStatusesOptions): Promise<Status[]>;
    createStatus(target: 'objects' | 'lists', identifier: string, attributeSlug: string, data: CreateStatusData): Promise<Status>;
    updateStatus(target: 'objects' | 'lists', identifier: string, attributeSlug: string, statusId: string, data: UpdateStatusData): Promise<Status>;
    deleteStatus(target: 'objects' | 'lists', identifier: string, attributeSlug: string, statusId: string): Promise<void>;
    listAttributesWithValues(target: 'objects' | 'lists', identifier: string, options?: ListAttributesOptions): Promise<AttributeWithValues[]>;
}
//# sourceMappingURL=attributes.d.ts.map