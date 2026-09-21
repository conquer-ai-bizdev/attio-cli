"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailCommand = createEmailCommand;
const commander_1 = require("commander");
const node_crypto_1 = require("node:crypto");
const client_1 = require("../api/client");
const connected_service_1 = require("../api/connected-service");
const records_1 = require("../api/endpoints/records");
const json_1 = require("../formatters/json");
const page_limit_1 = require("../utils/page-limit");
const time_window_1 = require("../utils/time-window");
function createEmailCommand() {
    const email = new commander_1.Command('email').description('Find emails and read their content');
    email
        .command('list')
        .description('List email metadata')
        .option('--company <record-id>', "Emails matching this Company's domains")
        .option('--participant <addresses...>', 'External participant addresses')
        .option('--domain <domain>', 'External participant domain')
        .option('--from <timestamp>', 'Inclusive interval start')
        .option('--before <timestamp>', 'Exclusive interval end')
        .option('--exclude-automated-participants', 'Exclude emails without an external human participant')
        .option('--limit <number>', 'Page size, maximum 50', parseInt)
        .option('--cursor <cursor>', 'Continue from this cursor')
        .option('--all', 'Fetch every page')
        .option('--full-body', 'Include the complete body of every returned email')
        .action(async (options) => {
        try {
            if (options.all && options.cursor) {
                throw new Error('Cannot combine --all with --cursor.');
            }
            (0, page_limit_1.requirePageLimit)(options.limit, 50, 'Email');
            if (options.company &&
                (options.domain || options.participant?.length)) {
                throw new Error('Use --company by itself, without --domain or --participant.');
            }
            if (options.domain && options.participant?.length) {
                throw new Error('Use either --domain or --participant, not both.');
            }
            if (options.company) {
                if (options.cursor) {
                    throw new Error('Company email lists are complete by default and do not accept --cursor.');
                }
                const domains = await getCompanyDomains(String(options.company));
                const pages = [];
                for (const domain of domains) {
                    const request = emailSearchArgs({ ...options, domain });
                    pages.push(await listAllEmails(request));
                }
                printCollection(await finalizeEmailPage(combineEmailPages(pages), options.fullBody));
                return;
            }
            const request = emailSearchArgs(options);
            const result = options.all
                ? await listAllEmails(request)
                : await (0, connected_service_1.callAttio)('search-emails-by-metadata', request);
            printCollection(await finalizeEmailPage(result, options.fullBody));
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
    const emails = new Map();
    let cursor;
    do {
        const page = (await (0, connected_service_1.callAttio)('search-emails-by-metadata', compact({ limit: 50, ...request, cursor })));
        for (const email of Array.isArray(page.emails) ? page.emails : []) {
            emails.set(emailIdentity(email), email);
        }
        cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
    } while (cursor);
    return { emails: [...emails.values()], has_more: false, next_cursor: null };
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
async function getCompanyDomains(companyId) {
    const company = await new records_1.RecordEndpoints(new client_1.AttioClient()).getRecord('companies', companyId);
    const values = Array.isArray(company.values.domains)
        ? company.values.domains
        : [];
    const domains = new Set();
    for (const value of values) {
        if (!value || typeof value !== 'object')
            continue;
        const item = value;
        const domain = [item.root_domain, item.domain, item.value].find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0);
        if (domain)
            domains.add(domain.trim().toLowerCase());
    }
    if (domains.size === 0) {
        throw new Error(`Company ${companyId} has no domain, so its emails cannot be selected reliably.`);
    }
    return [...domains];
}
function combineEmailPages(pages) {
    const emails = new Map();
    let hasMore = false;
    let nextCursor = null;
    for (const value of pages) {
        if (!value || typeof value !== 'object')
            continue;
        const page = value;
        for (const email of Array.isArray(page.emails) ? page.emails : []) {
            emails.set(emailIdentity(email), email);
        }
        hasMore ||= page.has_more === true;
        nextCursor ??= page.next_cursor ?? null;
    }
    return {
        emails: [...emails.values()],
        has_more: hasMore,
        next_cursor: nextCursor,
    };
}
async function finalizeEmailPage(result, includeContent) {
    const normalized = normalizeEmailPage(result);
    if (!normalized || typeof normalized !== 'object')
        return normalized;
    const page = normalized;
    if (!Array.isArray(page.emails))
        return normalized;
    let emails = deduplicateExactEmails(page.emails);
    if (includeContent) {
        emails = await includeEmailContent(emails);
        emails = deduplicateLogicalEmails(emails);
    }
    emails.sort(compareEmailsNewestFirst);
    return { ...page, emails };
}
function deduplicateExactEmails(emails) {
    return [
        ...new Map(emails.map((email) => [emailIdentity(email), email])).values(),
    ];
}
async function includeEmailContent(emails) {
    const expanded = [];
    const concurrency = 6;
    for (let offset = 0; offset < emails.length; offset += concurrency) {
        const batch = emails.slice(offset, offset + concurrency);
        expanded.push(...(await Promise.all(batch.map(async (value) => {
            if (!value || typeof value !== 'object')
                return value;
            const email = value;
            const mailboxId = String(email.mailbox_id ?? '');
            const emailId = String(email.email_id ?? '');
            if (!mailboxId || !emailId) {
                throw new Error('Attio returned an email without mailbox_id and email_id.');
            }
            const content = await (0, connected_service_1.callAttio)('get-email-content', {
                mailbox_id: mailboxId,
                email_id: emailId,
            });
            return { ...email, content };
        }))));
    }
    return expanded;
}
function deduplicateLogicalEmails(emails) {
    const unique = new Map();
    for (const email of emails) {
        unique.set(emailFingerprint(email), email);
    }
    return [...unique.values()];
}
function emailIdentity(value) {
    if (!value || typeof value !== 'object')
        return JSON.stringify(value);
    const email = value;
    return `${String(email.mailbox_id ?? '')}:${String(email.email_id ?? '')}`;
}
function emailFingerprint(value) {
    if (!value || typeof value !== 'object')
        return emailIdentity(value);
    const email = value;
    const participants = [email.from, email.to, email.cc, email.bcc]
        .flatMap((item) => (Array.isArray(item) ? item : [item]))
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim().toLowerCase())
        .sort();
    const evidence = JSON.stringify({
        sent_at: email.sent_at ?? null,
        subject: typeof email.subject === 'string'
            ? email.subject.trim().toLowerCase()
            : null,
        participants,
        content: email.content ?? null,
    });
    return (0, node_crypto_1.createHash)('sha256').update(evidence).digest('hex');
}
function compareEmailsNewestFirst(left, right) {
    const leftEmail = (left ?? {});
    const rightEmail = (right ?? {});
    const byDate = String(rightEmail.sent_at ?? '').localeCompare(String(leftEmail.sent_at ?? ''));
    return byDate || emailIdentity(left).localeCompare(emailIdentity(right));
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