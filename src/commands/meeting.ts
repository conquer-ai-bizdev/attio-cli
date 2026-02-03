import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { MeetingEndpoints } from '../api/endpoints/meetings';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createMeetingCommand(): Command {
  const meeting = new Command('meeting').description('View meetings (read-only)');

  // List meetings
  meeting
    .command('list')
    .description('List meetings')
    .option('--limit <number>', 'Maximum meetings to return', parseInt)
    .option('--offset <number>', 'Number of meetings to skip', parseInt)
    .option('--sort <sort>', 'Sort order (start_asc or start_desc)')
    .option('--linked-object <slug>', 'Filter by linked object (e.g., people)')
    .option('--linked-record-id <id>', 'Filter by linked record ID')
    .option('--organizer <email-or-id>', 'Filter by organizer')
    .option('--attendee <email-or-id>', 'Filter by attendee')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const meetingApi = new MeetingEndpoints(client);

        const meetings = await meetingApi.listMeetings({
          limit: options.limit,
          offset: options.offset,
          sort: options.sort,
          linked_object: options.linkedObject,
          linked_record_id: options.linkedRecordId,
          organizer: options.organizer,
          attendee: options.attendee,
        });

        if (options.format === 'table') {
          const tableData = meetings.map((m) => ({
            meeting_id: m.id.meeting_id,
            title: m.title.substring(0, 50),
            start_at: m.start_at ? new Date(m.start_at).toISOString() : 'N/A',
            end_at: m.end_at ? new Date(m.end_at).toISOString() : 'N/A',
            created_at: new Date(m.created_at).toISOString(),
          }));
          console.log(formatGenericTable(tableData));
        } else if (options.format === 'csv') {
          console.log(formatCsv(meetings));
        } else {
          console.log(formatJson(meetings));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  // Get meeting
  meeting
    .command('get')
    .description('Get a specific meeting')
    .argument('<meeting-id>', 'Meeting ID')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (meetingId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const meetingApi = new MeetingEndpoints(client);

        const m = await meetingApi.getMeeting(meetingId);

        if (options.format === 'table') {
          console.log(
            formatGenericTable([
              {
                meeting_id: m.id.meeting_id,
                title: m.title,
                start_at: m.start_at ? new Date(m.start_at).toISOString() : 'N/A',
                end_at: m.end_at ? new Date(m.end_at).toISOString() : 'N/A',
                created_at: new Date(m.created_at).toISOString(),
              },
            ])
          );
        } else if (options.format === 'csv') {
          console.log(formatCsv(m));
        } else {
          console.log(formatJson(m));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return meeting;
}
