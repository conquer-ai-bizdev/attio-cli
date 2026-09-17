import { Command } from 'commander';
import { AttioClient } from '../api/client';
import {
  MeetingEndpoints,
  ListMeetingsOptions,
} from '../api/endpoints/meetings';
import { formatJson } from '../formatters/json';
import { callAttio } from '../api/connected-service';
import { requirePageLimit } from '../utils/page-limit';
import { attioExclusiveLowerBound } from '../utils/time-window';

export function createMeetingCommand(): Command {
  const meeting = new Command('meeting').description(
    'Find and inspect meetings'
  );

  meeting
    .command('search')
    .description('Search meetings within a time range')
    .requiredOption('--from <timestamp>', 'Inclusive interval start')
    .requiredOption('--before <timestamp>', 'Exclusive interval end')
    .option('--timezone <timezone>', 'Timezone for all-day meetings', 'UTC')
    .option('--participant <addresses...>', 'Participant email addresses')
    .option(
      '--participant-mode <mode>',
      'Participant match mode (AND|OR)',
      'OR'
    )
    .option('--related-object <slug-or-id>', 'Related record object')
    .option('--related-record-id <ids...>', 'Related record IDs')
    .option(
      '--related-mode <mode>',
      'Related record match mode (AND|OR)',
      'AND'
    )
    .option('--limit <number>', 'Maximum meetings to return', parseInt)
    .option('--offset <number>', 'Number of meetings to skip', parseInt)
    .option('--all', 'Fetch every page')
    .action(async (options) => {
      try {
        if (options.all && options.offset !== undefined) {
          throw new Error('Cannot combine --all with --offset.');
        }
        requirePageLimit(options.limit, 50, 'Meeting');
        const args = compact({
          starts_after: attioExclusiveLowerBound(options.from),
          starts_before: options.before,
          timezone: options.timezone,
          participant_email_addresses: options.participant,
          participant_email_addresses_operator: options.participant?.length
            ? options.participantMode
            : undefined,
          related_record_object: options.relatedObject,
          related_record_ids: options.relatedRecordId,
          related_records_operator: options.relatedRecordId?.length
            ? options.relatedMode
            : undefined,
          limit: options.limit,
          offset: options.offset,
        });
        console.log(
          formatJson(
            options.all
              ? await searchAllMeetings(args, options.limit ?? 50)
              : await callAttio('search-meetings', args)
          )
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  meeting
    .command('list')
    .description(
      'List one page of meetings or traverse the complete result set'
    )
    .option('--limit <number>', 'Page size, maximum 50', parseInt)
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
    .action(async (options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }
        requirePageLimit(options.limit, 50, 'Meeting');

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

        console.log(formatJson(result));
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
    .action(async (meetingId: string, options) => {
      try {
        const client = new AttioClient(options.apiKey);
        const meetingApi = new MeetingEndpoints(client);
        const result = await meetingApi.getMeeting(meetingId);

        console.log(formatJson(result));
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

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  );
}

type MeetingSearchPage = {
  past_meetings?: unknown[];
  future_meetings?: unknown[];
  has_more?: boolean;
};

async function searchAllMeetings(
  args: Record<string, unknown>,
  pageSize: number
): Promise<MeetingSearchPage> {
  const past: unknown[] = [];
  const future: unknown[] = [];
  let offset = 0;
  let hasMore = true;
  const seen = new Set<string>();
  while (hasMore) {
    const page = (await callAttio('search-meetings', {
      ...args,
      limit: pageSize,
      offset,
    })) as MeetingSearchPage;
    const pagePast = Array.isArray(page.past_meetings)
      ? page.past_meetings
      : [];
    const pageFuture = Array.isArray(page.future_meetings)
      ? page.future_meetings
      : [];
    const returned = pagePast.length + pageFuture.length;
    for (const item of pagePast) {
      const id = meetingSearchId(item);
      if (!id || !seen.has(id)) past.push(item);
      if (id) seen.add(id);
    }
    for (const item of pageFuture) {
      const id = meetingSearchId(item);
      if (!id || !seen.has(id)) future.push(item);
      if (id) seen.add(id);
    }
    hasMore = page.has_more === true && returned > 0;
    offset += returned;
    if (offset > 100_000)
      throw new Error('Meeting pagination exceeded 100,000 rows.');
  }
  return { past_meetings: past, future_meetings: future, has_more: false };
}

function meetingSearchId(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return undefined;
  const row = value as Record<string, unknown>;
  return typeof row.meeting_id === 'string'
    ? row.meeting_id
    : typeof row.id === 'object' &&
        row.id !== null &&
        typeof (row.id as Record<string, unknown>).meeting_id === 'string'
      ? ((row.id as Record<string, unknown>).meeting_id as string)
      : undefined;
}
