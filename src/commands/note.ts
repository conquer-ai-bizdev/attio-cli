import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { NoteEndpoints } from '../api/endpoints/notes';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createNoteCommand(): Command {
  const note = new Command('note').description('Manage notes');

  // List notes
  note
    .command('list')
    .description('List notes')
    .option('--limit <number>', 'Maximum notes to return', parseInt)
    .option('--offset <number>', 'Number of notes to skip', parseInt)
    .option('--parent-object <slug>', 'Filter by parent object (e.g., people)')
    .option('--parent-record-id <id>', 'Filter by parent record ID')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const noteApi = new NoteEndpoints(client);

        const notes = await noteApi.listNotes({
          limit: options.limit,
          offset: options.offset,
          parent_object: options.parentObject,
          parent_record_id: options.parentRecordId,
        });

        if (options.format === 'table') {
          const tableData = notes.map((n) => ({
            note_id: n.id.note_id,
            title: n.title,
            parent_object: n.parent_object,
            format: n.format,
            created_at: new Date(n.created_at).toISOString(),
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(notes));
        } else {
          console.log(formatJson(notes));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Get note
  note
    .command('get')
    .description('Get a specific note')
    .argument('<note-id>', 'Note ID')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (noteId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const noteApi = new NoteEndpoints(client);

        const n = await noteApi.getNote(noteId);

        if (options.format === 'table') {
          console.log(
            formatGenericTable([
              {
                note_id: n.id.note_id,
                title: n.title,
                parent_object: n.parent_object,
                format: n.format,
                created_at: new Date(n.created_at).toISOString(),
              },
            ])
          );
        } else if (options.format === 'csv') {
          console.log(formatCsv(n));
        } else {
          console.log(formatJson(n));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Create note
  note
    .command('create')
    .description('Create a new note')
    .requiredOption('--parent-object <slug>', 'Parent object slug')
    .requiredOption('--parent-record-id <id>', 'Parent record ID')
    .requiredOption('--title <title>', 'Note title')
    .requiredOption('--content <content>', 'Note content')
    .option('--format <format>', 'Content format (plaintext|markdown)', 'plaintext')
    .option('--meeting-id <id>', 'Associated meeting ID')
    .option('--output <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const noteApi = new NoteEndpoints(client);

        const data = {
          data: {
            parent_object: options.parentObject,
            parent_record_id: options.parentRecordId,
            title: options.title,
            format: options.format as 'plaintext' | 'markdown',
            content: options.content,
            meeting_id: options.meetingId || null,
          },
        };

        const n = await noteApi.createNote(data);

        if (options.output === 'table') {
          console.log(
            formatGenericTable([
              {
                note_id: n.id.note_id,
                title: n.title,
                parent_object: n.parent_object,
                format: n.format,
                created_at: new Date(n.created_at).toISOString(),
              },
            ])
          );
        } else if (options.output === 'csv') {
          console.log(formatCsv(n));
        } else {
          console.log(formatJson(n));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Update note
  note
    .command('update')
    .description('Update an existing note')
    .argument('<note-id>', 'Note ID')
    .option('--title <title>', 'Updated title')
    .option('--content <content>', 'Updated content')
    .option('--format <format>', 'Content format (plaintext|markdown)')
    .option('--output <format>', 'Output format (json|table|csv)', 'json')
    .action(async (noteId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const noteApi = new NoteEndpoints(client);

        const data: { data: { title?: string; content?: string; format?: 'plaintext' | 'markdown' } } = {
          data: {},
        };

        if (options.title) data.data.title = options.title;
        if (options.content) data.data.content = options.content;
        if (options.format) data.data.format = options.format;

        const n = await noteApi.updateNote(noteId, data);

        if (options.output === 'table') {
          console.log(
            formatGenericTable([
              {
                note_id: n.id.note_id,
                title: n.title,
                parent_object: n.parent_object,
                format: n.format,
                created_at: new Date(n.created_at).toISOString(),
              },
            ])
          );
        } else if (options.output === 'csv') {
          console.log(formatCsv(n));
        } else {
          console.log(formatJson(n));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Delete note
  note
    .command('delete')
    .description('Delete a note')
    .argument('<note-id>', 'Note ID')
    .action(async (noteId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const noteApi = new NoteEndpoints(client);

        await noteApi.deleteNote(noteId);
        console.log(`Note ${noteId} deleted successfully`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return note;
}
