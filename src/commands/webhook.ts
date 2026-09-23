import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { WebhookEndpoints } from '../api/endpoints/webhooks';
import { formatJson } from '../formatters/json';

export function createWebhookCommand(): Command {
  const webhook = new Command('webhook').description(
    'Manage webhook subscriptions'
  );

  webhook
    .command('list')
    .description('List webhooks')
    .action(async (options) => {
      try {
        console.log(formatJson(await api(options.apiKey).list()));
      } catch (error) {
        fail(error);
      }
    });

  webhook
    .command('create')
    .description('Create a webhook subscription')
    .argument('<target-url>', 'HTTPS delivery URL')
    .argument('<event-types...>', 'Event types to subscribe to')
    .action(async (targetUrl: string, eventTypes: string[], options) => {
      try {
        console.log(
          formatJson(await api(options.apiKey).create(targetUrl, eventTypes))
        );
      } catch (error) {
        fail(error);
      }
    });

  webhook
    .command('delete')
    .description('Delete a webhook')
    .argument('<webhook-id>', 'Webhook ID')
    .action(async (webhookId: string, options) => {
      try {
        await api(options.apiKey).delete(webhookId);
        console.log(formatJson({ deleted: true, webhook_id: webhookId }));
      } catch (error) {
        fail(error);
      }
    });

  return webhook;
}

function api(apiKey?: string): WebhookEndpoints {
  return new WebhookEndpoints(new AttioClient(apiKey));
}

function fail(error: unknown): never {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
