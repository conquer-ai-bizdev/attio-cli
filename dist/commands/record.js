"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecordCommand = createRecordCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const records_1 = require("../api/endpoints/records");
const json_1 = require("../formatters/json");
const filter_validator_1 = require("../utils/filter-validator");
const connected_service_1 = require("../api/connected-service");
const page_limit_1 = require("../utils/page-limit");
const stdin_1 = require("../utils/stdin");
function createRecordCommand() {
    const record = new commander_1.Command('record').description('Manage records (people, companies, deals)');
    record
        .command('search')
        .description('Search records by name, domain, email, and other indexed fields')
        .argument('<object>', 'Object slug or ID')
        .argument('<query>', 'Search query')
        .option('--limit <number>', 'Maximum records to return, up to 10', parseInt)
        .option('--offset <number>', 'Number of records to skip', parseInt)
        .action(async (objectSlug, query, options) => {
        try {
            (0, page_limit_1.requirePageLimit)(options.limit, 10, 'Record search');
            console.log((0, json_1.formatJson)(await (0, connected_service_1.callAttio)('search-records', compact({
                object: objectSlug,
                query,
                limit: options.limit,
                offset: options.offset,
            }))));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // List records
    record
        .command('list')
        .description('List records for an object')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .option('--limit <number>', 'Maximum records to return', parseInt)
        .option('--offset <number>', 'Number of records to skip', parseInt)
        .option('--all', 'Fetch every page and return a completion receipt')
        .option('--filter <json>', 'Filter query as JSON (e.g., \'{"email_addresses":{"email_address":{"$contains":"@example.com"}}}\')')
        .option('--sort <json>', 'Sort specification as JSON (e.g., \'[{"attribute":"name","direction":"asc"}]\')')
        .action(async (objectSlug, options) => {
        try {
            if (options.all && options.offset !== undefined) {
                throw new Error('Cannot combine --all with --offset.');
            }
            (0, stdin_1.requireAtMostOneStdin)([
                { name: '--filter', value: options.filter },
                { name: '--sort', value: options.sort },
            ]);
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
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
            const request = {
                limit: options.limit,
                offset: options.offset,
                filter: filter,
                sorts: sorts,
            };
            const result = options.all
                ? await recordApi.listAllRecords(objectSlug, request)
                : await recordApi.listRecordsPage(objectSlug, request);
            // Apply compact formatting unless verbose mode is enabled
            const displayRecords = result.data;
            console.log((0, json_1.formatJson)({ data: displayRecords, pagination: result.pagination }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Get record
    record
        .command('get')
        .description('Get a specific record')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .argument('<record-id>', 'Record ID')
        .action(async (objectSlug, recordId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
            const rec = await recordApi.getRecord(objectSlug, recordId);
            // Apply compact formatting unless verbose mode is enabled
            const displayRecord = rec;
            console.log((0, json_1.formatJson)(displayRecord));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Get records by IDs
    record
        .command('get-many')
        .description('Get the records that exist from a list of record IDs')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .argument('<record-ids...>', 'One or more record IDs')
        .action(async (objectSlug, recordIds, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
            const records = await recordApi.getRecordsByIds(objectSlug, recordIds);
            const displayRecords = records;
            const foundIds = new Set(records.map((record) => record.id.record_id));
            console.log((0, json_1.formatJson)({
                records: displayRecords,
                missing_record_ids: [
                    ...new Set(recordIds.filter((id) => !foundIds.has(id))),
                ],
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
    // Create record
    record
        .command('create')
        .description('Create a new record')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .argument('[json]', 'Record values as JSON; defaults to stdin')
        .action(async (objectSlug, json, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
            const data = await (0, stdin_1.readJsonInput)(json, 'Record values');
            const created = await (0, connected_service_1.callAttio)('create-record', {
                object: objectSlug,
                values: data,
            });
            const recordId = recordIdFrom(created);
            if (!recordId) {
                throw new Error('Attio created the record without returning its ID.');
            }
            const rec = await recordApi.getRecord(objectSlug, recordId);
            // Apply compact formatting unless verbose mode is enabled
            const displayRecord = rec;
            console.log((0, json_1.formatJson)(displayRecord));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Update record
    record
        .command('update')
        .description('Update an existing record')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .argument('<record-id>', 'Record ID')
        .argument('[json]', 'Updated values as JSON; defaults to stdin')
        .option('--replace', 'Replace supplied multiselect values instead of prepending them')
        .action(async (objectSlug, recordId, json, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
            const data = await (0, stdin_1.readJsonInput)(json, 'Updated record values');
            await (0, connected_service_1.callAttio)('update-record', {
                object: objectSlug,
                record_id: recordId,
                values: data,
                patch_multiselect_values: !options.replace,
            });
            const rec = await recordApi.getRecord(objectSlug, recordId);
            // Apply compact formatting unless verbose mode is enabled
            const displayRecord = rec;
            console.log((0, json_1.formatJson)(displayRecord));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Delete record
    record
        .command('delete')
        .description('Delete a record')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .argument('<record-id>', 'Record ID')
        .action(async (objectSlug, recordId, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
            await recordApi.deleteRecord(objectSlug, recordId);
            console.log((0, json_1.formatJson)({ deleted: true, object: objectSlug, record_id: recordId }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    record
        .command('merge')
        .description('Merge a secondary record into a primary record (returns a new record ID)')
        .argument('<object>', 'Object slug or ID')
        .argument('<primary-record-id>', 'Record whose conflicting values win')
        .argument('<secondary-record-id>', 'Record merged into the primary record')
        .action(async (objectSlug, primaryRecordId, secondaryRecordId) => {
        try {
            const result = await (0, connected_service_1.callAttio)('merge-records', {
                object: objectSlug,
                primary_record_id: primaryRecordId,
                secondary_record_id: secondaryRecordId,
            });
            const output = {
                object: objectSlug,
                primary_record_id: primaryRecordId,
                secondary_record_id: secondaryRecordId,
                result,
            };
            console.log((0, json_1.formatJson)(output));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    record
        .command('assert')
        .description('Assert (upsert) a record using matching attribute')
        .argument('<object>', 'Object slug (e.g., people, companies, deals)')
        .argument('<attribute>', 'Matching attribute (e.g., email_addresses)')
        .argument('[json]', 'Record values as JSON; defaults to stdin')
        .option('--replace', 'Replace supplied multiselect values instead of prepending them')
        .action(async (objectSlug, matchingAttribute, json, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const recordApi = new records_1.RecordEndpoints(client);
            const data = await (0, stdin_1.readJsonInput)(json, 'Record values');
            const upserted = await (0, connected_service_1.callAttio)('upsert-record', {
                object: objectSlug,
                matching_attribute: matchingAttribute,
                values: data,
                patch_multiselect_values: !options.replace,
            });
            const recordId = recordIdFrom(upserted);
            if (!recordId) {
                throw new Error('Attio upserted the record without returning its ID.');
            }
            const rec = await recordApi.getRecord(objectSlug, recordId);
            // Apply compact formatting unless verbose mode is enabled
            const displayRecord = rec;
            console.log((0, json_1.formatJson)(displayRecord));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return record;
}
function recordIdFrom(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return undefined;
    }
    const record = value;
    if (typeof record.record_id === 'string')
        return record.record_id;
    if (record.id && typeof record.id === 'object' && !Array.isArray(record.id)) {
        const id = record.id.record_id;
        if (typeof id === 'string')
            return id;
    }
    return undefined;
}
function compact(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
//# sourceMappingURL=record.js.map