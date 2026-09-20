type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nestedId(value: JsonObject, key: string): string | undefined {
  if (!isObject(value.id)) return undefined;
  const id = value.id[key];
  return typeof id === 'string' ? id : undefined;
}

export function formatTask(value: unknown): unknown {
  if (!isObject(value)) return value;

  const taskId = nestedId(value, 'task_id');
  const rawAssignees: unknown[] | undefined = Array.isArray(value.assignees)
    ? (value.assignees as unknown[])
    : undefined;
  const assignees = rawAssignees
    ? rawAssignees.map((assignee) => {
        if (!isObject(assignee)) return assignee;
        const id = assignee.referenced_actor_id;
        return typeof id === 'string'
          ? { ...assignee, workspace_membership_id: id }
          : assignee;
      })
    : value.assignees;
  const linkedRecords: unknown[] = Array.isArray(value.linked_records)
    ? (value.linked_records as unknown[])
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
      ? assignees.flatMap((assignee) =>
          isObject(assignee) && typeof assignee.referenced_actor_id === 'string'
            ? [assignee.referenced_actor_id]
            : []
        )
      : [],
    linked_record_ids: linkedRecords.flatMap((link) =>
      isObject(link) && typeof link.target_record_id === 'string'
        ? [link.target_record_id]
        : []
    ),
  };
}

export function formatNote(value: unknown): unknown {
  if (!isObject(value)) return value;
  const noteId = nestedId(value, 'note_id');
  const markdown =
    typeof value.content_markdown === 'string'
      ? value.content_markdown
      : undefined;
  const content =
    markdown ??
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

export function formatCollection(
  value: unknown,
  formatItem: (item: unknown) => unknown
): unknown {
  if (!isObject(value) || !Array.isArray(value.data)) return formatItem(value);
  return { ...value, data: value.data.map(formatItem) };
}
