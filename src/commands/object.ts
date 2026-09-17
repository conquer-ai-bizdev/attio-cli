import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { ObjectEndpoints } from '../api/endpoints/objects';
import { AttributeEndpoints } from '../api/endpoints/attributes';
import { formatJson } from '../formatters/json';

export function createObjectCommand(): Command {
  const object = new Command('object').description(
    'Manage objects and attributes'
  );

  // List objects
  object
    .command('list')
    .description('List all objects in the workspace')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const objectApi = new ObjectEndpoints(client);

        const objects = await objectApi.listObjects();

        console.log(formatJson(objects));
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
    .action(async (slug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const objectApi = new ObjectEndpoints(client);

        const obj = await objectApi.getObject(slug);

        console.log(formatJson(obj));
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
    .action(async (objectSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const objectApi = new ObjectEndpoints(client);

        const attributes = await objectApi.listAttributes(objectSlug);

        console.log(formatJson(attributes));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // List attributes with values (convenience command)
  object
    .command('attributes-with-values')
    .description(
      'List attributes for an object with their possible values (select options/statuses)'
    )
    .argument('<object-slug>', 'Object slug (e.g., people, companies)')
    .option('--show-archived', 'Include archived attributes and options')
    .action(async (objectSlug: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const attributeApi = new AttributeEndpoints(client);

        const attributes = await attributeApi.listAttributesWithValues(
          'objects',
          objectSlug,
          { show_archived: options.showArchived }
        );

        console.log(formatJson(attributes));
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
