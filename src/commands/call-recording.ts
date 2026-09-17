import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { CallRecordingEndpoints } from '../api/endpoints/call-recordings';
import { formatJson } from '../formatters/json';
import { callAttio } from '../api/connected-service';
import { requirePageLimit } from '../utils/page-limit';
import { attioExclusiveLowerBound } from '../utils/time-window';

export function createCallRecordingCommand(): Command {
  const recording = new Command('call-recording').description(
    'Find call recordings and read their transcripts'
  );

  recording
    .command('search')
    .description('Search call recordings by metadata')
    .option('--workspace-member-id <ids...>', 'Workspace member speaker IDs')
    .option('--person-record-id <ids...>', 'Person speaker record IDs')
    .option('--related-object <slug-or-id>', 'Related record object')
    .option('--related-record-id <ids...>', 'Related record IDs')
    .option('--meeting-title <query>', 'Meeting title query')
    .option('--from <timestamp>', 'Inclusive interval start')
    .option('--before <timestamp>', 'Exclusive interval end')
    .option('--limit <number>', 'Maximum recordings to return', parseInt)
    .option('--offset <number>', 'Number of recordings to skip', parseInt)
    .option('--all', 'Fetch every page')
    .action(async (options) => {
      try {
        if (options.all && options.offset !== undefined) {
          throw new Error('Cannot combine --all with --offset.');
        }
        requirePageLimit(options.limit, 50, 'Call recording');
        const args = compact({
          speaker_workspace_member_ids: options.workspaceMemberId,
          speaker_person_record_ids: options.personRecordId,
          related_record_object: options.relatedObject,
          related_record_ids: options.relatedRecordId,
          meeting_title_query: options.meetingTitle,
          starts_after:
            typeof options.from === 'string'
              ? attioExclusiveLowerBound(options.from)
              : undefined,
          starts_before: options.before,
          limit: options.limit,
          offset: options.offset,
        });
        console.log(
          formatJson(
            options.all
              ? await searchAllRecordings(args, options.limit ?? 50)
              : await callAttio('search-call-recordings-by-metadata', args)
          )
        );
      } catch (error) {
        fail(error);
      }
    });

  recording
    .command('semantic-search')
    .description('Search transcript content by meaning')
    .argument('<query>', 'Search query')
    .action(async (query: string) => {
      try {
        console.log(
          formatJson(
            await callAttio('semantic-search-call-recordings', { query })
          )
        );
      } catch (error) {
        fail(error);
      }
    });

  recording
    .command('list')
    .description('List call recordings attached to a meeting')
    .argument('<meeting-id>', 'Meeting ID')
    .option('--limit <number>', 'Page size, maximum 50', parseInt)
    .option('--cursor <cursor>', 'Fetch one page from this cursor')
    .option('--all', 'Follow cursors until Attio returns no next cursor')
    .action(async (meetingId: string, options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }
        requirePageLimit(options.limit, 50, 'Call recording');
        const api = new CallRecordingEndpoints(new AttioClient(options.apiKey));
        const result = options.all
          ? await api.listAllCallRecordings(meetingId, { limit: options.limit })
          : await api.listCallRecordingsPage(meetingId, {
              limit: options.limit,
              cursor: options.cursor,
            });

        console.log(formatJson(result));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  recording
    .command('get')
    .description('Get one recording, including its complete transcript')
    .argument('<meeting-id>', 'Meeting ID')
    .argument('<call-recording-id>', 'Call recording ID')
    .action(async (meetingId: string, callRecordingId: string, options) => {
      try {
        const api = new CallRecordingEndpoints(new AttioClient(options.apiKey));
        const result = await api.getCallRecording(meetingId, callRecordingId);

        console.log(formatJson(result));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  return recording;
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  );
}

function fail(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}

type RecordingSearchPage = {
  results?: unknown[];
  has_more?: boolean;
};

async function searchAllRecordings(
  args: Record<string, unknown>,
  pageSize: number
): Promise<RecordingSearchPage> {
  const results: unknown[] = [];
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    const page = (await callAttio('search-call-recordings-by-metadata', {
      ...args,
      limit: pageSize,
      offset,
    })) as RecordingSearchPage;
    const returned = Array.isArray(page.results) ? page.results : [];
    results.push(...returned);
    hasMore = page.has_more === true && returned.length > 0;
    offset += returned.length;
    if (offset > 100_000) {
      throw new Error('Call recording pagination exceeded 100,000 rows.');
    }
  }
  return { results, has_more: false };
}
