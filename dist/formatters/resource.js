"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTask = formatTask;
exports.formatNote = formatNote;
exports.formatCollection = formatCollection;
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function nestedId(value, key) {
    if (!isObject(value.id))
        return undefined;
    const id = value.id[key];
    return typeof id === 'string' ? id : undefined;
}
function formatTask(value) {
    if (!isObject(value))
        return value;
    const taskId = nestedId(value, 'task_id');
    const rawAssignees = Array.isArray(value.assignees)
        ? value.assignees
        : undefined;
    const assignees = rawAssignees
        ? rawAssignees.map((assignee) => {
            if (!isObject(assignee))
                return assignee;
            const id = assignee.referenced_actor_id;
            return typeof id === 'string'
                ? { ...assignee, workspace_membership_id: id }
                : assignee;
        })
        : value.assignees;
    const linkedRecords = Array.isArray(value.linked_records)
        ? value.linked_records
        : [];
    return {
        ...value,
        ...(taskId ? { task_id: taskId } : {}),
        ...(typeof value.content_plaintext === 'string'
            ? { content: value.content_plaintext }
            : {}),
        ...(typeof value.deadline_at === 'string' || value.deadline_at === null
            ? { deadline: value.deadline_at }
            : {}),
        ...(typeof value.is_completed === 'boolean'
            ? { completed: value.is_completed }
            : {}),
        assignees,
        assignee_ids: Array.isArray(assignees)
            ? assignees.flatMap((assignee) => isObject(assignee) && typeof assignee.referenced_actor_id === 'string'
                ? [assignee.referenced_actor_id]
                : [])
            : [],
        linked_record_ids: linkedRecords.flatMap((link) => isObject(link) && typeof link.target_record_id === 'string'
            ? [link.target_record_id]
            : []),
    };
}
function formatNote(value) {
    if (!isObject(value))
        return value;
    const noteId = nestedId(value, 'note_id');
    const markdown = typeof value.content_markdown === 'string'
        ? value.content_markdown
        : undefined;
    const content = markdown ??
        (typeof value.content_plaintext === 'string'
            ? value.content_plaintext
            : undefined);
    return {
        ...value,
        ...(noteId ? { note_id: noteId } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(markdown !== undefined ? { markdown } : {}),
    };
}
function formatCollection(value, formatItem) {
    if (!isObject(value) || !Array.isArray(value.data))
        return formatItem(value);
    return { ...value, data: value.data.map(formatItem) };
}
//# sourceMappingURL=resource.js.map