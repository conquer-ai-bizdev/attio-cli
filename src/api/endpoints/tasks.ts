import { AttioClient } from '../client';
import { TasksResponseSchema, TaskSchema, Task } from '../types';
import { validate } from '../../utils/validation';

export interface ListTasksOptions {
  limit?: number;
  offset?: number;
  sort?:
    | 'created_at:asc'
    | 'created_at:desc'
    | 'completed_at:asc'
    | 'completed_at:desc';
  linked_object?: string;
  linked_record_id?: string;
  assignee?: string;
  is_completed?: boolean;
}

export interface TaskPage {
  data: Task[];
  pagination: {
    complete: boolean;
    offset: number;
    limit: number;
    next_offset: number | null;
  };
}

export interface CompleteTaskInventory {
  data: Task[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_offset: null;
  };
}

export interface CreateTaskData {
  data: {
    content: string;
    format: 'plaintext';
    deadline_at?: string | null;
    is_completed: boolean;
    linked_records?: Array<{
      target_record_id: string;
      target_object: string;
      target_record_matching_attribute?: string;
      target_record_query_value?: string;
    }>;
    assignees?: Array<{
      referenced_actor_id: string;
      referenced_actor_type: 'workspace-member';
      email_address?: string;
    }>;
  };
}

export interface UpdateTaskData {
  data: {
    deadline_at?: string | null;
    is_completed?: boolean;
    linked_records?: Array<{
      target_record_id?: string;
      target_object?: string;
      target_record_matching_attribute?: string;
      target_record_query_value?: string;
    }>;
    assignees?: Array<{
      referenced_actor_id?: string;
      referenced_actor_type?: string;
      email_address?: string;
    }>;
  };
}

export class TaskEndpoints {
  constructor(private client: AttioClient) {}

  async listTasks(options?: ListTasksOptions): Promise<Task[]> {
    return (await this.listTasksPage(options)).data;
  }

  async listTasksPage(options: ListTasksOptions = {}): Promise<TaskPage> {
    validateTaskOptions(options);
    const limit = options.limit ?? 500;
    const offset = options.offset ?? 0;
    const params: Record<string, unknown> = { limit, offset };
    if (options.sort) params.sort = options.sort;
    if (options.linked_object) params.linked_object = options.linked_object;
    if (options.linked_record_id)
      params.linked_record_id = options.linked_record_id;
    if (options.assignee !== undefined) params.assignee = options.assignee;
    if (options.is_completed !== undefined)
      params.is_completed = options.is_completed;

    const response = await this.client.get('/tasks', params);
    const validated = validate(TasksResponseSchema, response);
    const complete = validated.data.length < limit;
    return {
      data: validated.data,
      pagination: {
        complete,
        offset,
        limit,
        next_offset: complete ? null : offset + validated.data.length,
      },
    };
  }

  async listAllTasks(
    options: Omit<ListTasksOptions, 'offset'> = {}
  ): Promise<CompleteTaskInventory> {
    const limit = options.limit ?? 500;
    validateTaskOptions({ ...options, limit });
    const byId = new Map<string, Task>();
    let offset = 0;
    let pages = 0;
    let observedItems = 0;

    while (true) {
      const page = await this.listTasksPage({ ...options, limit, offset });
      pages += 1;
      observedItems += page.data.length;
      for (const task of page.data) byId.set(task.id.task_id, task);
      if (page.pagination.complete) break;
      offset = page.pagination.next_offset!;
    }

    const data = [...byId.values()];
    return {
      data,
      pagination: {
        complete: true,
        pages,
        items: data.length,
        duplicates_removed: observedItems - data.length,
        next_offset: null,
      },
    };
  }

  async getTask(taskId: string): Promise<Task> {
    const response = await this.client.get(`/tasks/${taskId}`);
    const dataResponse = response as { data: unknown };
    return validate(TaskSchema, dataResponse.data);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await this.client.post('/tasks', data);
    const dataResponse = response as { data: unknown };
    return validate(TaskSchema, dataResponse.data);
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<Task> {
    const response = await this.client.patch(`/tasks/${taskId}`, data);
    const dataResponse = response as { data: unknown };
    return validate(TaskSchema, dataResponse.data);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.client.delete(`/tasks/${taskId}`);
  }
}

function validateTaskOptions(options: ListTasksOptions): void {
  const limit = options.limit ?? 500;
  const offset = options.offset ?? 0;
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Task limit must be a positive integer.');
  }
  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error('Task offset must be a non-negative integer.');
  }
  if (Boolean(options.linked_object) !== Boolean(options.linked_record_id)) {
    throw new Error(
      '--linked-object and --linked-record-id must be provided together.'
    );
  }
}
