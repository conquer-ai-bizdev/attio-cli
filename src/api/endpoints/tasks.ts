import { AttioClient } from '../client';
import { TasksResponseSchema, TaskSchema, Task } from '../types';
import { validate } from '../../utils/validation';

export interface ListTasksOptions {
  limit?: number;
  offset?: number;
  sort?: 'created_at:asc' | 'created_at:desc';
  linked_object?: string;
  linked_record_id?: string;
  assignee?: string;
  is_completed?: boolean;
}

export interface CreateTaskData {
  data: {
    content: string;
    format: 'plaintext';
    deadline_at?: string | null;
    is_completed: boolean;
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
    const params: Record<string, unknown> = {};
    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;
    if (options?.sort) params.sort = options.sort;
    if (options?.linked_object) params.linked_object = options.linked_object;
    if (options?.linked_record_id)
      params.linked_record_id = options.linked_record_id;
    if (options?.assignee) params.assignee = options.assignee;
    if (options?.is_completed !== undefined)
      params.is_completed = options.is_completed;

    const response = await this.client.get('/tasks', params);
    const validated = validate(TasksResponseSchema, response);
    return validated.data;
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
