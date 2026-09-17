import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { TaskEndpoints } from '../api/endpoints/tasks';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createTaskCommand(): Command {
  const task = new Command('task').description('Manage tasks');

  // List tasks
  task
    .command('list')
    .description('List tasks')
    .option('--limit <number>', 'Maximum tasks to return', parseInt)
    .option('--offset <number>', 'Number of tasks to skip', parseInt)
    .option('--all', 'Fetch every page and return a completion receipt')
    .option('--sort <sort>', 'Sort order (created_at:asc or created_at:desc)')
    .option('--linked-object <slug>', 'Filter by linked object (e.g., people)')
    .option('--linked-record-id <id>', 'Filter by linked record ID')
    .option('--assignee <email-or-id>', 'Filter by assignee')
    .option(
      '--completed <boolean>',
      'Filter by completion status',
      (val) => val === 'true'
    )
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        if (options.all && options.offset !== undefined) {
          throw new Error('Cannot combine --all with --offset.');
        }
        const client = new AttioClient(options.apiKey);
        const taskApi = new TaskEndpoints(client);

        const request = {
          limit: options.limit,
          offset: options.offset,
          sort: options.sort,
          linked_object: options.linkedObject,
          linked_record_id: options.linkedRecordId,
          assignee: options.assignee,
          is_completed: options.completed,
        };
        const result = options.all
          ? await taskApi.listAllTasks(request)
          : await taskApi.listTasksPage(request);
        const tasks = result.data;

        if (options.format === 'table') {
          const tableData = tasks.map((t) => ({
            task_id: t.id.task_id,
            content: t.content_plaintext.substring(0, 50),
            is_completed: t.is_completed,
            deadline_at: t.deadline_at
              ? new Date(t.deadline_at).toISOString()
              : 'none',
            created_at: new Date(t.created_at).toISOString(),
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(tasks));
        } else {
          console.log(formatJson(result));
        }
      } catch (error) {
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
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (taskId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const taskApi = new TaskEndpoints(client);

        const t = await taskApi.getTask(taskId);

        if (options.format === 'table') {
          console.log(
            formatGenericTable([
              {
                task_id: t.id.task_id,
                content: t.content_plaintext,
                is_completed: t.is_completed,
                deadline_at: t.deadline_at
                  ? new Date(t.deadline_at).toISOString()
                  : 'none',
                created_at: new Date(t.created_at).toISOString(),
              },
            ])
          );
        } else if (options.format === 'csv') {
          console.log(formatCsv(t));
        } else {
          console.log(formatJson(t));
        }
      } catch (error) {
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
    .requiredOption('--content <content>', 'Task content (max 2000 characters)')
    .option('--deadline <date>', 'Deadline (ISO 8601 timestamp)')
    .option('--completed', 'Mark as completed', false)
    .option('--linked-object <slug>', 'Object of the linked record')
    .option('--linked-record-id <id>', 'Link to a record by ID')
    .option('--assignee-id <id>', 'Assign to a workspace member by ID')
    .option('--output <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        if (Boolean(options.linkedObject) !== Boolean(options.linkedRecordId)) {
          throw new Error(
            '--linked-object and --linked-record-id must be provided together.'
          );
        }
        const client = new AttioClient(options.apiKey);
        const taskApi = new TaskEndpoints(client);

        const linked_records = options.linkedRecordId
          ? [
              {
                target_object: options.linkedObject,
                target_record_id: options.linkedRecordId,
              },
            ]
          : [];

        const assignees = options.assigneeId
          ? [
              {
                referenced_actor_type: 'workspace-member' as const,
                referenced_actor_id: options.assigneeId,
              },
            ]
          : [];

        const data = {
          data: {
            content: options.content,
            format: 'plaintext' as const,
            deadline_at: options.deadline || null,
            is_completed: options.completed,
            linked_records,
            assignees,
          },
        };

        const t = await taskApi.createTask(data);

        if (options.output === 'table') {
          console.log(
            formatGenericTable([
              {
                task_id: t.id.task_id,
                content: t.content_plaintext,
                is_completed: t.is_completed,
                deadline_at: t.deadline_at
                  ? new Date(t.deadline_at).toISOString()
                  : 'none',
                created_at: new Date(t.created_at).toISOString(),
              },
            ])
          );
        } else if (options.output === 'csv') {
          console.log(formatCsv(t));
        } else {
          console.log(formatJson(t));
        }
      } catch (error) {
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
    .option('--deadline <date>', 'Updated deadline (ISO 8601 timestamp)')
    .option(
      '--completed <boolean>',
      'Completion status',
      (val) => val === 'true'
    )
    .option('--output <format>', 'Output format (json|table|csv)', 'json')
    .action(async (taskId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const taskApi = new TaskEndpoints(client);

        const data: {
          data: { deadline_at?: string | null; is_completed?: boolean };
        } = {
          data: {},
        };

        if (options.deadline) data.data.deadline_at = options.deadline;
        if (options.completed !== undefined)
          data.data.is_completed = options.completed;

        const t = await taskApi.updateTask(taskId, data);

        if (options.output === 'table') {
          console.log(
            formatGenericTable([
              {
                task_id: t.id.task_id,
                content: t.content_plaintext,
                is_completed: t.is_completed,
                deadline_at: t.deadline_at
                  ? new Date(t.deadline_at).toISOString()
                  : 'none',
                created_at: new Date(t.created_at).toISOString(),
              },
            ])
          );
        } else if (options.output === 'csv') {
          console.log(formatCsv(t));
        } else {
          console.log(formatJson(t));
        }
      } catch (error) {
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
    .action(async (taskId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const taskApi = new TaskEndpoints(client);

        await taskApi.deleteTask(taskId);
        console.log(formatJson({ deleted: true, task_id: taskId }));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return task;
}
