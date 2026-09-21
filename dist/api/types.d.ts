import { z } from 'zod';
export type UUID = string & {
    readonly __brand: 'UUID';
};
export type Slug = string & {
    readonly __brand: 'Slug';
};
export declare function asUUID(value: string): UUID;
export declare function asSlug(value: string): Slug;
export declare const TimestampSchema: z.ZodString;
export declare const CreatedBySchema: z.ZodObject<{
    type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workspace_member_id: z.ZodOptional<z.ZodString>;
    api_actor_id: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workspace_member_id: z.ZodOptional<z.ZodString>;
    api_actor_id: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
    id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workspace_member_id: z.ZodOptional<z.ZodString>;
    api_actor_id: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export declare const WorkspaceMemberIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    workspace_member_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_member_id: string;
    workspace_id: string;
}, {
    workspace_member_id: string;
    workspace_id: string;
}>;
export declare const WorkspaceMemberSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        workspace_member_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_member_id: string;
        workspace_id: string;
    }, {
        workspace_member_id: string;
        workspace_id: string;
    }>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email_address: z.ZodString;
    avatar_url: z.ZodNullable<z.ZodString>;
    access_level: z.ZodEnum<["admin", "member", "suspended"]>;
    created_at: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        workspace_member_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_member_id: string;
        workspace_id: string;
    }, {
        workspace_member_id: string;
        workspace_id: string;
    }>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email_address: z.ZodString;
    avatar_url: z.ZodNullable<z.ZodString>;
    access_level: z.ZodEnum<["admin", "member", "suspended"]>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        workspace_member_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_member_id: string;
        workspace_id: string;
    }, {
        workspace_member_id: string;
        workspace_id: string;
    }>;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email_address: z.ZodString;
    avatar_url: z.ZodNullable<z.ZodString>;
    access_level: z.ZodEnum<["admin", "member", "suspended"]>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
export declare const WorkspaceMembersResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            workspace_member_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_member_id: string;
            workspace_id: string;
        }, {
            workspace_member_id: string;
            workspace_id: string;
        }>;
        first_name: z.ZodString;
        last_name: z.ZodString;
        email_address: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
        access_level: z.ZodEnum<["admin", "member", "suspended"]>;
        created_at: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            workspace_member_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_member_id: string;
            workspace_id: string;
        }, {
            workspace_member_id: string;
            workspace_id: string;
        }>;
        first_name: z.ZodString;
        last_name: z.ZodString;
        email_address: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
        access_level: z.ZodEnum<["admin", "member", "suspended"]>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            workspace_member_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_member_id: string;
            workspace_id: string;
        }, {
            workspace_member_id: string;
            workspace_id: string;
        }>;
        first_name: z.ZodString;
        last_name: z.ZodString;
        email_address: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
        access_level: z.ZodEnum<["admin", "member", "suspended"]>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            workspace_member_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_member_id: string;
            workspace_id: string;
        }, {
            workspace_member_id: string;
            workspace_id: string;
        }>;
        first_name: z.ZodString;
        last_name: z.ZodString;
        email_address: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
        access_level: z.ZodEnum<["admin", "member", "suspended"]>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            workspace_member_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_member_id: string;
            workspace_id: string;
        }, {
            workspace_member_id: string;
            workspace_id: string;
        }>;
        first_name: z.ZodString;
        last_name: z.ZodString;
        email_address: z.ZodString;
        avatar_url: z.ZodNullable<z.ZodString>;
        access_level: z.ZodEnum<["admin", "member", "suspended"]>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
}>;
export declare const WorkspaceIdentitySchema: z.ZodObject<{
    active: z.ZodBoolean;
    scope: z.ZodOptional<z.ZodString>;
    client_id: z.ZodOptional<z.ZodString>;
    aud: z.ZodOptional<z.ZodString>;
    authorized_by_workspace_member_id: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    active: z.ZodBoolean;
    scope: z.ZodOptional<z.ZodString>;
    client_id: z.ZodOptional<z.ZodString>;
    aud: z.ZodOptional<z.ZodString>;
    authorized_by_workspace_member_id: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    active: z.ZodBoolean;
    scope: z.ZodOptional<z.ZodString>;
    client_id: z.ZodOptional<z.ZodString>;
    aud: z.ZodOptional<z.ZodString>;
    authorized_by_workspace_member_id: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export type WorkspaceIdentity = z.infer<typeof WorkspaceIdentitySchema>;
export declare const ObjectIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    object_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    object_id: string;
}, {
    workspace_id: string;
    object_id: string;
}>;
export declare const ObjectSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
    }, {
        workspace_id: string;
        object_id: string;
    }>;
    api_slug: z.ZodString;
    singular_noun: z.ZodString;
    plural_noun: z.ZodString;
    created_at: z.ZodString;
    is_built_in: z.ZodOptional<z.ZodBoolean>;
    is_workspace_level: z.ZodOptional<z.ZodBoolean>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
    }, {
        workspace_id: string;
        object_id: string;
    }>;
    api_slug: z.ZodString;
    singular_noun: z.ZodString;
    plural_noun: z.ZodString;
    created_at: z.ZodString;
    is_built_in: z.ZodOptional<z.ZodBoolean>;
    is_workspace_level: z.ZodOptional<z.ZodBoolean>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
    }, {
        workspace_id: string;
        object_id: string;
    }>;
    api_slug: z.ZodString;
    singular_noun: z.ZodString;
    plural_noun: z.ZodString;
    created_at: z.ZodString;
    is_built_in: z.ZodOptional<z.ZodBoolean>;
    is_workspace_level: z.ZodOptional<z.ZodBoolean>;
}, z.ZodTypeAny, "passthrough">>;
export type ObjectType = z.infer<typeof ObjectSchema>;
export declare const ObjectsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
        }, {
            workspace_id: string;
            object_id: string;
        }>;
        api_slug: z.ZodString;
        singular_noun: z.ZodString;
        plural_noun: z.ZodString;
        created_at: z.ZodString;
        is_built_in: z.ZodOptional<z.ZodBoolean>;
        is_workspace_level: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
        }, {
            workspace_id: string;
            object_id: string;
        }>;
        api_slug: z.ZodString;
        singular_noun: z.ZodString;
        plural_noun: z.ZodString;
        created_at: z.ZodString;
        is_built_in: z.ZodOptional<z.ZodBoolean>;
        is_workspace_level: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
        }, {
            workspace_id: string;
            object_id: string;
        }>;
        api_slug: z.ZodString;
        singular_noun: z.ZodString;
        plural_noun: z.ZodString;
        created_at: z.ZodString;
        is_built_in: z.ZodOptional<z.ZodBoolean>;
        is_workspace_level: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
        }, {
            workspace_id: string;
            object_id: string;
        }>;
        api_slug: z.ZodString;
        singular_noun: z.ZodString;
        plural_noun: z.ZodString;
        created_at: z.ZodString;
        is_built_in: z.ZodOptional<z.ZodBoolean>;
        is_workspace_level: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">[];
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
        }, {
            workspace_id: string;
            object_id: string;
        }>;
        api_slug: z.ZodString;
        singular_noun: z.ZodString;
        plural_noun: z.ZodString;
        created_at: z.ZodString;
        is_built_in: z.ZodOptional<z.ZodBoolean>;
        is_workspace_level: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">[];
}>;
export declare const ObjectViewIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    object_id: z.ZodString;
    view_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    object_id: string;
    view_id: string;
}, {
    workspace_id: string;
    object_id: string;
    view_id: string;
}>;
export declare const ObjectViewSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        view_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        view_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        view_id: string;
    }>;
    title: z.ZodString;
    created_at: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        view_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        view_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        view_id: string;
    }>;
    title: z.ZodString;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        view_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        view_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        view_id: string;
    }>;
    title: z.ZodString;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export type ObjectView = z.infer<typeof ObjectViewSchema>;
export declare const ObjectViewsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            view_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }>;
        title: z.ZodString;
        created_at: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            view_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }>;
        title: z.ZodString;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            view_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }>;
        title: z.ZodString;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    pagination: z.ZodObject<{
        next_cursor: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        next_cursor: string | null;
    }, {
        next_cursor: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            view_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }>;
        title: z.ZodString;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    pagination: {
        next_cursor: string | null;
    };
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            view_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            view_id: string;
        }>;
        title: z.ZodString;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    pagination: {
        next_cursor: string | null;
    };
}>;
export declare const AttributeTypeSchema: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
export declare const AttributeIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    object_id: z.ZodString;
    attribute_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    object_id: string;
    attribute_id: string;
}, {
    workspace_id: string;
    object_id: string;
    attribute_id: string;
}>;
export declare const AttributeConfigSchema: z.ZodObject<{
    required: z.ZodOptional<z.ZodBoolean>;
    unique: z.ZodOptional<z.ZodBoolean>;
    default_value: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    required?: boolean | undefined;
    unique?: boolean | undefined;
    default_value?: unknown;
}, {
    required?: boolean | undefined;
    unique?: boolean | undefined;
    default_value?: unknown;
}>;
export declare const AttributeSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
    }>;
    api_slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
    is_system_attribute: z.ZodBoolean;
    is_unique: z.ZodBoolean;
    is_required: z.ZodBoolean;
    is_multiselect: z.ZodBoolean;
    is_archived: z.ZodBoolean;
    config: z.ZodOptional<z.ZodObject<{
        required: z.ZodOptional<z.ZodBoolean>;
        unique: z.ZodOptional<z.ZodBoolean>;
        default_value: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default_value?: unknown;
    }, {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default_value?: unknown;
    }>>;
    created_at: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
    }>;
    api_slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
    is_system_attribute: z.ZodBoolean;
    is_unique: z.ZodBoolean;
    is_required: z.ZodBoolean;
    is_multiselect: z.ZodBoolean;
    is_archived: z.ZodBoolean;
    config: z.ZodOptional<z.ZodObject<{
        required: z.ZodOptional<z.ZodBoolean>;
        unique: z.ZodOptional<z.ZodBoolean>;
        default_value: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default_value?: unknown;
    }, {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default_value?: unknown;
    }>>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
    }>;
    api_slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
    is_system_attribute: z.ZodBoolean;
    is_unique: z.ZodBoolean;
    is_required: z.ZodBoolean;
    is_multiselect: z.ZodBoolean;
    is_archived: z.ZodBoolean;
    config: z.ZodOptional<z.ZodObject<{
        required: z.ZodOptional<z.ZodBoolean>;
        unique: z.ZodOptional<z.ZodBoolean>;
        default_value: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default_value?: unknown;
    }, {
        required?: boolean | undefined;
        unique?: boolean | undefined;
        default_value?: unknown;
    }>>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export type Attribute = z.infer<typeof AttributeSchema>;
export declare const AttributesResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }>;
        api_slug: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
        is_system_attribute: z.ZodBoolean;
        is_unique: z.ZodBoolean;
        is_required: z.ZodBoolean;
        is_multiselect: z.ZodBoolean;
        is_archived: z.ZodBoolean;
        config: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            unique: z.ZodOptional<z.ZodBoolean>;
            default_value: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }>>;
        created_at: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }>;
        api_slug: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
        is_system_attribute: z.ZodBoolean;
        is_unique: z.ZodBoolean;
        is_required: z.ZodBoolean;
        is_multiselect: z.ZodBoolean;
        is_archived: z.ZodBoolean;
        config: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            unique: z.ZodOptional<z.ZodBoolean>;
            default_value: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }>>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }>;
        api_slug: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
        is_system_attribute: z.ZodBoolean;
        is_unique: z.ZodBoolean;
        is_required: z.ZodBoolean;
        is_multiselect: z.ZodBoolean;
        is_archived: z.ZodBoolean;
        config: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            unique: z.ZodOptional<z.ZodBoolean>;
            default_value: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }>>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }>;
        api_slug: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
        is_system_attribute: z.ZodBoolean;
        is_unique: z.ZodBoolean;
        is_required: z.ZodBoolean;
        is_multiselect: z.ZodBoolean;
        is_archived: z.ZodBoolean;
        config: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            unique: z.ZodOptional<z.ZodBoolean>;
            default_value: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }>>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
        }>;
        api_slug: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
        is_system_attribute: z.ZodBoolean;
        is_unique: z.ZodBoolean;
        is_required: z.ZodBoolean;
        is_multiselect: z.ZodBoolean;
        is_archived: z.ZodBoolean;
        config: z.ZodOptional<z.ZodObject<{
            required: z.ZodOptional<z.ZodBoolean>;
            unique: z.ZodOptional<z.ZodBoolean>;
            default_value: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }, {
            required?: boolean | undefined;
            unique?: boolean | undefined;
            default_value?: unknown;
        }>>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
}>;
export declare const AttributeValueSchema: z.ZodObject<{
    attribute_id: z.ZodString;
    attribute_type: z.ZodEnum<["text", "number", "checkbox", "date", "timestamp", "currency", "select", "multiselect", "status", "rating", "email-address", "phone-number", "domain", "location", "interaction", "actor-reference", "record-reference", "personal-name"]>;
    value: z.ZodUnknown;
    created_by_actor: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    active_from: z.ZodOptional<z.ZodString>;
    active_until: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    attribute_id: string;
    attribute_type: "number" | "text" | "status" | "date" | "checkbox" | "timestamp" | "currency" | "select" | "multiselect" | "rating" | "email-address" | "phone-number" | "domain" | "location" | "interaction" | "actor-reference" | "record-reference" | "personal-name";
    value?: unknown;
    created_by_actor?: z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    active_from?: string | undefined;
    active_until?: string | undefined;
}, {
    attribute_id: string;
    attribute_type: "number" | "text" | "status" | "date" | "checkbox" | "timestamp" | "currency" | "select" | "multiselect" | "rating" | "email-address" | "phone-number" | "domain" | "location" | "interaction" | "actor-reference" | "record-reference" | "personal-name";
    value?: unknown;
    created_by_actor?: z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    active_from?: string | undefined;
    active_until?: string | undefined;
}>;
export declare const AttributeValueHistorySchema: z.ZodObject<{
    attribute_id: z.ZodString;
    value: z.ZodUnknown;
    created_at: z.ZodString;
    created_by_actor: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    active_from: z.ZodOptional<z.ZodString>;
    active_until: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    created_at: string;
    attribute_id: string;
    value?: unknown;
    created_by_actor?: z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    active_from?: string | undefined;
    active_until?: string | undefined;
}, {
    created_at: string;
    attribute_id: string;
    value?: unknown;
    created_by_actor?: z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    active_from?: string | undefined;
    active_until?: string | undefined;
}>;
export type AttributeValueHistory = z.infer<typeof AttributeValueHistorySchema>;
export declare const RecordIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    object_id: z.ZodString;
    record_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    object_id: string;
    record_id: string;
}, {
    workspace_id: string;
    object_id: string;
    record_id: string;
}>;
export declare const RecordSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        record_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        record_id: string;
    }>;
    values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    created_at: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        record_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        record_id: string;
    }>;
    values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        record_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        record_id: string;
    }>;
    values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export type AttioRecord = z.infer<typeof RecordSchema>;
export declare const RecordsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }>;
        values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        created_at: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }>;
        values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }>;
        values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    next_cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }>;
        values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    next_cursor?: string | undefined;
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            record_id: string;
        }>;
        values: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    next_cursor?: string | undefined;
}>;
export declare const ListIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    list_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    list_id: string;
}, {
    workspace_id: string;
    list_id: string;
}>;
export declare const ListSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        list_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        list_id: string;
    }, {
        workspace_id: string;
        list_id: string;
    }>;
    api_slug: z.ZodString;
    name: z.ZodString;
    parent_object: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    entry_count: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: {
        workspace_id: string;
        list_id: string;
    };
    created_at: string;
    api_slug: string;
    created_by_actor: {
        type: "app" | "workspace-member" | "system" | "api" | "api-token";
        id?: string | null | undefined;
        workspace_member_id?: string | undefined;
        api_actor_id?: string | undefined;
    } & {
        [k: string]: unknown;
    };
    name: string;
    parent_object: string | string[];
    entry_count?: number | undefined;
}, {
    id: {
        workspace_id: string;
        list_id: string;
    };
    created_at: string;
    api_slug: string;
    created_by_actor: {
        type: "app" | "workspace-member" | "system" | "api" | "api-token";
        id?: string | null | undefined;
        workspace_member_id?: string | undefined;
        api_actor_id?: string | undefined;
    } & {
        [k: string]: unknown;
    };
    name: string;
    parent_object: string | string[];
    entry_count?: number | undefined;
}>;
export type List = z.infer<typeof ListSchema>;
export declare const ListsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            list_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            list_id: string;
        }, {
            workspace_id: string;
            list_id: string;
        }>;
        api_slug: z.ZodString;
        name: z.ZodString;
        parent_object: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        entry_count: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: {
            workspace_id: string;
            list_id: string;
        };
        created_at: string;
        api_slug: string;
        created_by_actor: {
            type: "app" | "workspace-member" | "system" | "api" | "api-token";
            id?: string | null | undefined;
            workspace_member_id?: string | undefined;
            api_actor_id?: string | undefined;
        } & {
            [k: string]: unknown;
        };
        name: string;
        parent_object: string | string[];
        entry_count?: number | undefined;
    }, {
        id: {
            workspace_id: string;
            list_id: string;
        };
        created_at: string;
        api_slug: string;
        created_by_actor: {
            type: "app" | "workspace-member" | "system" | "api" | "api-token";
            id?: string | null | undefined;
            workspace_member_id?: string | undefined;
            api_actor_id?: string | undefined;
        } & {
            [k: string]: unknown;
        };
        name: string;
        parent_object: string | string[];
        entry_count?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    data: {
        id: {
            workspace_id: string;
            list_id: string;
        };
        created_at: string;
        api_slug: string;
        created_by_actor: {
            type: "app" | "workspace-member" | "system" | "api" | "api-token";
            id?: string | null | undefined;
            workspace_member_id?: string | undefined;
            api_actor_id?: string | undefined;
        } & {
            [k: string]: unknown;
        };
        name: string;
        parent_object: string | string[];
        entry_count?: number | undefined;
    }[];
}, {
    data: {
        id: {
            workspace_id: string;
            list_id: string;
        };
        created_at: string;
        api_slug: string;
        created_by_actor: {
            type: "app" | "workspace-member" | "system" | "api" | "api-token";
            id?: string | null | undefined;
            workspace_member_id?: string | undefined;
            api_actor_id?: string | undefined;
        } & {
            [k: string]: unknown;
        };
        name: string;
        parent_object: string | string[];
        entry_count?: number | undefined;
    }[];
}>;
export declare const ListEntryIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    list_id: z.ZodString;
    entry_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    list_id: string;
    entry_id: string;
}, {
    workspace_id: string;
    list_id: string;
    entry_id: string;
}>;
export declare const ListEntrySchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        list_id: z.ZodString;
        entry_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        list_id: string;
        entry_id: string;
    }, {
        workspace_id: string;
        list_id: string;
        entry_id: string;
    }>;
    created_at: z.ZodString;
    parent_record_id: z.ZodString;
    attribute_values: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: {
        workspace_id: string;
        list_id: string;
        entry_id: string;
    };
    created_at: string;
    parent_record_id: string;
    attribute_values?: Record<string, unknown> | undefined;
}, {
    id: {
        workspace_id: string;
        list_id: string;
        entry_id: string;
    };
    created_at: string;
    parent_record_id: string;
    attribute_values?: Record<string, unknown> | undefined;
}>;
export type ListEntry = z.infer<typeof ListEntrySchema>;
export declare const ListEntriesResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            list_id: z.ZodString;
            entry_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            list_id: string;
            entry_id: string;
        }, {
            workspace_id: string;
            list_id: string;
            entry_id: string;
        }>;
        created_at: z.ZodString;
        parent_record_id: z.ZodString;
        attribute_values: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: {
            workspace_id: string;
            list_id: string;
            entry_id: string;
        };
        created_at: string;
        parent_record_id: string;
        attribute_values?: Record<string, unknown> | undefined;
    }, {
        id: {
            workspace_id: string;
            list_id: string;
            entry_id: string;
        };
        created_at: string;
        parent_record_id: string;
        attribute_values?: Record<string, unknown> | undefined;
    }>, "many">;
    next_cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: {
        id: {
            workspace_id: string;
            list_id: string;
            entry_id: string;
        };
        created_at: string;
        parent_record_id: string;
        attribute_values?: Record<string, unknown> | undefined;
    }[];
    next_cursor?: string | undefined;
}, {
    data: {
        id: {
            workspace_id: string;
            list_id: string;
            entry_id: string;
        };
        created_at: string;
        parent_record_id: string;
        attribute_values?: Record<string, unknown> | undefined;
    }[];
    next_cursor?: string | undefined;
}>;
export declare const NoteIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    note_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    note_id: string;
}, {
    workspace_id: string;
    note_id: string;
}>;
export declare const NoteSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        note_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        note_id: string;
    }, {
        workspace_id: string;
        note_id: string;
    }>;
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    content_plaintext: z.ZodOptional<z.ZodString>;
    content_markdown: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
    parent_object: z.ZodString;
    parent_record_id: z.ZodString;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        note_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        note_id: string;
    }, {
        workspace_id: string;
        note_id: string;
    }>;
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    content_plaintext: z.ZodOptional<z.ZodString>;
    content_markdown: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
    parent_object: z.ZodString;
    parent_record_id: z.ZodString;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        note_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        note_id: string;
    }, {
        workspace_id: string;
        note_id: string;
    }>;
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    content_plaintext: z.ZodOptional<z.ZodString>;
    content_markdown: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
    parent_object: z.ZodString;
    parent_record_id: z.ZodString;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export type Note = z.infer<typeof NoteSchema>;
export declare const NotesResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            note_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            note_id: string;
        }, {
            workspace_id: string;
            note_id: string;
        }>;
        title: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodOptional<z.ZodString>;
        content_markdown: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
        parent_object: z.ZodString;
        parent_record_id: z.ZodString;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            note_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            note_id: string;
        }, {
            workspace_id: string;
            note_id: string;
        }>;
        title: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodOptional<z.ZodString>;
        content_markdown: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
        parent_object: z.ZodString;
        parent_record_id: z.ZodString;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            note_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            note_id: string;
        }, {
            workspace_id: string;
            note_id: string;
        }>;
        title: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodOptional<z.ZodString>;
        content_markdown: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
        parent_object: z.ZodString;
        parent_record_id: z.ZodString;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    next_cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            note_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            note_id: string;
        }, {
            workspace_id: string;
            note_id: string;
        }>;
        title: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodOptional<z.ZodString>;
        content_markdown: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
        parent_object: z.ZodString;
        parent_record_id: z.ZodString;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">[];
    next_cursor?: string | undefined;
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            note_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            note_id: string;
        }, {
            workspace_id: string;
            note_id: string;
        }>;
        title: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodOptional<z.ZodString>;
        content_markdown: z.ZodOptional<z.ZodString>;
        format: z.ZodOptional<z.ZodEnum<["plaintext", "markdown", "html"]>>;
        parent_object: z.ZodString;
        parent_record_id: z.ZodString;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">[];
    next_cursor?: string | undefined;
}>;
export declare const TaskIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    task_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    task_id: string;
}, {
    workspace_id: string;
    task_id: string;
}>;
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        task_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        task_id: string;
    }, {
        workspace_id: string;
        task_id: string;
    }>;
    content: z.ZodOptional<z.ZodString>;
    content_plaintext: z.ZodString;
    deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_completed: z.ZodBoolean;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
        target_object: z.ZodOptional<z.ZodString>;
        target_record_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        target_object?: string | undefined;
        target_record_id?: string | undefined;
    }, {
        target_object?: string | undefined;
        target_record_id?: string | undefined;
    }>, "many">>;
    assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
        referenced_actor_type: z.ZodString;
        referenced_actor_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        referenced_actor_type: string;
        referenced_actor_id: string;
    }, {
        referenced_actor_type: string;
        referenced_actor_id: string;
    }>, "many">>;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        task_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        task_id: string;
    }, {
        workspace_id: string;
        task_id: string;
    }>;
    content: z.ZodOptional<z.ZodString>;
    content_plaintext: z.ZodString;
    deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_completed: z.ZodBoolean;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
        target_object: z.ZodOptional<z.ZodString>;
        target_record_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        target_object?: string | undefined;
        target_record_id?: string | undefined;
    }, {
        target_object?: string | undefined;
        target_record_id?: string | undefined;
    }>, "many">>;
    assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
        referenced_actor_type: z.ZodString;
        referenced_actor_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        referenced_actor_type: string;
        referenced_actor_id: string;
    }, {
        referenced_actor_type: string;
        referenced_actor_id: string;
    }>, "many">>;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        task_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        task_id: string;
    }, {
        workspace_id: string;
        task_id: string;
    }>;
    content: z.ZodOptional<z.ZodString>;
    content_plaintext: z.ZodString;
    deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_completed: z.ZodBoolean;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
        target_object: z.ZodOptional<z.ZodString>;
        target_record_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        target_object?: string | undefined;
        target_record_id?: string | undefined;
    }, {
        target_object?: string | undefined;
        target_record_id?: string | undefined;
    }>, "many">>;
    assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
        referenced_actor_type: z.ZodString;
        referenced_actor_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        referenced_actor_type: string;
        referenced_actor_id: string;
    }, {
        referenced_actor_type: string;
        referenced_actor_id: string;
    }>, "many">>;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export type Task = z.infer<typeof TaskSchema>;
export declare const TasksResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            task_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            task_id: string;
        }, {
            workspace_id: string;
            task_id: string;
        }>;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodString;
        deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        is_completed: z.ZodBoolean;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
            target_object: z.ZodOptional<z.ZodString>;
            target_record_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }>, "many">>;
        assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
            referenced_actor_type: z.ZodString;
            referenced_actor_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }>, "many">>;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            task_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            task_id: string;
        }, {
            workspace_id: string;
            task_id: string;
        }>;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodString;
        deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        is_completed: z.ZodBoolean;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
            target_object: z.ZodOptional<z.ZodString>;
            target_record_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }>, "many">>;
        assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
            referenced_actor_type: z.ZodString;
            referenced_actor_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }>, "many">>;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            task_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            task_id: string;
        }, {
            workspace_id: string;
            task_id: string;
        }>;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodString;
        deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        is_completed: z.ZodBoolean;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
            target_object: z.ZodOptional<z.ZodString>;
            target_record_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }>, "many">>;
        assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
            referenced_actor_type: z.ZodString;
            referenced_actor_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }>, "many">>;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    next_cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            task_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            task_id: string;
        }, {
            workspace_id: string;
            task_id: string;
        }>;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodString;
        deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        is_completed: z.ZodBoolean;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
            target_object: z.ZodOptional<z.ZodString>;
            target_record_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }>, "many">>;
        assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
            referenced_actor_type: z.ZodString;
            referenced_actor_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }>, "many">>;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">[];
    next_cursor?: string | undefined;
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            task_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            task_id: string;
        }, {
            workspace_id: string;
            task_id: string;
        }>;
        content: z.ZodOptional<z.ZodString>;
        content_plaintext: z.ZodString;
        deadline_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        is_completed: z.ZodBoolean;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        linked_records: z.ZodOptional<z.ZodArray<z.ZodObject<{
            target_object: z.ZodOptional<z.ZodString>;
            target_record_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }, {
            target_object?: string | undefined;
            target_record_id?: string | undefined;
        }>, "many">>;
        assignees: z.ZodOptional<z.ZodArray<z.ZodObject<{
            referenced_actor_type: z.ZodString;
            referenced_actor_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }, {
            referenced_actor_type: string;
            referenced_actor_id: string;
        }>, "many">>;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">[];
    next_cursor?: string | undefined;
}>;
export declare const MeetingIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    meeting_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    meeting_id: string;
}, {
    workspace_id: string;
    meeting_id: string;
}>;
export declare const MeetingTimeSchema: z.ZodUnion<[z.ZodObject<{
    datetime: z.ZodString;
    timezone: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    datetime: z.ZodString;
    timezone: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    datetime: z.ZodString;
    timezone: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    date: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    date: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    date: z.ZodString;
}, z.ZodTypeAny, "passthrough">>]>;
export declare const MeetingSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
    }>;
    title: z.ZodString;
    description: z.ZodString;
    is_all_day: z.ZodBoolean;
    start: z.ZodUnion<[z.ZodObject<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        date: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
    end: z.ZodUnion<[z.ZodObject<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        date: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
    participants: z.ZodArray<z.ZodObject<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    linked_records: z.ZodArray<z.ZodObject<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
    }>;
    title: z.ZodString;
    description: z.ZodString;
    is_all_day: z.ZodBoolean;
    start: z.ZodUnion<[z.ZodObject<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        date: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
    end: z.ZodUnion<[z.ZodObject<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        date: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
    participants: z.ZodArray<z.ZodObject<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    linked_records: z.ZodArray<z.ZodObject<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
    }>;
    title: z.ZodString;
    description: z.ZodString;
    is_all_day: z.ZodBoolean;
    start: z.ZodUnion<[z.ZodObject<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        date: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
    end: z.ZodUnion<[z.ZodObject<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        datetime: z.ZodString;
        timezone: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        date: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        date: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>]>;
    participants: z.ZodArray<z.ZodObject<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
        is_organizer: z.ZodBoolean;
        email_address: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    linked_records: z.ZodArray<z.ZodObject<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        object_slug: z.ZodString;
        object_id: z.ZodString;
        record_id: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    created_at: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export type Meeting = z.infer<typeof MeetingSchema>;
export declare const MeetingsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
        }>;
        title: z.ZodString;
        description: z.ZodString;
        is_all_day: z.ZodBoolean;
        start: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        end: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        participants: z.ZodArray<z.ZodObject<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        linked_records: z.ZodArray<z.ZodObject<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
        }>;
        title: z.ZodString;
        description: z.ZodString;
        is_all_day: z.ZodBoolean;
        start: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        end: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        participants: z.ZodArray<z.ZodObject<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        linked_records: z.ZodArray<z.ZodObject<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
        }>;
        title: z.ZodString;
        description: z.ZodString;
        is_all_day: z.ZodBoolean;
        start: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        end: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        participants: z.ZodArray<z.ZodObject<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        linked_records: z.ZodArray<z.ZodObject<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    pagination: z.ZodObject<{
        next_cursor: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        next_cursor: string | null;
    }, {
        next_cursor: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
        }>;
        title: z.ZodString;
        description: z.ZodString;
        is_all_day: z.ZodBoolean;
        start: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        end: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        participants: z.ZodArray<z.ZodObject<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        linked_records: z.ZodArray<z.ZodObject<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">[];
    pagination: {
        next_cursor: string | null;
    };
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
        }>;
        title: z.ZodString;
        description: z.ZodString;
        is_all_day: z.ZodBoolean;
        start: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        end: z.ZodUnion<[z.ZodObject<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            datetime: z.ZodString;
            timezone: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
            date: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            date: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>]>;
        participants: z.ZodArray<z.ZodObject<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            status: z.ZodEnum<["accepted", "tentative", "declined", "pending"]>;
            is_organizer: z.ZodBoolean;
            email_address: z.ZodNullable<z.ZodString>;
            name: z.ZodNullable<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        linked_records: z.ZodArray<z.ZodObject<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            object_slug: z.ZodString;
            object_id: z.ZodString;
            record_id: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        created_at: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
    }, z.ZodTypeAny, "passthrough">[];
    pagination: {
        next_cursor: string | null;
    };
}>;
export declare const TranscriptSegmentSchema: z.ZodObject<{
    speech: z.ZodString;
    start_time: z.ZodNumber;
    end_time: z.ZodNumber;
    speaker: z.ZodObject<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    speech: z.ZodString;
    start_time: z.ZodNumber;
    end_time: z.ZodNumber;
    speaker: z.ZodObject<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    speech: z.ZodString;
    start_time: z.ZodNumber;
    end_time: z.ZodNumber;
    speaker: z.ZodObject<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        email_address: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export declare const CallRecordingSummarySchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
        call_recording_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }>;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    web_url: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
        call_recording_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }>;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    web_url: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
        call_recording_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }>;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    web_url: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export declare const CallRecordingSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
        call_recording_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }>;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    web_url: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    video_url: z.ZodNullable<z.ZodString>;
    transcript: z.ZodNullable<z.ZodObject<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
        call_recording_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }>;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    web_url: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    video_url: z.ZodNullable<z.ZodString>;
    transcript: z.ZodNullable<z.ZodObject<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        meeting_id: z.ZodString;
        call_recording_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }, {
        workspace_id: string;
        meeting_id: string;
        call_recording_id: string;
    }>;
    status: z.ZodEnum<["processing", "completed", "failed"]>;
    web_url: z.ZodString;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    video_url: z.ZodNullable<z.ZodString>;
    transcript: z.ZodNullable<z.ZodObject<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        segments: z.ZodArray<z.ZodObject<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            speech: z.ZodString;
            start_time: z.ZodNumber;
            end_time: z.ZodNumber;
            speaker: z.ZodObject<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                name: z.ZodString;
                email_address: z.ZodOptional<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        raw_transcript: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>;
export type CallRecordingSummary = z.infer<typeof CallRecordingSummarySchema>;
export type CallRecording = z.infer<typeof CallRecordingSchema>;
export declare const CallRecordingsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
            call_recording_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }>;
        status: z.ZodEnum<["processing", "completed", "failed"]>;
        web_url: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
            call_recording_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }>;
        status: z.ZodEnum<["processing", "completed", "failed"]>;
        web_url: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
            call_recording_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }>;
        status: z.ZodEnum<["processing", "completed", "failed"]>;
        web_url: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    pagination: z.ZodObject<{
        next_cursor: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        next_cursor: string | null;
    }, {
        next_cursor: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
            call_recording_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }>;
        status: z.ZodEnum<["processing", "completed", "failed"]>;
        web_url: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    pagination: {
        next_cursor: string | null;
    };
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            meeting_id: z.ZodString;
            call_recording_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }, {
            workspace_id: string;
            meeting_id: string;
            call_recording_id: string;
        }>;
        status: z.ZodEnum<["processing", "completed", "failed"]>;
        web_url: z.ZodString;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    }, z.ZodTypeAny, "passthrough">[];
    pagination: {
        next_cursor: string | null;
    };
}>;
export declare const FileEntrySchema: z.ZodDiscriminatedUnion<"file_type", [z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"file">;
    name: z.ZodString;
    content_type: z.ZodNullable<z.ZodString>;
    content_size: z.ZodNullable<z.ZodNumber>;
    parent_folder_id: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"file">;
    name: z.ZodString;
    content_type: z.ZodNullable<z.ZodString>;
    content_size: z.ZodNullable<z.ZodNumber>;
    parent_folder_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"file">;
    name: z.ZodString;
    content_type: z.ZodNullable<z.ZodString>;
    content_size: z.ZodNullable<z.ZodNumber>;
    parent_folder_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"folder">;
    name: z.ZodString;
    parent_folder_id: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"folder">;
    name: z.ZodString;
    parent_folder_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"folder">;
    name: z.ZodString;
    parent_folder_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"connected-file">;
    external_provider_file_id: z.ZodString;
    microsoft_drive_id: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"connected-file">;
    external_provider_file_id: z.ZodString;
    microsoft_drive_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"connected-file">;
    external_provider_file_id: z.ZodString;
    microsoft_drive_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"connected-folder">;
    external_provider_file_id: z.ZodString;
    microsoft_drive_id: z.ZodNullable<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"connected-folder">;
    external_provider_file_id: z.ZodString;
    microsoft_drive_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        file_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        file_id: string;
    }, {
        workspace_id: string;
        file_id: string;
    }>;
    object_id: z.ZodString;
    object_slug: z.ZodString;
    record_id: z.ZodString;
    storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
    created_by_actor: z.ZodObject<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
        id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workspace_member_id: z.ZodOptional<z.ZodString>;
        api_actor_id: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
    created_at: z.ZodString;
} & {
    file_type: z.ZodLiteral<"connected-folder">;
    external_provider_file_id: z.ZodString;
    microsoft_drive_id: z.ZodNullable<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>]>;
export type FileEntry = z.infer<typeof FileEntrySchema>;
export declare const FilesResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodDiscriminatedUnion<"file_type", [z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"file">;
        name: z.ZodString;
        content_type: z.ZodNullable<z.ZodString>;
        content_size: z.ZodNullable<z.ZodNumber>;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"file">;
        name: z.ZodString;
        content_type: z.ZodNullable<z.ZodString>;
        content_size: z.ZodNullable<z.ZodNumber>;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"file">;
        name: z.ZodString;
        content_type: z.ZodNullable<z.ZodString>;
        content_size: z.ZodNullable<z.ZodNumber>;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"folder">;
        name: z.ZodString;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"folder">;
        name: z.ZodString;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"folder">;
        name: z.ZodString;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-file">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-file">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-file">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-folder">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-folder">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-folder">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    pagination: z.ZodObject<{
        next_cursor: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        next_cursor: string | null;
    }, {
        next_cursor: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    data: (z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"file">;
        name: z.ZodString;
        content_type: z.ZodNullable<z.ZodString>;
        content_size: z.ZodNullable<z.ZodNumber>;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"folder">;
        name: z.ZodString;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-file">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-folder">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">)[];
    pagination: {
        next_cursor: string | null;
    };
}, {
    data: (z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"file">;
        name: z.ZodString;
        content_type: z.ZodNullable<z.ZodString>;
        content_size: z.ZodNullable<z.ZodNumber>;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"folder">;
        name: z.ZodString;
        parent_folder_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-file">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            file_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            file_id: string;
        }, {
            workspace_id: string;
            file_id: string;
        }>;
        object_id: z.ZodString;
        object_slug: z.ZodString;
        record_id: z.ZodString;
        storage_provider: z.ZodEnum<["attio", "dropbox", "box", "google-drive", "microsoft-onedrive"]>;
        created_by_actor: z.ZodObject<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["workspace-member", "system", "api", "api-token", "app"]>;
            id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_member_id: z.ZodOptional<z.ZodString>;
            api_actor_id: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>;
        created_at: z.ZodString;
    } & {
        file_type: z.ZodLiteral<"connected-folder">;
        external_provider_file_id: z.ZodString;
        microsoft_drive_id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">)[];
    pagination: {
        next_cursor: string | null;
    };
}>;
export declare const CommentSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        comment_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        comment_id: string;
    }, {
        workspace_id: string;
        comment_id: string;
    }>;
    thread_id: z.ZodString;
    content_plaintext: z.ZodString;
    entry: z.ZodNullable<z.ZodObject<{
        entry_id: z.ZodString;
        list_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        list_id: string;
        entry_id: string;
    }, {
        list_id: string;
        entry_id: string;
    }>>;
    record: z.ZodNullable<z.ZodObject<{
        record_id: z.ZodString;
        object_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        object_id: string;
        record_id: string;
    }, {
        object_id: string;
        record_id: string;
    }>>;
    resolved_at: z.ZodNullable<z.ZodString>;
    resolved_by: z.ZodNullable<z.ZodObject<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    created_at: z.ZodString;
    author: z.ZodObject<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        comment_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        comment_id: string;
    }, {
        workspace_id: string;
        comment_id: string;
    }>;
    thread_id: z.ZodString;
    content_plaintext: z.ZodString;
    entry: z.ZodNullable<z.ZodObject<{
        entry_id: z.ZodString;
        list_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        list_id: string;
        entry_id: string;
    }, {
        list_id: string;
        entry_id: string;
    }>>;
    record: z.ZodNullable<z.ZodObject<{
        record_id: z.ZodString;
        object_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        object_id: string;
        record_id: string;
    }, {
        object_id: string;
        record_id: string;
    }>>;
    resolved_at: z.ZodNullable<z.ZodString>;
    resolved_by: z.ZodNullable<z.ZodObject<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    created_at: z.ZodString;
    author: z.ZodObject<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        comment_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        comment_id: string;
    }, {
        workspace_id: string;
        comment_id: string;
    }>;
    thread_id: z.ZodString;
    content_plaintext: z.ZodString;
    entry: z.ZodNullable<z.ZodObject<{
        entry_id: z.ZodString;
        list_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        list_id: string;
        entry_id: string;
    }, {
        list_id: string;
        entry_id: string;
    }>>;
    record: z.ZodNullable<z.ZodObject<{
        record_id: z.ZodString;
        object_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        object_id: string;
        record_id: string;
    }, {
        object_id: string;
        record_id: string;
    }>>;
    resolved_at: z.ZodNullable<z.ZodString>;
    resolved_by: z.ZodNullable<z.ZodObject<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
    created_at: z.ZodString;
    author: z.ZodObject<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodNullable<z.ZodEnum<["api-token", "workspace-member", "system", "app"]>>;
        id: z.ZodNullable<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>;
}, z.ZodTypeAny, "passthrough">>;
export type Comment = z.infer<typeof CommentSchema>;
export declare const SelectOptionIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    object_id: z.ZodString;
    attribute_id: z.ZodString;
    option_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    object_id: string;
    attribute_id: string;
    option_id: string;
}, {
    workspace_id: string;
    object_id: string;
    attribute_id: string;
    option_id: string;
}>;
export declare const SelectOptionSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
        option_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        option_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        option_id: string;
    }>;
    title: z.ZodString;
    is_archived: z.ZodBoolean;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
        option_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        option_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        option_id: string;
    }>;
    title: z.ZodString;
    is_archived: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
        option_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        option_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        option_id: string;
    }>;
    title: z.ZodString;
    is_archived: z.ZodBoolean;
}, z.ZodTypeAny, "passthrough">>;
export type SelectOption = z.infer<typeof SelectOptionSchema>;
export declare const SelectOptionsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            option_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            option_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            option_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            option_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">[];
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            option_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            option_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
    }, z.ZodTypeAny, "passthrough">[];
}>;
export declare const StatusIdSchema: z.ZodObject<{
    workspace_id: z.ZodString;
    object_id: z.ZodString;
    attribute_id: z.ZodString;
    status_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workspace_id: string;
    object_id: string;
    attribute_id: string;
    status_id: string;
}, {
    workspace_id: string;
    object_id: string;
    attribute_id: string;
    status_id: string;
}>;
export declare const StatusSchema: z.ZodObject<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
        status_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        status_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        status_id: string;
    }>;
    title: z.ZodString;
    is_archived: z.ZodBoolean;
    celebration_enabled: z.ZodBoolean;
    target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
        status_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        status_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        status_id: string;
    }>;
    title: z.ZodString;
    is_archived: z.ZodBoolean;
    celebration_enabled: z.ZodBoolean;
    target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodObject<{
        workspace_id: z.ZodString;
        object_id: z.ZodString;
        attribute_id: z.ZodString;
        status_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        status_id: string;
    }, {
        workspace_id: string;
        object_id: string;
        attribute_id: string;
        status_id: string;
    }>;
    title: z.ZodString;
    is_archived: z.ZodBoolean;
    celebration_enabled: z.ZodBoolean;
    target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">>;
export type Status = z.infer<typeof StatusSchema>;
export declare const StatusesResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            status_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
        celebration_enabled: z.ZodBoolean;
        target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            status_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
        celebration_enabled: z.ZodBoolean;
        target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            status_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
        celebration_enabled: z.ZodBoolean;
        target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
}, "strip", z.ZodTypeAny, {
    data: z.objectOutputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            status_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
        celebration_enabled: z.ZodBoolean;
        target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">[];
}, {
    data: z.objectInputType<{
        id: z.ZodObject<{
            workspace_id: z.ZodString;
            object_id: z.ZodString;
            attribute_id: z.ZodString;
            status_id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }, {
            workspace_id: string;
            object_id: string;
            attribute_id: string;
            status_id: string;
        }>;
        title: z.ZodString;
        is_archived: z.ZodBoolean;
        celebration_enabled: z.ZodBoolean;
        target_time_in_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">[];
}>;
export type AttributeWithValues = Attribute & {
    select_options?: SelectOption[];
    statuses?: Status[];
};
//# sourceMappingURL=types.d.ts.map