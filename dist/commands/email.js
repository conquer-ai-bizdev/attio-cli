"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailCommand = createEmailCommand;
const commander_1 = require("commander");
const connected_service_1 = require("../api/connected-service");
const json_1 = require("../formatters/json");
const page_limit_1 = require("../utils/page-limit");
const time_window_1 = require("../utils/time-window");
function createEmailCommand() {
    const email = new commander_1.Command('email').description('Find emails and read their content');
    email
        .command('list')
        .description('List email metadata')
        .option('--participant <addresses...>', 'External participant addresses')
        .option('--domain <domain>', 'External participant domain')
        .option('--from <timestamp>', 'Inclusive interval start')
        .option('--before <timestamp>', 'Exclusive interval end')
        .option('--exclude-automated-participants', 'Exclude emails without an external human participant')
        .option('--limit <number>', 'Page size, maximum 50', parseInt)
        .option('--cursor <cursor>', 'Continue from this cursor')
        .option('--all', 'Fetch every page')
        .action(async (options) => {
        try {
            if (options.all && options.cursor) {
                throw new Error('Cannot combine --all with --cursor.');
            }
            (0, page_limit_1.requirePageLimit)(options.limit, 50, 'Email');
            if (options.domain && options.participant?.length) {
                throw new Error('Use either --domain or --participant, not both.');
            }
            const request = emailSearchArgs(options);
            const result = options.all
                ? await listAllEmails(request)
                : await (0, connected_service_1.callAttio)('search-emails-by-metadata', request);
            printCollection(normalizeEmailPage(result));
        }
        catch (error) {
            fail(error);
        }
    });
    email
        .command('get')
        .description('Get one email, including its body')
        .argument('<mailbox-id>', 'Mailbox ID')
        .argument('<email-id>', 'Email ID')
        .action(async (mailboxId, emailId) => {
        try {
            const content = await (0, connected_service_1.callAttio)('get-email-content', {
                mailbox_id: mailboxId,
                email_id: emailId,
            });
            console.log((0, json_1.formatJson)({
                mailbox_id: mailboxId,
                email_id: emailId,
                content,
            }));
        }
        catch (error) {
            fail(error);
        }
    });
    email
        .command('search')
        .description('Search email content by meaning')
        .argument('<query>', 'Search query')
        .option('--include-others', 'Include other workspace members’ emails')
        .option('--exclude-automated-participants', 'Exclude emails without an external human participant')
        .action(async (query, options) => {
        try {
            console.log((0, json_1.formatJson)(await (0, connected_service_1.callAttio)('semantic-search-emails', {
                query,
                include_emails_of_others: Boolean(options.includeOthers),
                exclude_automated_participants: Boolean(options.excludeAutomatedParticipants),
            })));
        }
        catch (error) {
            fail(error);
        }
    });
    return email;
}
function emailSearchArgs(options) {
    return compact({
        participant_email_addresses: options.participant,
        domain: options.domain,
        sent_at_gt: typeof options.from === 'string'
            ? (0, time_window_1.attioExclusiveLowerBound)(options.from)
            : undefined,
        sent_at_lt: options.before,
        exclude_automated_participants: options.excludeAutomatedParticipants || undefined,
        limit: options.limit,
        cursor: options.cursor,
    });
}
async function listAllEmails(request) {
    const emails = [];
    let cursor;
    do {
        const page = (await (0, connected_service_1.callAttio)('search-emails-by-metadata', compact({ limit: 50, ...request, cursor })));
        emails.push(...(Array.isArray(page.emails) ? page.emails : []));
        cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
    } while (cursor);
    return { emails, has_more: false, next_cursor: null };
}
function normalizeEmailPage(result) {
    if (!result || typeof result !== 'object')
        return result;
    const page = result;
    if (!Array.isArray(page.emails))
        return result;
    return {
        ...page,
        emails: page.emails.map(normalizeEmailMetadata),
    };
}
function normalizeEmailMetadata(value) {
    if (!value || typeof value !== 'object')
        return value;
    const email = value;
    const { subject_line, sender, recipients, ...rest } = email;
    return {
        ...rest,
        subject: email.subject ?? subject_line ?? null,
        from: email.from ?? sender ?? null,
        to: email.to ?? recipients ?? [],
    };
}
function printCollection(result) {
    console.log((0, json_1.formatJson)(result));
}
function compact(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
function fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
}
//# sourceMappingURL=email.js.map