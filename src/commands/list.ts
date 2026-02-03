import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { ListEndpoints } from '../api/endpoints/lists';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createListCommand(): Command {
  const list = new Command('list').description('Manage lists');

  // List all lists
  list
    .command('list-all')
    .description('List all lists in workspace')
    .option('--limit <number>', 'Maximum lists to return', parseInt)
    .option('--offset <number>', 'Number of lists to skip', parseInt)
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);
        const lists = await listApi.listLists({
          limit: options.limit,
          offset: options.offset,
        });

        if (options.format === 'table') {
          const tableData = lists.map((l) => ({
            slug: l.api_slug,
            name: l.name,
            parent_object: Array.isArray(l.parent_object)
              ? l.parent_object.join(', ')
              : l.parent_object,
            entry_count: l.entry_count || 0,
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(lists));
        } else {
          console.log(formatJson(lists));
        }
      } catch (error) {
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
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (listSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);
        const listData = await listApi.getList(listSlug);

        if (options.format === 'table') {
          console.log(
            formatGenericTable([
              {
                slug: listData.api_slug,
                name: listData.name,
                parent_object: Array.isArray(listData.parent_object)
                  ? listData.parent_object.join(', ')
                  : listData.parent_object,
                entry_count: listData.entry_count || 0,
              },
            ])
          );
        } else if (options.format === 'csv') {
          console.log(formatCsv(listData));
        } else {
          console.log(formatJson(listData));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return list;
}
