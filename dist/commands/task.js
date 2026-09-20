"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskCommand = createTaskCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const tasks_1 = require("../api/endpoints/tasks");
const json_1 = require("../formatters/json");
const resource_1 = require("../formatters/resource");
const stdin_1 = require("../utils/stdin");
function createTaskCommand() {
    const task = new commander_1.Command('task').description('Manage tasks');
    // List tasks
    task
        .command('list')
        .description('List tasks')
        .option('--limit <number>', 'Maximum tasks to return', parseInt)
        .option('--offset <number>', 'Number of tasks to skip', parseInt)
        .option('--all', 'Fetch every page and return a completion receipt')
        .option('--sort <sort>', 'Sort order (created_at:asc or created_at:desc)')
        .option('--link <object:id>', 'Filter by linked record')
        .option('--assignee <email-or-id>', 'Filter by assignee')
        .option('--state <state>', 'Filter by state (open|done)')
        .action(async (options) => {
        try {
            if (options.all && options.offset !== undefined) {
                throw new Error('Cannot combine --all with --offset.');
            }
            const client = new client_1.AttioClient(options.apiKey);
            const taskApi = new tasks_1.TaskEndpoints(client);
            const linked = options.link ? parseLink(options.link) : undefined;
            if (options.state && !['open', 'done'].includes(options.state)) {
                throw new Error('--state must be open or done.');
            }
            const request = {
                limit: options.limit,
                offset: options.offset,
                sort: options.sort,
                linked_object: linked?.object,
                linked_record_id: linked?.recordId,
                assignee: options.assignee,
                is_completed: options.state === 'done'
                    ? true
                    : options.state === 'open'
                        ? false
                        : undefined,
            };
            const result = options.all
                ? await taskApi.listAllTasks(request)
                : await taskApi.listTasksPage(request);
            console.log((0, json_1.formatJson)((0, resource_1.formatCollection)(result, resource_1.formatTask)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Get task
    task
        .command('get')
        .description('Get a specific task')
        .argument('<task-id>', 'Task ID')
        .action(async (taskId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const taskApi = new tasks_1.TaskEndpoints(client);
            const t = await taskApi.getTask(taskId);
            console.log((0, json_1.formatJson)((0, resource_1.formatTask)(t)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Create task
    task
        .command('create')
        .description('Create a new task')
        .argument('[content]', 'Task text; defaults to stdin')
        .option('--due <date>', 'Deadline as an ISO 8601 timestamp')
        .option('--done', 'Create as completed')
        .option('--link <object:id>', 'Linked record as object:record-id')
        .option('--assignee <id>', 'Workspace member ID')
        .action(async (content, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const taskApi = new tasks_1.TaskEndpoints(client);
            const linked = options.link ? parseLink(options.link) : undefined;
            const linked_records = linked
                ? [
                    {
                        target_object: linked.object,
                        target_record_id: linked.recordId,
                    },
                ]
                : [];
            const assignees = options.assignee
                ? [
                    {
                        referenced_actor_type: 'workspace-member',
                        referenced_actor_id: options.assignee,
                    },
                ]
                : [];
            const data = {
                data: {
                    content: await (0, stdin_1.readInput)(content, 'Task text'),
                    format: 'plaintext',
                    deadline_at: options.due || null,
                    is_completed: Boolean(options.done),
                    linked_records,
                    assignees,
                },
            };
            const t = await taskApi.createTask(data);
            console.log((0, json_1.formatJson)((0, resource_1.formatTask)(t)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Update task
    task
        .command('update')
        .description('Update an existing task')
        .argument('<task-id>', 'Task ID')
        .option('--due <date>', 'New deadline as an ISO 8601 timestamp')
        .option('--done', 'Mark completed')
        .option('--open', 'Mark incomplete')
        .action(async (taskId, options) => {
        try {
            if (options.done && options.open) {
                throw new Error('Use either --done or --open, not both.');
            }
            if (!options.due && !options.done && !options.open) {
                throw new Error('Provide --due, --done, or --open.');
            }
            const client = new client_1.AttioClient(options.apiKey);
            const taskApi = new tasks_1.TaskEndpoints(client);
            const data = {
                data: {},
            };
            if (options.due)
                data.data.deadline_at = options.due;
            if (options.done)
                data.data.is_completed = true;
            if (options.open)
                data.data.is_completed = false;
            const t = await taskApi.updateTask(taskId, data);
            console.log((0, json_1.formatJson)((0, resource_1.formatTask)(t)));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Delete task
    task
        .command('delete')
        .description('Delete a task')
        .argument('<task-id>', 'Task ID')
        .action(async (taskId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const taskApi = new tasks_1.TaskEndpoints(client);
            await taskApi.deleteTask(taskId);
            console.log((0, json_1.formatJson)({ deleted: true, task_id: taskId }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return task;
}
function parseLink(value) {
    const separator = value.indexOf(':');
    if (separator <= 0 || separator === value.length - 1) {
        throw new Error('--link must be object:record-id.');
    }
    return {
        object: value.slice(0, separator),
        recordId: value.slice(separator + 1),
    };
}
//# sourceMappingURL=task.js.map