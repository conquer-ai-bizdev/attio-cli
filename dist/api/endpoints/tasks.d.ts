import { AttioClient } from '../client';
import { Task } from '../types';
export interface ListTasksOptions {
    limit?: number;
    offset?: number;
    sort?: 'created_at:asc' | 'created_at:desc' | 'completed_at:asc' | 'completed_at:desc';
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
export declare class TaskEndpoints {
    private client;
    constructor(client: AttioClient);
    listTasks(options?: ListTasksOptions): Promise<Task[]>;
    listTasksPage(options?: ListTasksOptions): Promise<TaskPage>;
    listAllTasks(options?: Omit<ListTasksOptions, 'offset'>): Promise<CompleteTaskInventory>;
    getTask(taskId: string): Promise<Task>;
    createTask(data: CreateTaskData): Promise<Task>;
    updateTask(taskId: string, data: UpdateTaskData): Promise<Task>;
    deleteTask(taskId: string): Promise<void>;
}
//# sourceMappingURL=tasks.d.ts.map