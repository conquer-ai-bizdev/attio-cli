import { describe, expect, it } from 'vitest';
import {
  formatCollection,
  formatNote,
  formatTask,
} from '../../../src/formatters/resource';

describe('resource formatters', () => {
  it('adds stable task aliases without removing raw fields', () => {
    const raw = {
      id: { task_id: 'task-1' },
      content_plaintext: 'Follow up',
      deadline_at: '2026-09-20T00:00:00Z',
      is_completed: false,
      assignees: [{ referenced_actor_id: 'member-1' }],
      linked_records: [{ target_record_id: 'deal-1' }],
    };

    expect(formatTask(raw)).toEqual({
      ...raw,
      task_id: 'task-1',
      content: 'Follow up',
      deadline: '2026-09-20T00:00:00Z',
      completed: false,
      assignees: [
        {
          referenced_actor_id: 'member-1',
          workspace_membership_id: 'member-1',
        },
      ],
      assignee_ids: ['member-1'],
      linked_record_ids: ['deal-1'],
    });
  });

  it('adds stable note aliases and formats collection data', () => {
    const raw = {
      id: { note_id: 'note-1' },
      content_plaintext: 'Heading',
      content_markdown: '## Heading',
    };

    expect(
      formatCollection({ data: [raw], pagination: {} }, formatNote)
    ).toEqual({
      data: [
        {
          ...raw,
          note_id: 'note-1',
          content: '## Heading',
          markdown: '## Heading',
        },
      ],
      pagination: {},
    });
  });
});
