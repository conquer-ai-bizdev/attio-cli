"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListCommand = createListCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const lists_1 = require("../api/endpoints/lists");
const attributes_1 = require("../api/endpoints/attributes");
const json_1 = require("../formatters/json");
function isValidSnakeCase(str) {
    // Valid snake_case: lowercase letters, numbers, and underscores only
    // Must start with a letter, cannot have consecutive underscores
    return /^[a-z][a-z0-9_]*[a-z0-9]$|^[a-z]$/.test(str) && !str.includes('__');
}
function createListCommand() {
    const list = new commander_1.Command('list').description('Manage lists');
    // List all lists
    list
        .command('all')
        .description('List all lists in workspace')
        .option('--limit <number>', 'Maximum lists to return', parseInt)
        .option('--offset <number>', 'Number of lists to skip', parseInt)
        .action(async (options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const lists = await listApi.listLists({
                limit: options.limit,
                offset: options.offset,
            });
            console.log((0, json_1.formatJson)(lists));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Get specific list
    list
        .command('get')
        .description('Get a specific list')
        .argument('<list-slug>', 'List slug or ID')
        .action(async (listSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const listData = await listApi.getList(listSlug);
            console.log((0, json_1.formatJson)(listData));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    list
        .command('create')
        .description('Create a new list')
        .argument('<slug>', 'API slug in snake_case')
        .argument('<name>', 'Display name')
        .argument('<parent-object>', 'Parent object slug or ID')
        .option('--access <level>', 'Access level (full-access|read-and-write|read-only)', 'full-access')
        .action(async (slug, name, parentObject, options) => {
        try {
            // Validate api_slug is in snake_case format
            if (!isValidSnakeCase(slug)) {
                console.error('Error: api_slug must be in snake_case format');
                console.error('  Valid format: lowercase letters, numbers, and underscores only');
                console.error('  Must start with a letter');
                console.error('  Examples: my_list, test_list_1, customer_data');
                console.error(`  Invalid: ${slug}`);
                process.exit(1);
            }
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const data = {
                data: {
                    api_slug: slug,
                    name,
                    parent_object: parentObject,
                    workspace_access: options.access,
                    workspace_member_access: [],
                },
            };
            const listData = await listApi.createList(data);
            console.log((0, json_1.formatJson)(listData));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    list
        .command('update')
        .description('Update a list')
        .argument('<list-slug>', 'List slug or ID')
        .option('--name <name>', 'New display name')
        .option('--access <level>', 'New access level (full-access|read-and-write|read-only)')
        .action(async (listSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const data = { data: {} };
            if (options.name)
                data.data.name = options.name;
            if (options.access) {
                data.data.workspace_access = options.access;
            }
            if (Object.keys(data.data).length === 0) {
                console.error('Error: Provide --name or --access.');
                process.exit(1);
            }
            const listData = await listApi.updateList(listSlug, data);
            console.log((0, json_1.formatJson)(listData));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // List attributes
    list
        .command('attributes')
        .description('List attributes for a list')
        .argument('<list-slug>', 'List slug or ID')
        .action(async (listSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const attributes = await listApi.listAttributes(listSlug);
            console.log((0, json_1.formatJson)(attributes));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // List attributes with values (convenience command)
    list
        .command('attributes-with-values')
        .description('List attributes for a list with their possible values (select options/statuses)')
        .argument('<list-slug>', 'List slug or ID')
        .option('--show-archived', 'Include archived attributes and options')
        .action(async (listSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const attributeApi = new attributes_1.AttributeEndpoints(client);
            const attributes = await attributeApi.listAttributesWithValues('lists', listSlug, { show_archived: options.showArchived });
            console.log((0, json_1.formatJson)(attributes));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return list;
}
//# sourceMappingURL=list.js.map