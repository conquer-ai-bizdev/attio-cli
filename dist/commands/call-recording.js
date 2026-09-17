"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCallRecordingCommand = createCallRecordingCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const call_recordings_1 = require("../api/endpoints/call-recordings");
const json_1 = require("../formatters/json");
const connected_service_1 = require("../api/connected-service");
const page_limit_1 = require("../utils/page-limit");
const time_window_1 = require("../utils/time-window");
function createCallRecordingCommand() {
    const recording = new commander_1.Command('call-recording').description('Find call recordings and read their transcripts');
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
            (0, page_limit_1.requirePageLimit)(options.limit, 50, 'Call recording');
            const args = compact({
                speaker_workspace_member_ids: options.workspaceMemberId,
                speaker_person_record_ids: options.personRecordId,
                related_record_object: options.relatedObject,
                related_record_ids: options.relatedRecordId,
                meeting_title_query: options.meetingTitle,
                starts_after: typeof options.from === 'string'
                    ? (0, time_window_1.attioExclusiveLowerBound)(options.from)
                    : undefined,
                starts_before: options.before,
                limit: options.limit,
                offset: options.offset,
            });
            console.log((0, json_1.formatJson)(options.all
                ? await searchAllRecordings(args, options.limit ?? 50)
                : await (0, connected_service_1.callAttio)('search-call-recordings-by-metadata', args)));
        }
        catch (error) {
            fail(error);
        }
    });
    recording
        .command('semantic-search')
        .description('Search transcript content by meaning')
        .argument('<query>', 'Search query')
        .action(async (query) => {
        try {
            console.log((0, json_1.formatJson)(await (0, connected_service_1.callAttio)('semantic-search-call-recordings', { query })));
        }
        catch (error) {
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
        .action(async (meetingId, options) => {
        try {
            if (options.all && options.cursor) {
                throw new Error('Cannot combine --all with --cursor.');
            }
            (0, page_limit_1.requirePageLimit)(options.limit, 50, 'Call recording');
            const api = new call_recordings_1.CallRecordingEndpoints(new client_1.AttioClient(options.apiKey));
            const result = options.all
                ? await api.listAllCallRecordings(meetingId, { limit: options.limit })
                : await api.listCallRecordingsPage(meetingId, {
                    limit: options.limit,
                    cursor: options.cursor,
                });
            console.log((0, json_1.formatJson)(result));
        }
        catch (error) {
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
        .action(async (meetingId, callRecordingId, options) => {
        try {
            const api = new call_recordings_1.CallRecordingEndpoints(new client_1.AttioClient(options.apiKey));
            const result = await api.getCallRecording(meetingId, callRecordingId);
            console.log((0, json_1.formatJson)(result));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return recording;
}
function compact(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
function fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
}
async function searchAllRecordings(args, pageSize) {
    const results = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
        const page = (await (0, connected_service_1.callAttio)('search-call-recordings-by-metadata', {
            ...args,
            limit: pageSize,
            offset,
        }));
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
//# sourceMappingURL=call-recording.js.map