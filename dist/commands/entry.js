"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntryCommand = createEntryCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const lists_1 = require("../api/endpoints/lists");
const json_1 = require("../formatters/json");
const filter_validator_1 = require("../utils/filter-validator");
const connected_service_1 = require("../api/connected-service");
const stdin_1 = require("../utils/stdin");
function createEntryCommand() {
    const entry = new commander_1.Command('entry').description('Manage list entries');
    entry
        .command('list')
        .description('List entries in a list')
        .argument('<list-slug>', 'List slug or ID')
        .option('--limit <number>', 'Maximum entries to return', parseInt)
        .option('--offset <number>', 'Number of entries to skip', parseInt)
        .option('--filter <json>', 'Filter query as JSON (e.g., \'{"status":{"$eq":"active"}}\')')
        .option('--sort <json>', 'Sort specification as JSON (e.g., \'[{"attribute":"created_at","direction":"desc"}]\')')
        .action(async (listSlug, options) => {
        try {
            (0, stdin_1.requireAtMostOneStdin)([
                { name: '--filter', value: options.filter },
                { name: '--sort', value: options.sort },
            ]);
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            // Parse filter if provided
            let filter;
            if (options.filter) {
                filter = await (0, stdin_1.readJsonInput)(options.filter, '--filter');
                const validation = (0, filter_validator_1.validateFilterStructure)(filter);
                if (!validation.valid) {
                    throw new Error(`Invalid --filter structure: ${validation.errors.join('; ')}`);
                }
            }
            // Parse sort if provided
            let sorts;
            if (options.sort) {
                sorts = await (0, stdin_1.readJsonInput)(options.sort, '--sort');
                if (!Array.isArray(sorts)) {
                    throw new Error('--sort must be a JSON array.');
                }
            }
            const entries = await listApi.listEntries(listSlug, {
                limit: options.limit,
                offset: options.offset,
                filter: filter,
                sorts: sorts,
            });
            // Apply compact formatting unless verbose mode is enabled
            const displayEntries = entries;
            console.log((0, json_1.formatJson)(displayEntries));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('get')
        .description('Get a specific list entry')
        .argument('<list-slug>', 'List slug or ID')
        .argument('<entry-id>', 'Entry ID')
        .action(async (listSlug, entryId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const entryData = await listApi.getEntry(listSlug, entryId);
            // Apply compact formatting unless verbose mode is enabled
            const displayEntry = entryData;
            console.log((0, json_1.formatJson)(displayEntry));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('create')
        .description('Create a new list entry')
        .argument('<list-slug>', 'List slug or ID')
        .argument('<parent-object>', 'Parent object slug or ID')
        .argument('<parent-record-id>', 'Parent record ID')
        .argument('[json]', 'Entry values as JSON; defaults to stdin')
        .action(async (listSlug, parentObject, parentRecordId, json, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const entryValues = json
                ? await (0, stdin_1.readJsonInput)(json, 'Entry values')
                : {};
            const entryData = await listApi.createEntry(listSlug, {
                data: {
                    parent_record_id: parentRecordId,
                    parent_object: parentObject,
                    entry_values: entryValues,
                },
            });
            // Apply compact formatting unless verbose mode is enabled
            const displayEntry = entryData;
            console.log((0, json_1.formatJson)(displayEntry));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('update')
        .description('Update a list entry (appends to multiselect attributes)')
        .argument('<list-slug>', 'List slug or ID')
        .argument('<entry-id>', 'Entry ID')
        .argument('[json]', 'Updated entry values as JSON; defaults to stdin')
        .action(async (listSlug, entryId, json, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const entryValues = await (0, stdin_1.readJsonInput)(json, 'Updated entry values');
            const entryData = await listApi.updateEntry(listSlug, entryId, {
                data: { entry_values: entryValues },
            });
            // Apply compact formatting unless verbose mode is enabled
            const displayEntry = entryData;
            console.log((0, json_1.formatJson)(displayEntry));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('update-record')
        .description('Update the single list entry for a parent record')
        .argument('<list-slug>', 'List slug or ID')
        .argument('<parent-object>', 'Parent object slug or ID')
        .argument('<parent-record-id>', 'Parent record ID')
        .argument('[json]', 'Updated entry values as JSON; defaults to stdin')
        .option('--replace', 'Replace supplied multiselect values instead of prepending them')
        .action(async (listSlug, parentObject, parentRecordId, json, options) => {
        try {
            const entryValues = await (0, stdin_1.readJsonInput)(json, 'Updated entry values');
            const result = await (0, connected_service_1.callAttio)('update-list-entry-by-record-id', {
                list: listSlug,
                parent_object: parentObject,
                parent_record_id: parentRecordId,
                entry_values: entryValues,
                patch_multiselect_values: !options.replace,
            });
            printConnectedResult(result);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('delete')
        .description('Delete a list entry')
        .argument('<list-slug>', 'List slug or ID')
        .argument('<entry-id>', 'Entry ID')
        .action(async (listSlug, entryId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            await listApi.deleteEntry(listSlug, entryId);
            console.log((0, json_1.formatJson)({
                deleted: true,
                list: listSlug,
                entry_id: entryId,
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('assert')
        .description('Assert (upsert) a list entry - overwrites all values')
        .argument('<list-slug>', 'List slug or ID')
        .argument('[json]', 'Entry identity and values as JSON; defaults to stdin')
        .action(async (listSlug, json, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const data = await (0, stdin_1.readJsonInput)(json, 'Entry data');
            // Validate required fields
            if (!data.entry_values) {
                console.error('Error: Entry data must include "entry_values".');
                console.error('Example: {"parent_record_id":"xyz","entry_values":{"status":"active"}}');
                process.exit(1);
            }
            const entryData = await listApi.assertEntry(listSlug, {
                data: data,
            });
            // Apply compact formatting unless verbose mode is enabled
            const displayEntry = entryData;
            console.log((0, json_1.formatJson)(displayEntry));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    entry
        .command('attribute-values')
        .description('List attribute values for an entry (including historic values)')
        .argument('<list-slug>', 'List slug or ID')
        .argument('<entry-id>', 'Entry ID')
        .argument('<attribute-slug>', 'Attribute slug')
        .option('--show-historic', 'Include historic values')
        .option('--limit <number>', 'Maximum values to return', parseInt)
        .option('--offset <number>', 'Number of values to skip', parseInt)
        .action(async (listSlug, entryId, attributeSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const listApi = new lists_1.ListEndpoints(client);
            const values = await listApi.listEntryAttributeValues(listSlug, entryId, attributeSlug, {
                show_historic: options.showHistoric,
                limit: options.limit,
                offset: options.offset,
            });
            console.log((0, json_1.formatJson)(values));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return entry;
}
function printConnectedResult(result) {
    console.log((0, json_1.formatJson)(result));
}
//# sourceMappingURL=entry.js.map