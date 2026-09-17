import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { AttributeEndpoints } from '../api/endpoints/attributes';
import { formatJson } from '../formatters/json';

function isValidSnakeCase(str: string): boolean {
  // Valid snake_case: lowercase letters, numbers, and underscores only
  // Must start with a letter, cannot have consecutive underscores
  return /^[a-z][a-z0-9_]*[a-z0-9]$|^[a-z]$/.test(str) && !str.includes('__');
}

export function createAttributeCommand(): Command {
  const attribute = new Command('attribute').description(
    'Manage attributes for objects and lists'
  );

  // List attributes
  attribute
    .command('list')
    .description('List attributes for an object or list')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .option('--show-archived', 'Include archived attributes')
    .action(async (target: string, identifier: string, options) => {
      try {
        if (target !== 'objects' && target !== 'lists') {
          console.error('Error: target must be either "objects" or "lists"');
          process.exit(1);
        }

        const client = new AttioClient(options.apiKey);
        const attributeApi = new AttributeEndpoints(client);

        const attributes = await attributeApi.listAttributes(
          target as 'objects' | 'lists',
          identifier,
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

  // Get single attribute
  attribute
    .command('get')
    .description('Get a specific attribute')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const attr = await attributeApi.getAttribute(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug
          );

          console.log(formatJson(attr));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Create attribute
  attribute
    .command('create')
    .description('Create a new attribute')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .requiredOption('--title <title>', 'Attribute title')
    .requiredOption('--slug <slug>', 'API slug (snake_case)')
    .requiredOption(
      '--type <type>',
      'Attribute type (text, number, select, status, etc.)'
    )
    .option('--description <description>', 'Attribute description')
    .option('--required', 'Mark as required')
    .option('--unique', 'Mark as unique')
    .option('--multiselect', 'Enable multiselect (for select type)')
    .action(async (target: string, identifier: string, options) => {
      try {
        if (target !== 'objects' && target !== 'lists') {
          console.error('Error: target must be either "objects" or "lists"');
          process.exit(1);
        }

        if (!isValidSnakeCase(options.slug)) {
          console.error('Error: slug must be in snake_case format');
          console.error(
            '  Valid format: lowercase letters, numbers, and underscores only'
          );
          console.error('  Must start with a letter');
          console.error('  Examples: email_address, deal_status, company_size');
          console.error(`  Invalid: ${options.slug}`);
          process.exit(1);
        }

        const client = new AttioClient(options.apiKey);
        const attributeApi = new AttributeEndpoints(client);

        const data = {
          data: {
            title: options.title,
            api_slug: options.slug,
            type: options.type,
            description: options.description || '',
            is_required: options.required || false,
            is_unique: options.unique || false,
            is_multiselect: options.multiselect || false,
            config: {},
          },
        };

        const attr = await attributeApi.createAttribute(
          target as 'objects' | 'lists',
          identifier,
          data
        );

        console.log(formatJson(attr));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Update attribute
  attribute
    .command('update')
    .description('Update an attribute')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .option('--title <title>', 'New title')
    .option('--description <description>', 'New description')
    .option('--required <value>', 'Set required (true|false)', (val) =>
      val === 'true' ? true : val === 'false' ? false : undefined
    )
    .option('--unique <value>', 'Set unique (true|false)', (val) =>
      val === 'true' ? true : val === 'false' ? false : undefined
    )
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const data: { data: Record<string, unknown> } = { data: {} };

          if (options.title) data.data.title = options.title;
          if (options.description) data.data.description = options.description;
          if (options.required !== undefined)
            data.data.is_required = options.required;
          if (options.unique !== undefined)
            data.data.is_unique = options.unique;

          if (Object.keys(data.data).length === 0) {
            console.error(
              'Error: Must provide at least one field to update (--title, --description, --required, --unique)'
            );
            process.exit(1);
          }

          const attr = await attributeApi.updateAttribute(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            data
          );

          console.log(formatJson(attr));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Archive attribute (Note: Attio API does not support deleting attributes)
  attribute
    .command('archive')
    .description(
      'Archive an attribute (Note: attributes cannot be deleted, only archived via update)'
    )
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .action(
      async (target: string, identifier: string, attributeSlug: string) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          console.log(
            'Note: The Attio API does not support deleting attributes.'
          );
          console.log('Attributes can be archived by updating them.');
          console.log(
            `To archive, update the attribute "${attributeSlug}" with archived status.`
          );
          console.log(
            `Example: attio attribute update ${target} ${identifier} ${attributeSlug} --description "Archived"`
          );

          process.exit(1);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // List select options
  attribute
    .command('options')
    .description('List select options for an attribute')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .option('--show-archived', 'Include archived options')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const selectOptions = await attributeApi.listSelectOptions(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            { show_archived: options.showArchived }
          );

          console.log(formatJson(selectOptions));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Create select option
  attribute
    .command('option-create')
    .description('Create a select option')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .requiredOption('--title <title>', 'Option title')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const option = await attributeApi.createSelectOption(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            { data: { title: options.title } }
          );

          console.log(formatJson(option));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Update select option
  attribute
    .command('option-update')
    .description('Update a select option')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .argument('<option-id>', 'Option ID')
    .option('--title <title>', 'New title')
    .option('--archived <value>', 'Set archived (true|false)', (val) =>
      val === 'true' ? true : val === 'false' ? false : undefined
    )
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        optionId: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const data: { data: Record<string, unknown> } = { data: {} };

          if (options.title) data.data.title = options.title;
          if (options.archived !== undefined)
            data.data.is_archived = options.archived;

          if (Object.keys(data.data).length === 0) {
            console.error(
              'Error: Must provide at least one field to update (--title, --archived)'
            );
            process.exit(1);
          }

          const option = await attributeApi.updateSelectOption(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            optionId,
            data
          );

          console.log(formatJson(option));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Archive select option (Note: API may not support deleting options)
  attribute
    .command('option-archive')
    .description('Archive a select option (recommended over delete)')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .argument('<option-id>', 'Option ID')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        optionId: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const archivedOption = await attributeApi.updateSelectOption(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            optionId,
            {
              data: {
                is_archived: true,
              },
            }
          );

          console.log(formatJson(archivedOption));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // List statuses
  attribute
    .command('statuses')
    .description('List statuses for an attribute')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .option('--show-archived', 'Include archived statuses')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const statuses = await attributeApi.listStatuses(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            { show_archived: options.showArchived }
          );

          console.log(formatJson(statuses));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Create status
  attribute
    .command('status-create')
    .description('Create a status')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .requiredOption('--title <title>', 'Status title')
    .option('--celebration', 'Enable celebration')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const data = {
            data: {
              title: options.title,
              ...(options.celebration && { celebration_enabled: true }),
            },
          };

          const status = await attributeApi.createStatus(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            data
          );

          console.log(formatJson(status));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Update status
  attribute
    .command('status-update')
    .description('Update a status')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .argument('<status-id>', 'Status ID')
    .option('--title <title>', 'New title')
    .option('--celebration <value>', 'Set celebration (true|false)', (val) =>
      val === 'true' ? true : val === 'false' ? false : undefined
    )
    .option('--archived <value>', 'Set archived (true|false)', (val) =>
      val === 'true' ? true : val === 'false' ? false : undefined
    )
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        statusId: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const data: { data: Record<string, unknown> } = { data: {} };

          if (options.title) data.data.title = options.title;
          if (options.celebration !== undefined)
            data.data.celebration_enabled = options.celebration;
          if (options.archived !== undefined)
            data.data.is_archived = options.archived;

          if (Object.keys(data.data).length === 0) {
            console.error(
              'Error: Must provide at least one field to update (--title, --celebration, --archived)'
            );
            process.exit(1);
          }

          const status = await attributeApi.updateStatus(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            statusId,
            data
          );

          console.log(formatJson(status));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  // Archive status (Note: API may not support deleting statuses)
  attribute
    .command('status-archive')
    .description('Archive a status (recommended over delete)')
    .argument('<target>', 'Target type (objects or lists)')
    .argument('<identifier>', 'Object/list slug or ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .argument('<status-id>', 'Status ID')
    .action(
      async (
        target: string,
        identifier: string,
        attributeSlug: string,
        statusId: string,
        options
      ) => {
        try {
          if (target !== 'objects' && target !== 'lists') {
            console.error('Error: target must be either "objects" or "lists"');
            process.exit(1);
          }

          const client = new AttioClient(options.apiKey);
          const attributeApi = new AttributeEndpoints(client);

          const archivedStatus = await attributeApi.updateStatus(
            target as 'objects' | 'lists',
            identifier,
            attributeSlug,
            statusId,
            {
              data: {
                is_archived: true,
              },
            }
          );

          console.log(formatJson(archivedStatus));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  return attribute;
}
