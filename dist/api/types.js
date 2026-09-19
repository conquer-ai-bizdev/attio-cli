"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOptionsResponseSchema = exports.SelectOptionSchema = exports.SelectOptionIdSchema = exports.EmailsResponseSchema = exports.EmailSchema = exports.CommentSchema = exports.FilesResponseSchema = exports.FileEntrySchema = exports.CallRecordingsResponseSchema = exports.CallRecordingSchema = exports.CallRecordingSummarySchema = exports.TranscriptSegmentSchema = exports.MeetingsResponseSchema = exports.MeetingSchema = exports.MeetingTimeSchema = exports.MeetingIdSchema = exports.TasksResponseSchema = exports.TaskSchema = exports.TaskIdSchema = exports.NotesResponseSchema = exports.NoteSchema = exports.NoteIdSchema = exports.ListEntriesResponseSchema = exports.ListEntrySchema = exports.ListEntryIdSchema = exports.ListsResponseSchema = exports.ListSchema = exports.ListIdSchema = exports.RecordsResponseSchema = exports.RecordSchema = exports.RecordIdSchema = exports.AttributeValueHistorySchema = exports.AttributeValueSchema = exports.AttributesResponseSchema = exports.AttributeSchema = exports.AttributeConfigSchema = exports.AttributeIdSchema = exports.AttributeTypeSchema = exports.ObjectViewsResponseSchema = exports.ObjectViewSchema = exports.ObjectViewIdSchema = exports.ObjectsResponseSchema = exports.ObjectSchema = exports.ObjectIdSchema = exports.WorkspaceIdentitySchema = exports.WorkspaceMembersResponseSchema = exports.WorkspaceMemberSchema = exports.WorkspaceMemberIdSchema = exports.CreatedBySchema = exports.TimestampSchema = void 0;
exports.StatusesResponseSchema = exports.StatusSchema = exports.StatusIdSchema = void 0;
exports.asUUID = asUUID;
exports.asSlug = asSlug;
const zod_1 = require("zod");
// Helper to create branded types
function asUUID(value) {
    return value;
}
function asSlug(value) {
    return value;
}
// Common schemas
exports.TimestampSchema = zod_1.z.string().datetime();
exports.CreatedBySchema = zod_1.z
    .object({
    type: zod_1.z.enum(['workspace-member', 'system', 'api', 'api-token', 'app']),
    id: zod_1.z.string().nullable().optional(),
    workspace_member_id: zod_1.z.string().optional(),
    api_actor_id: zod_1.z.string().optional(),
})
    .passthrough();
// Workspace Member
exports.WorkspaceMemberIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    workspace_member_id: zod_1.z.string(),
});
exports.WorkspaceMemberSchema = zod_1.z
    .object({
    id: exports.WorkspaceMemberIdSchema,
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    email_address: zod_1.z.string().email(),
    avatar_url: zod_1.z.string().nullable(),
    access_level: zod_1.z.enum(['admin', 'member', 'suspended']),
    created_at: exports.TimestampSchema,
})
    .passthrough();
exports.WorkspaceMembersResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.WorkspaceMemberSchema),
});
exports.WorkspaceIdentitySchema = zod_1.z
    .object({
    active: zod_1.z.boolean(),
    scope: zod_1.z.string().optional(),
    client_id: zod_1.z.string().optional(),
    aud: zod_1.z.string().optional(),
    authorized_by_workspace_member_id: zod_1.z.string().optional(),
})
    .passthrough();
// Object
exports.ObjectIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    object_id: zod_1.z.string(),
});
exports.ObjectSchema = zod_1.z
    .object({
    id: exports.ObjectIdSchema,
    api_slug: zod_1.z.string(),
    singular_noun: zod_1.z.string(),
    plural_noun: zod_1.z.string(),
    created_at: exports.TimestampSchema,
    is_built_in: zod_1.z.boolean().optional(),
    is_workspace_level: zod_1.z.boolean().optional(),
})
    .passthrough();
exports.ObjectsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.ObjectSchema),
});
exports.ObjectViewIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    object_id: zod_1.z.string(),
    view_id: zod_1.z.string(),
});
exports.ObjectViewSchema = zod_1.z
    .object({
    id: exports.ObjectViewIdSchema,
    title: zod_1.z.string(),
    created_at: exports.TimestampSchema,
})
    .passthrough();
exports.ObjectViewsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.ObjectViewSchema),
    pagination: zod_1.z.object({
        next_cursor: zod_1.z.string().nullable(),
    }),
});
// Attribute Types
exports.AttributeTypeSchema = zod_1.z.enum([
    'text',
    'number',
    'checkbox',
    'date',
    'timestamp',
    'currency',
    'select',
    'multiselect',
    'status',
    'rating',
    'email-address',
    'phone-number',
    'domain',
    'location',
    'interaction',
    'actor-reference',
    'record-reference',
    'personal-name',
]);
exports.AttributeIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    object_id: zod_1.z.string(),
    attribute_id: zod_1.z.string(),
});
exports.AttributeConfigSchema = zod_1.z.object({
    required: zod_1.z.boolean().optional(),
    unique: zod_1.z.boolean().optional(),
    default_value: zod_1.z.unknown().optional(),
    // Additional config fields vary by type
});
exports.AttributeSchema = zod_1.z
    .object({
    id: exports.AttributeIdSchema,
    api_slug: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().nullable().optional(),
    type: exports.AttributeTypeSchema,
    is_system_attribute: zod_1.z.boolean(),
    is_unique: zod_1.z.boolean(),
    is_required: zod_1.z.boolean(),
    is_multiselect: zod_1.z.boolean(),
    is_archived: zod_1.z.boolean(),
    config: exports.AttributeConfigSchema.optional(),
    created_at: exports.TimestampSchema,
})
    .passthrough();
exports.AttributesResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.AttributeSchema),
});
// Attribute Values (for records)
exports.AttributeValueSchema = zod_1.z.object({
    attribute_id: zod_1.z.string(),
    attribute_type: exports.AttributeTypeSchema,
    value: zod_1.z.unknown(), // Type varies by attribute_type
    created_by_actor: exports.CreatedBySchema.optional(),
    active_from: exports.TimestampSchema.optional(),
    active_until: exports.TimestampSchema.optional(),
});
// Attribute Value History (for entry attribute values)
exports.AttributeValueHistorySchema = zod_1.z.object({
    attribute_id: zod_1.z.string(),
    value: zod_1.z.unknown(),
    created_at: exports.TimestampSchema,
    created_by_actor: exports.CreatedBySchema.optional(),
    active_from: exports.TimestampSchema.optional(),
    active_until: exports.TimestampSchema.optional(),
});
// Record
exports.RecordIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    object_id: zod_1.z.string(),
    record_id: zod_1.z.string(),
});
exports.RecordSchema = zod_1.z
    .object({
    id: exports.RecordIdSchema,
    values: zod_1.z.record(zod_1.z.unknown()), // Map of attribute slug to value
    created_at: exports.TimestampSchema,
})
    .passthrough();
exports.RecordsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.RecordSchema),
    next_cursor: zod_1.z.string().optional(),
});
// List
exports.ListIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    list_id: zod_1.z.string(),
});
exports.ListSchema = zod_1.z.object({
    id: exports.ListIdSchema,
    api_slug: zod_1.z.string(),
    name: zod_1.z.string(),
    parent_object: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]), // Can be string or array
    created_at: exports.TimestampSchema,
    created_by_actor: exports.CreatedBySchema,
    entry_count: zod_1.z.number().optional(),
});
exports.ListsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.ListSchema),
});
// List Entry
exports.ListEntryIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    list_id: zod_1.z.string(),
    entry_id: zod_1.z.string(),
});
exports.ListEntrySchema = zod_1.z.object({
    id: exports.ListEntryIdSchema,
    created_at: exports.TimestampSchema,
    parent_record_id: zod_1.z.string(),
    attribute_values: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.ListEntriesResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.ListEntrySchema),
    next_cursor: zod_1.z.string().optional(),
});
// Note
exports.NoteIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    note_id: zod_1.z.string(),
});
exports.NoteSchema = zod_1.z
    .object({
    id: exports.NoteIdSchema,
    title: zod_1.z.string(),
    content: zod_1.z.string().optional(),
    content_plaintext: zod_1.z.string().optional(),
    content_markdown: zod_1.z.string().optional(),
    format: zod_1.z.enum(['plaintext', 'markdown', 'html']).optional(),
    parent_object: zod_1.z.string(),
    parent_record_id: zod_1.z.string(),
    created_at: exports.TimestampSchema,
    created_by_actor: exports.CreatedBySchema,
})
    .passthrough();
exports.NotesResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.NoteSchema),
    next_cursor: zod_1.z.string().optional(),
});
// Task
exports.TaskIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    task_id: zod_1.z.string(),
});
exports.TaskSchema = zod_1.z
    .object({
    id: exports.TaskIdSchema,
    content: zod_1.z.string().optional(),
    content_plaintext: zod_1.z.string(),
    deadline_at: exports.TimestampSchema.nullable().optional(),
    is_completed: zod_1.z.boolean(),
    completed_at: exports.TimestampSchema.nullable().optional(),
    linked_records: zod_1.z
        .array(zod_1.z.object({
        target_object: zod_1.z.string().optional(),
        target_record_id: zod_1.z.string().optional(),
    }))
        .optional(),
    assignees: zod_1.z
        .array(zod_1.z.object({
        referenced_actor_type: zod_1.z.string(),
        referenced_actor_id: zod_1.z.string(),
    }))
        .optional(),
    created_at: exports.TimestampSchema,
    created_by_actor: exports.CreatedBySchema,
})
    .passthrough();
exports.TasksResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.TaskSchema),
    next_cursor: zod_1.z.string().optional(),
});
// Meeting (read-only)
exports.MeetingIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    meeting_id: zod_1.z.string(),
});
exports.MeetingTimeSchema = zod_1.z.union([
    zod_1.z
        .object({
        datetime: zod_1.z.string(),
        timezone: zod_1.z.string().nullable(),
    })
        .passthrough(),
    zod_1.z.object({ date: zod_1.z.string() }).passthrough(),
]);
exports.MeetingSchema = zod_1.z
    .object({
    id: exports.MeetingIdSchema,
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    is_all_day: zod_1.z.boolean(),
    start: exports.MeetingTimeSchema,
    end: exports.MeetingTimeSchema,
    participants: zod_1.z.array(zod_1.z
        .object({
        status: zod_1.z.enum(['accepted', 'tentative', 'declined', 'pending']),
        is_organizer: zod_1.z.boolean(),
        email_address: zod_1.z.string().nullable(),
        name: zod_1.z.string().nullable(),
    })
        .passthrough()),
    linked_records: zod_1.z.array(zod_1.z
        .object({
        object_slug: zod_1.z.string(),
        object_id: zod_1.z.string(),
        record_id: zod_1.z.string(),
    })
        .passthrough()),
    created_at: exports.TimestampSchema,
    created_by_actor: exports.CreatedBySchema,
})
    .passthrough();
exports.MeetingsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.MeetingSchema),
    pagination: zod_1.z.object({
        next_cursor: zod_1.z.string().nullable(),
    }),
});
// Call recordings
exports.TranscriptSegmentSchema = zod_1.z
    .object({
    speech: zod_1.z.string(),
    start_time: zod_1.z.number(),
    end_time: zod_1.z.number(),
    speaker: zod_1.z
        .object({
        name: zod_1.z.string(),
        email_address: zod_1.z.string().optional(),
    })
        .passthrough(),
})
    .passthrough();
exports.CallRecordingSummarySchema = zod_1.z
    .object({
    id: zod_1.z.object({
        workspace_id: zod_1.z.string(),
        meeting_id: zod_1.z.string(),
        call_recording_id: zod_1.z.string(),
    }),
    status: zod_1.z.enum(['processing', 'completed', 'failed']),
    web_url: zod_1.z.string(),
    created_by_actor: exports.CreatedBySchema,
    created_at: exports.TimestampSchema,
})
    .passthrough();
exports.CallRecordingSchema = exports.CallRecordingSummarySchema.extend({
    video_url: zod_1.z.string().nullable(),
    transcript: zod_1.z
        .object({
        segments: zod_1.z.array(exports.TranscriptSegmentSchema),
        raw_transcript: zod_1.z.string(),
    })
        .passthrough()
        .nullable(),
}).passthrough();
exports.CallRecordingsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.CallRecordingSummarySchema),
    pagination: zod_1.z.object({
        next_cursor: zod_1.z.string().nullable(),
    }),
});
// Files and folders
const FileEntryBaseSchema = zod_1.z.object({
    id: zod_1.z.object({
        workspace_id: zod_1.z.string(),
        file_id: zod_1.z.string(),
    }),
    object_id: zod_1.z.string(),
    object_slug: zod_1.z.string(),
    record_id: zod_1.z.string(),
    storage_provider: zod_1.z.enum([
        'attio',
        'dropbox',
        'box',
        'google-drive',
        'microsoft-onedrive',
    ]),
    created_by_actor: exports.CreatedBySchema,
    created_at: exports.TimestampSchema,
});
exports.FileEntrySchema = zod_1.z.discriminatedUnion('file_type', [
    FileEntryBaseSchema.extend({
        file_type: zod_1.z.literal('file'),
        name: zod_1.z.string(),
        content_type: zod_1.z.string().nullable(),
        content_size: zod_1.z.number().nullable(),
        parent_folder_id: zod_1.z.string().nullable(),
    }).passthrough(),
    FileEntryBaseSchema.extend({
        file_type: zod_1.z.literal('folder'),
        name: zod_1.z.string(),
        parent_folder_id: zod_1.z.string().nullable(),
    }).passthrough(),
    FileEntryBaseSchema.extend({
        file_type: zod_1.z.literal('connected-file'),
        external_provider_file_id: zod_1.z.string(),
        microsoft_drive_id: zod_1.z.string().nullable(),
    }).passthrough(),
    FileEntryBaseSchema.extend({
        file_type: zod_1.z.literal('connected-folder'),
        external_provider_file_id: zod_1.z.string(),
        microsoft_drive_id: zod_1.z.string().nullable(),
    }).passthrough(),
]);
exports.FilesResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.FileEntrySchema),
    pagination: zod_1.z.object({
        next_cursor: zod_1.z.string().nullable(),
    }),
});
// Comments
const CommentActorSchema = zod_1.z
    .object({
    type: zod_1.z.enum(['api-token', 'workspace-member', 'system', 'app']).nullable(),
    id: zod_1.z.string().nullable(),
})
    .passthrough();
exports.CommentSchema = zod_1.z
    .object({
    id: zod_1.z.object({
        workspace_id: zod_1.z.string(),
        comment_id: zod_1.z.string(),
    }),
    thread_id: zod_1.z.string(),
    content_plaintext: zod_1.z.string(),
    entry: zod_1.z
        .object({
        entry_id: zod_1.z.string(),
        list_id: zod_1.z.string(),
    })
        .nullable(),
    record: zod_1.z
        .object({
        record_id: zod_1.z.string(),
        object_id: zod_1.z.string(),
    })
        .nullable(),
    resolved_at: exports.TimestampSchema.nullable(),
    resolved_by: CommentActorSchema.nullable(),
    created_at: exports.TimestampSchema,
    author: CommentActorSchema,
})
    .passthrough();
// Email metadata (content is not available from the public REST endpoint)
exports.EmailSchema = zod_1.z
    .object({
    id: zod_1.z.object({
        workspace_id: zod_1.z.string(),
        mailbox_id: zod_1.z.string(),
        email_id: zod_1.z.string(),
    }),
    sent_at: zod_1.z.string(),
    direction: zod_1.z.enum(['inbound', 'outbound']),
    subject_line: zod_1.z.string().nullable(),
    participants: zod_1.z.array(zod_1.z
        .object({
        role: zod_1.z.enum(['from', 'reply-to', 'to', 'cc', 'bcc']),
        email_address: zod_1.z.string(),
        email_domain: zod_1.z.string(),
        name: zod_1.z.string().nullable(),
    })
        .passthrough()),
    linked_records: zod_1.z.array(zod_1.z
        .object({
        object_slug: zod_1.z.string(),
        object_id: zod_1.z.string(),
        record_id: zod_1.z.string(),
    })
        .passthrough()),
})
    .passthrough();
exports.EmailsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.EmailSchema),
    pagination: zod_1.z.object({
        next_cursor: zod_1.z.string().nullable(),
    }),
});
// Select Option
exports.SelectOptionIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    object_id: zod_1.z.string(),
    attribute_id: zod_1.z.string(),
    option_id: zod_1.z.string(),
});
exports.SelectOptionSchema = zod_1.z
    .object({
    id: exports.SelectOptionIdSchema,
    title: zod_1.z.string(),
    is_archived: zod_1.z.boolean(),
})
    .passthrough();
exports.SelectOptionsResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.SelectOptionSchema),
});
// Status
exports.StatusIdSchema = zod_1.z.object({
    workspace_id: zod_1.z.string(),
    object_id: zod_1.z.string(),
    attribute_id: zod_1.z.string(),
    status_id: zod_1.z.string(),
});
exports.StatusSchema = zod_1.z
    .object({
    id: exports.StatusIdSchema,
    title: zod_1.z.string(),
    is_archived: zod_1.z.boolean(),
    celebration_enabled: zod_1.z.boolean(),
    target_time_in_status: zod_1.z.string().nullable().optional(), // ISO-8601 duration
})
    .passthrough();
exports.StatusesResponseSchema = zod_1.z.object({
    data: zod_1.z.array(exports.StatusSchema),
});
//# sourceMappingURL=types.js.map