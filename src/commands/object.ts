import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { ObjectEndpoints } from '../api/endpoints/objects';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createObjectCommand(): Command {
  const object = new Command('object').description(
    'Manage objects and attributes'
  );

  // List objects
  object
    .command('list')
    .description('List all objects in the workspace')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const objectApi = new ObjectEndpoints(client);

        const objects = await objectApi.listObjects();

        if (options.format === 'table') {
          const tableData = objects.map((obj) => ({
            slug: obj.api_slug,
            singular: obj.singular_noun,
            plural: obj.plural_noun,
            built_in: obj.is_built_in,
            workspace_level: obj.is_workspace_level,
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(objects));
        } else {
          console.log(formatJson(objects));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Get object
  object
    .command('get')
    .description('Get a specific object')
    .argument('<slug>', 'Object slug (e.g., people, companies, deals)')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (slug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const objectApi = new ObjectEndpoints(client);

        const obj = await objectApi.getObject(slug);

        if (options.format === 'table') {
          const tableData = [
            {
              slug: obj.api_slug,
              singular: obj.singular_noun,
              plural: obj.plural_noun,
              built_in: obj.is_built_in,
              workspace_level: obj.is_workspace_level,
            },
          ];
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(obj));
        } else {
          console.log(formatJson(obj));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // List attributes
  object
    .command('attributes')
    .description('List attributes for an object')
    .argument('<object-slug>', 'Object slug (e.g., people, companies)')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const objectApi = new ObjectEndpoints(client);

        const attributes = await objectApi.listAttributes(objectSlug);

        if (options.format === 'table') {
          const tableData = attributes.map((attr) => ({
            slug: attr.api_slug,
            title: attr.title,
            type: attr.type,
            required: attr.is_required,
            unique: attr.is_unique,
            system: attr.is_system_attribute,
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(attributes));
        } else {
          console.log(formatJson(attributes));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return object;
}
