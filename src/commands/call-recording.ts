import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { CallRecordingEndpoints } from '../api/endpoints/call-recordings';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createCallRecordingCommand(): Command {
  const recording = new Command('call-recording').description(
    'Read call recordings and source transcripts'
  );

  recording
    .command('list')
    .description('List call recordings attached to a meeting')
    .argument('<meeting-id>', 'Meeting ID')
    .option('--limit <number>', 'Page size, maximum 200', parseInt)
    .option('--cursor <cursor>', 'Fetch one page from this cursor')
    .option('--all', 'Follow cursors until Attio returns no next cursor')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (meetingId: string, options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }
        const api = new CallRecordingEndpoints(new AttioClient(options.apiKey));
        const result = options.all
          ? await api.listAllCallRecordings(meetingId, { limit: options.limit })
          : await api.listCallRecordingsPage(meetingId, {
              limit: options.limit,
              cursor: options.cursor,
            });

        if (options.format === 'table') {
          console.log(
            formatGenericTable(
              result.data.map((item) => ({
                call_recording_id: item.id.call_recording_id,
                meeting_id: item.id.meeting_id,
                status: item.status,
                created_at: item.created_at,
                web_url: item.web_url,
              }))
            )
          );
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

  recording
    .command('get')
    .description('Get one recording, including its complete transcript')
    .argument('<meeting-id>', 'Meeting ID')
    .argument('<call-recording-id>', 'Call recording ID')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (meetingId: string, callRecordingId: string, options) => {
      try {
        const api = new CallRecordingEndpoints(new AttioClient(options.apiKey));
        const result = await api.getCallRecording(meetingId, callRecordingId);

        if (options.format === 'table') {
          console.log(
            formatGenericTable([
              {
                call_recording_id: result.id.call_recording_id,
                meeting_id: result.id.meeting_id,
                status: result.status,
                transcript_available: result.transcript !== null,
                transcript_segments: result.transcript?.segments.length ?? 0,
                web_url: result.web_url,
              },
            ])
          );
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

  return recording;
}
