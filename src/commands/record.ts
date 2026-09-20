import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { RecordEndpoints } from '../api/endpoints/records';
import { formatJson } from '../formatters/json';
import { formatRecord, formatRecords } from '../formatters/record';
import { validateFilterStructure } from '../utils/filter-validator';
import { callAttio } from '../api/connected-service';
import { requirePageLimit } from '../utils/page-limit';
import { readJsonInput, requireAtMostOneStdin } from '../utils/stdin';

export function createRecordCommand(): Command {
  const record = new Command('record').description(
    'Manage records (people, companies, deals)'
  );

  record
    .command('search')
    .description(
      'Search records by name, domain, email, and other indexed fields'
    )
    .argument('<object>', 'Object slug or ID')
    .argument('<query>', 'Search query')
    .option('--limit <number>', 'Maximum records to return, up to 10', parseInt)
    .option('--offset <number>', 'Number of records to skip', parseInt)
    .action(async (objectSlug: string, query: string, options) => {
      try {
        requirePageLimit(options.limit, 10, 'Record search');
        console.log(
          formatJson(
            await callAttio(
              'search-records',
              compact({
                object: objectSlug,
                query,
                limit: options.limit,
                offset: options.offset,
              })
            )
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

  // List records
  record
    .command('list')
    .description('List records for an object')
    .argument('<object>', 'Object slug (e.g., people, companies, deals)')
    .option('--limit <number>', 'Maximum records to return', parseInt)
    .option('--offset <number>', 'Number of records to skip', parseInt)
    .option('--all', 'Fetch every page and return a completion receipt')
    .option(
      '--filter <json>',
      'Filter query as JSON (e.g., \'{"email_addresses":{"email_address":{"$contains":"@example.com"}}}\')'
    )
    .option('--view <view-id>', 'Apply the filters from a saved Attio view')
    .option(
      '--sort <json>',
      'Sort specification as JSON (e.g., \'[{"attribute":"name","direction":"asc"}]\')'
    )
    .action(async (objectSlug: string, options) => {
      try {
        if (options.all && options.offset !== undefined) {
          throw new Error('Cannot combine --all with --offset.');
        }
        if (options.filter && options.view) {
          throw new Error('Cannot combine --filter with --view.');
        }
        requireAtMostOneStdin([
          { name: '--filter', value: options.filter },
          { name: '--sort', value: options.sort },
        ]);
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        // Parse filter if provided
        let filter: Record<string, unknown> | undefined;
        if (options.filter) {
          filter = await readJsonInput<Record<string, unknown>>(
            options.filter,
            '--filter'
          );
          const validation = validateFilterStructure(filter);
          if (!validation.valid) {
            throw new Error(
              `Invalid --filter structure: ${validation.errors.join('; ')}`
            );
          }
        }

        // Parse sort if provided
        let sorts;
        if (options.sort) {
          sorts = await readJsonInput(options.sort, '--sort');
          if (!Array.isArray(sorts)) {
            throw new Error('--sort must be a JSON array.');
          }
        }

        const request = {
          limit: options.limit,
          offset: options.offset,
          filter: filter,
          filter_view_id: options.view,
          sorts: sorts,
        };
        const result = options.all
          ? await recordApi.listAllRecords(objectSlug, request)
          : await recordApi.listRecordsPage(objectSlug, request);

        // Apply compact formatting unless verbose mode is enabled
        const displayRecords = formatRecords(result.data);

        console.log(
          formatJson({ data: displayRecords, pagination: result.pagination })
        );
      } catch (error) {
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
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        const rec = await recordApi.getRecord(objectSlug, recordId);

        // Apply compact formatting unless verbose mode is enabled
        const displayRecord = formatRecord(rec);

        console.log(formatJson(displayRecord));
      } catch (error) {
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
    .action(async (objectSlug: string, recordIds: string[], options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);
        const records = await recordApi.getRecordsByIds(objectSlug, recordIds);
        const displayRecords = formatRecords(records);

        const foundIds = new Set(records.map((record) => record.id.record_id));
        console.log(
          formatJson({
            records: displayRecords,
            missing_record_ids: [
              ...new Set(recordIds.filter((id) => !foundIds.has(id))),
            ],
          })
        );
      } catch (error) {
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
    .action(async (objectSlug: string, json: string | undefined, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        const data = await readJsonInput(json, 'Record values');
        const created = await callAttio('create-record', {
          object: objectSlug,
          values: data,
        });
        const recordId = recordIdFrom(created);
        if (!recordId) {
          throw new Error('Attio created the record without returning its ID.');
        }
        const rec = await recordApi.getRecord(objectSlug, recordId);

        // Apply compact formatting unless verbose mode is enabled
        const displayRecord = formatRecord(rec);

        console.log(formatJson(displayRecord));
      } catch (error) {
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
    .option(
      '--replace',
      'Replace supplied multiselect values instead of prepending them'
    )
    .action(
      async (
        objectSlug: string,
        recordId: string,
        json: string | undefined,
        options
      ) => {
        try {
          const client = new AttioClient(options.apiKey);
          const recordApi = new RecordEndpoints(client);

          const data = await readJsonInput(json, 'Updated record values');
          await callAttio('update-record', {
            object: objectSlug,
            record_id: recordId,
            values: data,
            patch_multiselect_values: !options.replace,
          });
          const rec = await recordApi.getRecord(objectSlug, recordId);

          // Apply compact formatting unless verbose mode is enabled
          const displayRecord = formatRecord(rec);

          console.log(formatJson(displayRecord));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Delete record
  record
    .command('delete')
    .description('Delete a record')
    .argument('<object>', 'Object slug (e.g., people, companies, deals)')
    .argument('<record-id>', 'Record ID')
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        await recordApi.deleteRecord(objectSlug, recordId);
        console.log(
          formatJson({ deleted: true, object: objectSlug, record_id: recordId })
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  record
    .command('merge')
    .description(
      'Merge a secondary record into a primary record (returns a new record ID)'
    )
    .argument('<object>', 'Object slug or ID')
    .argument('<primary-record-id>', 'Record whose conflicting values win')
    .argument('<secondary-record-id>', 'Record merged into the primary record')
    .action(
      async (
        objectSlug: string,
        primaryRecordId: string,
        secondaryRecordId: string
      ) => {
        try {
          const result = await callAttio('merge-records', {
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
          console.log(formatJson(output));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  record
    .command('assert')
    .description('Assert (upsert) a record using matching attribute')
    .argument('<object>', 'Object slug (e.g., people, companies, deals)')
    .argument('<attribute>', 'Matching attribute (e.g., email_addresses)')
    .argument('[json]', 'Record values as JSON; defaults to stdin')
    .option(
      '--replace',
      'Replace supplied multiselect values instead of prepending them'
    )
    .action(
      async (
        objectSlug: string,
        matchingAttribute: string,
        json: string | undefined,
        options
      ) => {
        try {
          const client = new AttioClient(options.apiKey);
          const recordApi = new RecordEndpoints(client);

          const data = await readJsonInput(json, 'Record values');

          const upserted = await callAttio('upsert-record', {
            object: objectSlug,
            matching_attribute: matchingAttribute,
            values: data,
            patch_multiselect_values: !options.replace,
          });
          const recordId = recordIdFrom(upserted);
          if (!recordId) {
            throw new Error(
              'Attio upserted the record without returning its ID.'
            );
          }
          const rec = await recordApi.getRecord(objectSlug, recordId);

          // Apply compact formatting unless verbose mode is enabled
          const displayRecord = rec;

          console.log(formatJson(displayRecord));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  return record;
}

function recordIdFrom(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.record_id === 'string') return record.record_id;
  if (record.id && typeof record.id === 'object' && !Array.isArray(record.id)) {
    const id = (record.id as Record<string, unknown>).record_id;
    if (typeof id === 'string') return id;
  }
  return undefined;
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  );
}
