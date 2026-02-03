import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { RecordEndpoints } from '../api/endpoints/records';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';
import { validateFilterStructure } from '../utils/filter-validator';

export function createRecordCommand(): Command {
  const record = new Command('record').description(
    'Manage records (people, companies, deals)'
  );

  // List records
  record
    .command('list')
    .description('List records for an object')
    .argument('<object>', 'Object slug (e.g., people, companies, deals)')
    .option('--limit <number>', 'Maximum records to return', parseInt)
    .option('--offset <number>', 'Number of records to skip', parseInt)
    .option('--filter <json>', 'Filter query as JSON (e.g., \'{"email_addresses":{"email_address":{"$contains":"@example.com"}}}\')')
    .option('--sort <json>', 'Sort specification as JSON (e.g., \'[{"attribute":"name","direction":"asc"}]\')')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        // Parse filter if provided
        let filter;
        if (options.filter) {
          try {
            filter = JSON.parse(options.filter);

            // Validate filter structure
            const validation = validateFilterStructure(filter);
            if (!validation.valid) {
              console.error('Error: Invalid filter structure');
              validation.errors.forEach((err) => console.error(`  - ${err}`));
              console.error(
                '\nExample: --filter \'{"email_addresses":{"email_address":{"$eq":"user@example.com"}}}\''
              );
              process.exit(1);
            }
          } catch (error) {
            console.error('Error: Invalid JSON in --filter option');
            console.error(
              'Example: --filter \'{"email_addresses":{"email_address":{"$eq":"user@example.com"}}}\''
            );
            process.exit(1);
          }
        }

        // Parse sort if provided
        let sorts;
        if (options.sort) {
          try {
            sorts = JSON.parse(options.sort);
            if (!Array.isArray(sorts)) {
              throw new Error('Sort must be an array');
            }
          } catch (error) {
            console.error('Error: Invalid JSON in --sort option');
            console.error('Example: --sort \'[{"attribute":"name","direction":"asc"}]\'');
            process.exit(1);
          }
        }

        const records = await recordApi.listRecords(objectSlug, {
          limit: options.limit,
          offset: options.offset,
          filter: filter,
          sorts: sorts,
        });

        if (options.format === 'table') {
          const tableData = records.map((rec) => ({
            record_id: rec.id.record_id,
            ...flattenValues(rec.values),
            created_at: new Date(rec.created_at).toISOString(),
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(records));
        } else {
          console.log(formatJson(records));
        }
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
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        const rec = await recordApi.getRecord(objectSlug, recordId);

        if (options.format === 'table') {
          const tableData = [
            {
              record_id: rec.id.record_id,
              ...flattenValues(rec.values),
              created_at: new Date(rec.created_at).toISOString(),
            },
          ];
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(rec));
        } else {
          console.log(formatJson(rec));
        }
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
    .requiredOption('--data <json>', 'Record data as JSON string')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        const data = JSON.parse(options.data);
        const rec = await recordApi.createRecord(objectSlug, { data });

        if (options.format === 'table') {
          const tableData = [
            {
              record_id: rec.id.record_id,
              ...flattenValues(rec.values),
              created_at: new Date(rec.created_at).toISOString(),
            },
          ];
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(rec));
        } else {
          console.log(formatJson(rec));
        }
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
    .requiredOption('--data <json>', 'Updated data as JSON string')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        const data = JSON.parse(options.data);
        const rec = await recordApi.updateRecord(objectSlug, recordId, {
          data,
        });

        if (options.format === 'table') {
          const tableData = [
            {
              record_id: rec.id.record_id,
              ...flattenValues(rec.values),
              created_at: new Date(rec.created_at).toISOString(),
            },
          ];
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(rec));
        } else {
          console.log(formatJson(rec));
        }
      } catch (error) {
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
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        await recordApi.deleteRecord(objectSlug, recordId);
        console.log(`Record ${recordId} deleted successfully`);
      } catch (error) {
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
    .requiredOption('--matching-attribute <slug>', 'Attribute to match on (e.g., email_addresses)')
    .requiredOption('--data <json>', 'Record data as JSON')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const recordApi = new RecordEndpoints(client);

        let data;
        try {
          data = JSON.parse(options.data);
        } catch (error) {
          console.error('Error: Invalid JSON in --data option');
          console.error('Example: --data \'{"email_addresses":[{"email_address":"test@example.com"}]}\'');
          process.exit(1);
        }

        const rec = await recordApi.assertRecord(
          objectSlug,
          options.matchingAttribute,
          { data }
        );

        if (options.format === 'table') {
          const tableData = {
            record_id: rec.id.record_id,
            object_id: rec.id.object_id,
            ...flattenValues(rec.values),
            created_at: new Date(rec.created_at).toISOString(),
          };
          console.log(formatGenericTable([tableData]));
        } else if (options.format === 'csv') {
          console.log(formatCsv(rec));
        } else {
          console.log(formatJson(rec));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return record;
}

// Helper to flatten record values for display
function flattenValues(values: Record<string, unknown>): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value) && value.length > 0) {
      // Take first value if array
      const firstValue = value[0];
      if (firstValue && typeof firstValue === 'object' && 'value' in firstValue) {
        const val = (firstValue as { value: unknown }).value;
        if (typeof val === 'object' && val !== null) {
          flattened[key] = JSON.stringify(val);
        } else {
          flattened[key] = String(val);
        }
      } else {
        flattened[key] = JSON.stringify(value);
      }
    } else {
      flattened[key] = JSON.stringify(value);
    }
  }

  return flattened;
}
