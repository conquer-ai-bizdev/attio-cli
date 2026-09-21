import { Command } from 'commander';
import { createHash } from 'node:crypto';
import { AttioClient } from '../api/client';
import { callAttio } from '../api/connected-service';
import { RecordEndpoints } from '../api/endpoints/records';
import { formatJson } from '../formatters/json';
import { requirePageLimit } from '../utils/page-limit';
import { attioExclusiveLowerBound } from '../utils/time-window';

type McpEmailPage = {
  emails?: unknown[];
  has_more?: boolean;
  next_cursor?: string | null;
};

export function createEmailCommand(): Command {
  const email = new Command('email').description(
    'Find emails and read their content'
  );

  email
    .command('list')
    .description('List email metadata')
    .option(
      '--company <record-id>',
      "Emails matching this Company's domains and linked people"
    )
    .option('--participant <addresses...>', 'External participant addresses')
    .option('--domain <domain>', 'External participant domain')
    .option('--from <timestamp>', 'Inclusive interval start')
    .option('--before <timestamp>', 'Exclusive interval end')
    .option(
      '--exclude-automated-participants',
      'Exclude emails without an external human participant'
    )
    .option('--limit <number>', 'Page size, maximum 50', parseInt)
    .option('--cursor <cursor>', 'Continue from this cursor')
    .option('--all', 'Fetch every page')
    .option('--full-body', 'Include the complete body of every returned email')
    .action(async (options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }
        requirePageLimit(options.limit, 50, 'Email');
        if (
          options.company &&
          (options.domain || options.participant?.length)
        ) {
          throw new Error(
            'Use --company by itself, without --domain or --participant.'
          );
        }
        if (options.domain && options.participant?.length) {
          throw new Error('Use either --domain or --participant, not both.');
        }

        if (options.company) {
          if (options.cursor) {
            throw new Error(
              'Company email lists are complete by default and do not accept --cursor.'
            );
          }
          const sources = await getCompanyEmailSources(String(options.company));

          const pages = [];
          for (const domain of sources.domains) {
            const request = emailSearchArgs({ ...options, domain });
            pages.push(await listAllEmails(request));
          }
          for (
            let offset = 0;
            offset < sources.participants.length;
            offset += 10
          ) {
            const participant = sources.participants.slice(offset, offset + 10);
            const request = emailSearchArgs({ ...options, participant });
            pages.push(await listAllEmails(request));
          }
          printCollection(
            await finalizeEmailPage(combineEmailPages(pages), options.fullBody)
          );
          return;
        }

        const request = emailSearchArgs(options);
        const result = options.all
          ? await listAllEmails(request)
          : await callAttio('search-emails-by-metadata', request);
        printCollection(await finalizeEmailPage(result, options.fullBody));
      } catch (error) {
        fail(error);
      }
    });

  email
    .command('get')
    .description('Get one email, including its body')
    .argument('<mailbox-id>', 'Mailbox ID')
    .argument('<email-id>', 'Email ID')
    .action(async (mailboxId: string, emailId: string) => {
      try {
        const content = await callAttio('get-email-content', {
          mailbox_id: mailboxId,
          email_id: emailId,
        });
        console.log(
          formatJson({
            mailbox_id: mailboxId,
            email_id: emailId,
            content,
          })
        );
      } catch (error) {
        fail(error);
      }
    });

  email
    .command('search')
    .description('Search email content by meaning')
    .argument('<query>', 'Search query')
    .option('--include-others', 'Include other workspace members’ emails')
    .option(
      '--exclude-automated-participants',
      'Exclude emails without an external human participant'
    )
    .action(async (query: string, options) => {
      try {
        console.log(
          formatJson(
            await callAttio('semantic-search-emails', {
              query,
              include_emails_of_others: Boolean(options.includeOthers),
              exclude_automated_participants: Boolean(
                options.excludeAutomatedParticipants
              ),
            })
          )
        );
      } catch (error) {
        fail(error);
      }
    });

  return email;
}

function emailSearchArgs(
  options: Record<string, unknown>
): Record<string, unknown> {
  return compact({
    participant_email_addresses: options.participant,
    domain: options.domain,
    sent_at_gt:
      typeof options.from === 'string'
        ? attioExclusiveLowerBound(options.from)
        : undefined,
    sent_at_lt: options.before,
    exclude_automated_participants:
      options.excludeAutomatedParticipants || undefined,
    limit: options.limit,
    cursor: options.cursor,
  });
}

async function listAllEmails(
  request: Record<string, unknown>
): Promise<McpEmailPage> {
  const emails = new Map<string, unknown>();
  let cursor: string | undefined;
  do {
    const page = (await callAttio(
      'search-emails-by-metadata',
      compact({ limit: 50, ...request, cursor })
    )) as McpEmailPage;
    for (const email of Array.isArray(page.emails) ? page.emails : []) {
      emails.set(emailIdentity(email), email);
    }
    cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
  } while (cursor);
  return { emails: [...emails.values()], has_more: false, next_cursor: null };
}

function normalizeEmailPage(result: unknown): unknown {
  if (!result || typeof result !== 'object') return result;
  const page = result as McpEmailPage & Record<string, unknown>;
  if (!Array.isArray(page.emails)) return result;

  return {
    ...page,
    emails: page.emails.map(normalizeEmailMetadata),
  };
}

function normalizeEmailMetadata(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const email = value as Record<string, unknown>;
  const { subject_line, sender, recipients, ...rest } = email;
  delete rest.snippet;

  return {
    ...rest,
    subject: email.subject ?? subject_line ?? null,
    from: email.from ?? sender ?? null,
    to: email.to ?? recipients ?? [],
  };
}

async function getCompanyEmailSources(companyId: string): Promise<{
  domains: string[];
  participants: string[];
}> {
  const records = new RecordEndpoints(new AttioClient());
  const company = await records.getRecord('companies', companyId);
  const values = Array.isArray(company.values.domains)
    ? company.values.domains
    : [];
  const domains = new Set<string>();

  for (const value of values) {
    if (!value || typeof value !== 'object') continue;
    const item = value as Record<string, unknown>;
    const domain = [item.root_domain, item.domain, item.value].find(
      (candidate): candidate is string =>
        typeof candidate === 'string' && candidate.trim().length > 0
    );
    if (domain) domains.add(domain.trim().toLowerCase());
  }

  const teamValues = Array.isArray(company.values.team)
    ? company.values.team
    : [];
  const teamIds = teamValues.flatMap((value) => {
    if (!value || typeof value !== 'object') return [];
    const id = (value as Record<string, unknown>).target_record_id;
    return typeof id === 'string' ? [id] : [];
  });
  const people = await records.getRecordsByIds('people', teamIds);
  const participants = new Set<string>();

  for (const person of people) {
    const emailValues = Array.isArray(person.values.email_addresses)
      ? person.values.email_addresses
      : [];
    for (const value of emailValues) {
      if (!value || typeof value !== 'object') continue;
      const item = value as Record<string, unknown>;
      const address = [item.email_address, item.value].find(
        (candidate): candidate is string =>
          typeof candidate === 'string' && candidate.includes('@')
      );
      if (!address) continue;
      const normalized = address.trim().toLowerCase();
      const domain = normalized.split('@')[1];
      if (!domains.has(domain)) participants.add(normalized);
    }
  }

  if (domains.size === 0 && participants.size === 0) {
    throw new Error(
      `Company ${companyId} has no domains or linked-person email addresses.`
    );
  }
  return { domains: [...domains], participants: [...participants] };
}

function combineEmailPages(pages: unknown[]): McpEmailPage {
  const emails = new Map<string, unknown>();
  let hasMore = false;
  let nextCursor: string | null = null;

  for (const value of pages) {
    if (!value || typeof value !== 'object') continue;
    const page = value as McpEmailPage;
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

async function finalizeEmailPage(
  result: unknown,
  includeContent: boolean
): Promise<unknown> {
  const normalized = normalizeEmailPage(result);
  if (!normalized || typeof normalized !== 'object') return normalized;
  const page = normalized as McpEmailPage & Record<string, unknown>;
  if (!Array.isArray(page.emails)) return normalized;

  let emails = deduplicateExactEmails(page.emails);
  if (includeContent) {
    emails = await includeEmailContent(emails);
    emails = deduplicateLogicalEmails(emails);
  }
  emails.sort(compareEmailsNewestFirst);

  return { ...page, emails };
}

function deduplicateExactEmails(emails: unknown[]): unknown[] {
  return [
    ...new Map(emails.map((email) => [emailIdentity(email), email])).values(),
  ];
}

async function includeEmailContent(emails: unknown[]): Promise<unknown[]> {
  const expanded: unknown[] = [];
  const concurrency = 6;

  for (let offset = 0; offset < emails.length; offset += concurrency) {
    const batch = emails.slice(offset, offset + concurrency);
    expanded.push(
      ...(await Promise.all(
        batch.map(async (value) => {
          if (!value || typeof value !== 'object') return value;
          const email = value as Record<string, unknown>;
          const mailboxId = String(email.mailbox_id ?? '');
          const emailId = String(email.email_id ?? '');
          if (!mailboxId || !emailId) {
            throw new Error(
              'Attio returned an email without mailbox_id and email_id.'
            );
          }
          const content = await callAttio('get-email-content', {
            mailbox_id: mailboxId,
            email_id: emailId,
          });
          return { ...email, content };
        })
      ))
    );
  }

  return expanded;
}

function deduplicateLogicalEmails(emails: unknown[]): unknown[] {
  const unique = new Map<string, unknown>();
  for (const email of emails) {
    unique.set(emailFingerprint(email), email);
  }
  return [...unique.values()];
}

function emailIdentity(value: unknown): string {
  if (!value || typeof value !== 'object') return JSON.stringify(value);
  const email = value as Record<string, unknown>;
  return `${String(email.mailbox_id ?? '')}:${String(email.email_id ?? '')}`;
}

function emailFingerprint(value: unknown): string {
  if (!value || typeof value !== 'object') return emailIdentity(value);
  const email = value as Record<string, unknown>;
  const participants = [email.from, email.to, email.cc, email.bcc]
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .sort();
  const evidence = JSON.stringify({
    sent_at: email.sent_at ?? null,
    subject:
      typeof email.subject === 'string'
        ? email.subject.trim().toLowerCase()
        : null,
    participants,
    content: email.content ?? null,
  });
  return createHash('sha256').update(evidence).digest('hex');
}

function compareEmailsNewestFirst(left: unknown, right: unknown): number {
  const leftEmail = (left ?? {}) as Record<string, unknown>;
  const rightEmail = (right ?? {}) as Record<string, unknown>;
  const byDate = String(rightEmail.sent_at ?? '').localeCompare(
    String(leftEmail.sent_at ?? '')
  );
  return byDate || emailIdentity(left).localeCompare(emailIdentity(right));
}

function printCollection(result: unknown): void {
  console.log(formatJson(result));
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
