import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { ListEndpoints } from '../api/endpoints/lists';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';
import { validateFilterStructure } from '../utils/filter-validator';

export function createEntryCommand(): Command {
  const entry = new Command('entry').description('Manage list entries');

  entry
    .command('list')
    .description('List entries in a list')
    .argument('<list-slug>', 'List slug or ID')
    .option('--limit <number>', 'Maximum entries to return', parseInt)
    .option('--offset <number>', 'Number of entries to skip', parseInt)
    .option(
      '--filter <json>',
      'Filter query as JSON (e.g., \'{"status":{"$eq":"active"}}\')'
    )
    .option(
      '--sort <json>',
      'Sort specification as JSON (e.g., \'[{"attribute":"created_at","direction":"desc"}]\')'
    )
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (listSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);

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
                '\nExample: --filter \'{"status":{"$eq":"active"}}\''
              );
              process.exit(1);
            }
          } catch (error) {
            console.error('Error: Invalid JSON in --filter option');
            console.error('Example: --filter \'{"status":{"$eq":"active"}}\'');
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
            console.error(
              'Example: --sort \'[{"attribute":"created_at","direction":"desc"}]\''
            );
            process.exit(1);
          }
        }

        const entries = await listApi.listEntries(listSlug, {
          limit: options.limit,
          offset: options.offset,
          filter: filter,
          sorts: sorts,
        });

        if (options.format === 'table') {
          const tableData = entries.map((e) => ({
            entry_id: e.id.entry_id,
            parent_record_id: e.parent_record_id,
            ...flattenAttributes(e.attribute_values),
            created_at: new Date(e.created_at).toISOString(),
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(entries));
        } else {
          console.log(formatJson(entries));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return entry;
}

function flattenAttributes(
  attrs?: Record<string, unknown>
): Record<string, string> {
  if (!attrs) return {};
  const flattened: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    flattened[key] = JSON.stringify(value);
  }
  return flattened;
}
