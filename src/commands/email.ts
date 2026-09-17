import { Command } from 'commander';
import { callAttio } from '../api/connected-service';
import { formatJson } from '../formatters/json';
import { requirePageLimit } from '../utils/page-limit';
import { attioExclusiveLowerBound } from '../utils/time-window';

type EmailPage = {
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
    .action(async (options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }
        requirePageLimit(options.limit, 50, 'Email');
        if (options.domain && options.participant?.length) {
          throw new Error('Use either --domain or --participant, not both.');
        }
        const request = emailSearchArgs(options);
        const result = options.all
          ? await listAllEmails(request)
          : await callAttio('search-emails-by-metadata', request);
        printCollection(result);
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
): Promise<EmailPage> {
  const emails: unknown[] = [];
  let cursor: string | undefined;
  do {
    const page = (await callAttio(
      'search-emails-by-metadata',
      compact({ limit: 50, ...request, cursor })
    )) as EmailPage;
    emails.push(...(Array.isArray(page.emails) ? page.emails : []));
    cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
  } while (cursor);
  return { emails, has_more: false, next_cursor: null };
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
