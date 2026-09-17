import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { WorkspaceEndpoints } from '../api/endpoints/workspace';
import { formatJson } from '../formatters/json';
import { formatWorkspaceMembersTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createWorkspaceCommand(): Command {
  const workspace = new Command('workspace')
    .description('Manage workspace members and settings');

  workspace
    .command('whoami')
    .description('Show the current Attio token identity and scopes')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const workspaceApi = new WorkspaceEndpoints(client);
        const identity = await workspaceApi.getCurrentIdentity();

        if (options.format === 'table') {
          console.log(formatGenericIdentity(identity));
        } else if (options.format === 'csv') {
          console.log(formatCsv(identity));
        } else {
          console.log(formatJson(identity));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  const members = new Command('members').description(
    'Manage workspace members'
  );

  members
    .command('list')
    .description('List all workspace members')
    .option('--limit <number>', 'Maximum number of members to return', parseInt)
    .option('--offset <number>', 'Number of members to skip', parseInt)
    .option(
      '--format <format>',
      'Output format (json|table|csv)',
      'json'
    )
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const workspaceApi = new WorkspaceEndpoints(client);

        const workspaceMembers = await workspaceApi.listMembers({
          limit: options.limit,
          offset: options.offset,
        });

        if (options.format === 'table') {
          console.log(formatWorkspaceMembersTable(workspaceMembers));
        } else if (options.format === 'csv') {
          console.log(formatCsv(workspaceMembers));
        } else {
          console.log(formatJson(workspaceMembers));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  members
    .command('get')
    .description('Get a specific workspace member')
    .argument('<member-id>', 'Workspace member ID')
    .option(
      '--format <format>',
      'Output format (json|table|csv)',
      'json'
    )
    .action(async (memberId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const workspaceApi = new WorkspaceEndpoints(client);

        const member = await workspaceApi.getMember(memberId);

        if (options.format === 'table') {
          console.log(formatWorkspaceMembersTable([member]));
        } else {
          console.log(formatJson(member));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  workspace.addCommand(members);

  return workspace;
}

function formatGenericIdentity(identity: Record<string, unknown>): string {
  return Object.entries(identity)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join('\n');
}
