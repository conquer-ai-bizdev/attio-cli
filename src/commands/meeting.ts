import { Command } from 'commander';
import { AttioClient } from '../api/client';
import {
  MeetingEndpoints,
  ListMeetingsOptions,
} from '../api/endpoints/meetings';
import { Meeting } from '../api/types';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createMeetingCommand(): Command {
  const meeting = new Command('meeting').description(
    'View meetings (read-only)'
  );

  meeting
    .command('list')
    .description(
      'List one page of meetings or traverse the complete result set'
    )
    .option('--limit <number>', 'Page size, maximum 200', parseInt)
    .option('--cursor <cursor>', 'Fetch one page from this cursor')
    .option('--all', 'Follow cursors until Attio returns no next cursor')
    .option('--sort <sort>', 'Sort order (start_asc or start_desc)')
    .option('--linked-object <slug>', 'Filter by linked object')
    .option('--linked-record-id <id>', 'Filter by linked record ID')
    .option(
      '--participant <emails...>',
      'Filter by participant email addresses'
    )
    .option(
      '--ends-from <timestamp>',
      'Include meetings ending at or after this time'
    )
    .option(
      '--starts-before <timestamp>',
      'Include meetings starting before this time'
    )
    .option(
      '--timezone <timezone>',
      'Timezone for all-day interval filtering',
      'UTC'
    )
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }

        const client = new AttioClient(options.apiKey);
        const meetingApi = new MeetingEndpoints(client);
        const request: ListMeetingsOptions = {
          limit: options.limit,
          cursor: options.cursor,
          sort: options.sort,
          linkedObject: options.linkedObject,
          linkedRecordId: options.linkedRecordId,
          participants: options.participant,
          endsFrom: options.endsFrom,
          startsBefore: options.startsBefore,
          timezone: options.timezone,
        };
        const result = options.all
          ? await meetingApi.listAllMeetings(request)
          : await meetingApi.listMeetingsPage(request);

        if (options.format === 'table') {
          console.log(formatGenericTable(result.data.map(meetingRow)));
        } else if (options.format === 'csv') {
          console.log(formatCsv(result.data));
        } else {
          console.log(formatJson(result));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  meeting
    .command('get')
    .description('Get a specific meeting')
    .argument('<meeting-id>', 'Meeting ID')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (meetingId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const meetingApi = new MeetingEndpoints(client);
        const result = await meetingApi.getMeeting(meetingId);

        if (options.format === 'table') {
          console.log(formatGenericTable([meetingRow(result)]));
        } else if (options.format === 'csv') {
          console.log(formatCsv(result));
        } else {
          console.log(formatJson(result));
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

function meetingRow(meeting: Meeting): Record<string, unknown> {
  return {
    meeting_id: meeting.id.meeting_id,
    title: meeting.title,
    start: meetingTime(meeting.start),
    end: meetingTime(meeting.end),
    participants: meeting.participants
      .map((participant) => participant.email_address ?? participant.name ?? '')
      .filter(Boolean)
      .join(', '),
    linked_records: meeting.linked_records
      .map((record) => `${record.object_slug}:${record.record_id}`)
      .join(', '),
  };
}

function meetingTime(value: Meeting['start']): string {
  if ('datetime' in value && typeof value.datetime === 'string') {
    return value.datetime;
  }
  if ('date' in value && typeof value.date === 'string') {
    return value.date;
  }
  return '';
}
