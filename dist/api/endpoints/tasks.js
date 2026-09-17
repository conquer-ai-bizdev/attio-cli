"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class TaskEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listTasks(options) {
        return (await this.listTasksPage(options)).data;
    }
    async listTasksPage(options = {}) {
        validateTaskOptions(options);
        const limit = options.limit ?? 10;
        const offset = options.offset ?? 0;
        const params = { limit, offset };
        if (options.sort)
            params.sort = options.sort;
        if (options.linked_object)
            params.linked_object = options.linked_object;
        if (options.linked_record_id)
            params.linked_record_id = options.linked_record_id;
        if (options.assignee !== undefined)
            params.assignee = options.assignee;
        if (options.is_completed !== undefined)
            params.is_completed = options.is_completed;
        const response = await this.client.get('/tasks', params);
        const validated = (0, validation_1.validate)(types_1.TasksResponseSchema, response);
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
    async listAllTasks(options = {}) {
        const limit = options.limit ?? 10;
        validateTaskOptions({ ...options, limit });
        const byId = new Map();
        let offset = 0;
        let pages = 0;
        let observedItems = 0;
        while (true) {
            const page = await this.listTasksPage({ ...options, limit, offset });
            pages += 1;
            observedItems += page.data.length;
            for (const task of page.data)
                byId.set(task.id.task_id, task);
            if (page.pagination.complete)
                break;
            offset = page.pagination.next_offset;
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
    async getTask(taskId) {
        const response = await this.client.get(`/tasks/${taskId}`);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.TaskSchema, dataResponse.data);
    }
    async createTask(data) {
        const response = await this.client.post('/tasks', data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.TaskSchema, dataResponse.data);
    }
    async updateTask(taskId, data) {
        const response = await this.client.patch(`/tasks/${taskId}`, data);
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.TaskSchema, dataResponse.data);
    }
    async deleteTask(taskId) {
        await this.client.delete(`/tasks/${taskId}`);
    }
}
exports.TaskEndpoints = TaskEndpoints;
function validateTaskOptions(options) {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
        throw new Error('Task limit must be an integer between 1 and 10.');
    }
    if (!Number.isInteger(offset) || offset < 0) {
        throw new Error('Task offset must be a non-negative integer.');
    }
    if (Boolean(options.linked_object) !== Boolean(options.linked_record_id)) {
        throw new Error('--linked-object and --linked-record-id must be provided together.');
    }
}
//# sourceMappingURL=tasks.js.map