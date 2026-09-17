import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { ListEndpoints } from '../api/endpoints/lists';
import { formatJson } from '../formatters/json';
import { validateFilterStructure } from '../utils/filter-validator';
import { callAttio } from '../api/connected-service';
import { readJsonInput, requireAtMostOneStdin } from '../utils/stdin';

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
    .action(async (listSlug: string, options) => {
      try {
        requireAtMostOneStdin([
          { name: '--filter', value: options.filter },
          { name: '--sort', value: options.sort },
        ]);
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);

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

        const entries = await listApi.listEntries(listSlug, {
          limit: options.limit,
          offset: options.offset,
          filter: filter,
          sorts: sorts,
        });

        // Apply compact formatting unless verbose mode is enabled
        const displayEntries = entries;

        console.log(formatJson(displayEntries));
      } catch (error) {
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
    .action(async (listSlug: string, entryId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);
        const entryData = await listApi.getEntry(listSlug, entryId);

        // Apply compact formatting unless verbose mode is enabled
        const displayEntry = entryData;

        console.log(formatJson(displayEntry));
      } catch (error) {
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
    .action(
      async (
        listSlug: string,
        parentObject: string,
        parentRecordId: string,
        json: string | undefined,
        options
      ) => {
        try {
          const client = new AttioClient(options.apiKey);
          const listApi = new ListEndpoints(client);

          const entryValues = json
            ? await readJsonInput<Record<string, unknown>>(json, 'Entry values')
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

          console.log(formatJson(displayEntry));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  entry
    .command('update')
    .description('Update a list entry (appends to multiselect attributes)')
    .argument('<list-slug>', 'List slug or ID')
    .argument('<entry-id>', 'Entry ID')
    .argument('[json]', 'Updated entry values as JSON; defaults to stdin')
    .action(
      async (
        listSlug: string,
        entryId: string,
        json: string | undefined,
        options
      ) => {
        try {
          const client = new AttioClient(options.apiKey);
          const listApi = new ListEndpoints(client);

          const entryValues = await readJsonInput<Record<string, unknown>>(
            json,
            'Updated entry values'
          );

          const entryData = await listApi.updateEntry(listSlug, entryId, {
            data: { entry_values: entryValues },
          });

          // Apply compact formatting unless verbose mode is enabled
          const displayEntry = entryData;

          console.log(formatJson(displayEntry));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  entry
    .command('update-record')
    .description('Update the single list entry for a parent record')
    .argument('<list-slug>', 'List slug or ID')
    .argument('<parent-object>', 'Parent object slug or ID')
    .argument('<parent-record-id>', 'Parent record ID')
    .argument('[json]', 'Updated entry values as JSON; defaults to stdin')
    .option(
      '--replace',
      'Replace supplied multiselect values instead of prepending them'
    )
    .action(
      async (
        listSlug: string,
        parentObject: string,
        parentRecordId: string,
        json: string | undefined,
        options
      ) => {
        try {
          const entryValues = await readJsonInput<Record<string, unknown>>(
            json,
            'Updated entry values'
          );

          const result = await callAttio('update-list-entry-by-record-id', {
            list: listSlug,
            parent_object: parentObject,
            parent_record_id: parentRecordId,
            entry_values: entryValues,
            patch_multiselect_values: !options.replace,
          });
          printConnectedResult(result);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  entry
    .command('delete')
    .description('Delete a list entry')
    .argument('<list-slug>', 'List slug or ID')
    .argument('<entry-id>', 'Entry ID')
    .action(async (listSlug: string, entryId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);
        await listApi.deleteEntry(listSlug, entryId);
        console.log(
          formatJson({
            deleted: true,
            list: listSlug,
            entry_id: entryId,
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

  entry
    .command('assert')
    .description('Assert (upsert) a list entry - overwrites all values')
    .argument('<list-slug>', 'List slug or ID')
    .argument('[json]', 'Entry identity and values as JSON; defaults to stdin')
    .action(async (listSlug: string, json: string | undefined, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const listApi = new ListEndpoints(client);

        const data = await readJsonInput<Record<string, unknown>>(
          json,
          'Entry data'
        );

        // Validate required fields
        if (!data.entry_values) {
          console.error('Error: Entry data must include "entry_values".');
          console.error(
            'Example: {"parent_record_id":"xyz","entry_values":{"status":"active"}}'
          );
          process.exit(1);
        }

        const entryData = await listApi.assertEntry(listSlug, {
          data: data as {
            parent_record_id?: string;
            parent_object?: string;
            entry_values: Record<string, unknown>;
          },
        });

        // Apply compact formatting unless verbose mode is enabled
        const displayEntry = entryData;

        console.log(formatJson(displayEntry));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  entry
    .command('attribute-values')
    .description(
      'List attribute values for an entry (including historic values)'
    )
    .argument('<list-slug>', 'List slug or ID')
    .argument('<entry-id>', 'Entry ID')
    .argument('<attribute-slug>', 'Attribute slug')
    .option('--show-historic', 'Include historic values')
    .option('--limit <number>', 'Maximum values to return', parseInt)
    .option('--offset <number>', 'Number of values to skip', parseInt)
    .action(
      async (
        listSlug: string,
        entryId: string,
        attributeSlug: string,
        options
      ) => {
        try {
          const client = new AttioClient(options.apiKey);
          const listApi = new ListEndpoints(client);

          const values = await listApi.listEntryAttributeValues(
            listSlug,
            entryId,
            attributeSlug,
            {
              show_historic: options.showHistoric,
              limit: options.limit,
              offset: options.offset,
            }
          );

          console.log(formatJson(values));
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
          }
          throw error;
        }
      }
    );

  return entry;
}

function printConnectedResult(result: unknown): void {
  console.log(formatJson(result));
}
