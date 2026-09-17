"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkspaceCommand = createWorkspaceCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const workspace_1 = require("../api/endpoints/workspace");
const json_1 = require("../formatters/json");
const connected_service_1 = require("../api/connected-service");
function createWorkspaceCommand() {
    const workspace = new commander_1.Command('workspace').description('Inspect the current workspace, members, and teams');
    workspace
        .command('whoami')
        .description('Show the current Attio token identity and scopes')
        .action(async () => {
        try {
            const identity = (await (0, connected_service_1.callAttio)('whoami', {}));
            console.log((0, json_1.formatJson)(identity));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    const members = new commander_1.Command('members').description('Manage workspace members');
    members
        .command('list')
        .description('List all workspace members')
        .option('--query <text>', 'Filter by member name, email, or team')
        .option('--include-suspended', 'Include suspended members')
        .action(async (options) => {
        try {
            const result = await (0, connected_service_1.callAttio)('list-workspace-members', {
                ...(options.query ? { query: options.query } : {}),
                include_suspended: Boolean(options.includeSuspended),
            });
            const workspaceMembers = Array.isArray(result) ? result : [];
            console.log((0, json_1.formatJson)(workspaceMembers));
        }
        catch (error) {
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
        .action(async (memberId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const workspaceApi = new workspace_1.WorkspaceEndpoints(client);
            const member = await workspaceApi.getMember(memberId);
            console.log((0, json_1.formatJson)(member));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    workspace.addCommand(members);
    const teams = new commander_1.Command('teams').description('Inspect workspace teams');
    teams
        .command('list')
        .description('List workspace teams')
        .option('--include-archived', 'Include archived teams')
        .action(async (options) => {
        try {
            console.log((0, json_1.formatJson)(await (0, connected_service_1.callAttio)('list-workspace-teams', {
                include_archived: Boolean(options.includeArchived),
            })));
        }
        catch (error) {
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
//# sourceMappingURL=workspace.js.map