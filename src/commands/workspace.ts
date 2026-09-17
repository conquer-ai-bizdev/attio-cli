import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { WorkspaceEndpoints } from '../api/endpoints/workspace';
import { formatJson } from '../formatters/json';
import { callAttio } from '../api/connected-service';

export function createWorkspaceCommand(): Command {
  const workspace = new Command('workspace').description(
    'Inspect the current workspace, members, and teams'
  );

  workspace
    .command('whoami')
    .description('Show the current Attio token identity and scopes')
    .action(async () => {
      try {
        const identity = (await callAttio('whoami', {})) as Record<
          string,
          unknown
        >;

        console.log(formatJson(identity));
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
    .option('--query <text>', 'Filter by member name, email, or team')
    .option('--include-suspended', 'Include suspended members')
    .action(async (options) => {
      try {
        const result = await callAttio('list-workspace-members', {
          ...(options.query ? { query: options.query } : {}),
          include_suspended: Boolean(options.includeSuspended),
        });
        const workspaceMembers = Array.isArray(result) ? result : [];

        console.log(formatJson(workspaceMembers));
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
    .action(async (memberId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const workspaceApi = new WorkspaceEndpoints(client);

        const member = await workspaceApi.getMember(memberId);

        console.log(formatJson(member));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  workspace.addCommand(members);

  const teams = new Command('teams').description('Inspect workspace teams');
  teams
    .command('list')
    .description('List workspace teams')
    .option('--include-archived', 'Include archived teams')
    .action(async (options) => {
      try {
        console.log(
          formatJson(
            await callAttio('list-workspace-teams', {
              include_archived: Boolean(options.includeArchived),
            })
          )
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
  workspace.addCommand(teams);

  return workspace;
}
