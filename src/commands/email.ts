import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { EmailEndpoints, ListEmailsOptions } from '../api/endpoints/emails';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createEmailCommand(): Command {
  const email = new Command('email').description(
    'Read Attio email metadata (the public REST API does not return bodies)'
  );

  email
    .command('list')
    .description('List email metadata using at least one supported filter')
    .option('--linked-object <slug>', 'people or companies')
    .option(
      '--linked-record-id <ids...>',
      'Up to 10 record IDs belonging to --linked-object'
    )
    .option('--participant <addresses...>', 'Up to 10 email addresses')
    .option('--domain <domain>', 'Participant domain')
    .option('--sent-after <timestamp>', 'Exclusive lower sent-time bound')
    .option('--sent-before <timestamp>', 'Exclusive upper sent-time bound')
    .option(
      '--exclude-automated-participants',
      'Require at least one external human-looking participant'
    )
    .option('--limit <number>', 'Page size, maximum 50', parseInt)
    .option('--cursor <cursor>', 'Fetch one page from this cursor')
    .option('--all', 'Follow cursors until Attio returns no next cursor')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }

        const client = new AttioClient(options.apiKey);
        const emailApi = new EmailEndpoints(client);
        const request: ListEmailsOptions = {
          limit: options.limit,
          cursor: options.cursor,
          linkedObject: options.linkedObject,
          linkedRecordIds: options.linkedRecordId,
          participants: options.participant,
          domain: options.domain,
          sentAfter: options.sentAfter,
          sentBefore: options.sentBefore,
          excludeAutomatedParticipants:
            options.excludeAutomatedParticipants || undefined,
        };
        const result = options.all
          ? await emailApi.listAllEmails(request)
          : await emailApi.listEmailsPage(request);

        if (options.format === 'table') {
          const emails = 'pagination' in result ? result.data : result.data;
          console.log(
            formatGenericTable(
              emails.map((item) => ({
                email_id: item.id.email_id,
                mailbox_id: item.id.mailbox_id,
                sent_at: item.sent_at,
                direction: item.direction,
                subject: item.subject_line ?? '',
                participants: item.participants
                  .map(
                    (participant) =>
                      `${participant.role}:${participant.email_address}`
                  )
                  .join(', '),
                linked_records: item.linked_records
                  .map((record) => `${record.object_slug}:${record.record_id}`)
                  .join(', '),
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

  return email;
}
