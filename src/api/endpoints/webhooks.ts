import { AttioClient } from '../client';

export class WebhookEndpoints {
  constructor(private client: AttioClient) {}

  async list(): Promise<unknown> {
    return this.client.get('/webhooks');
  }

  async create(targetUrl: string, eventTypes: string[]): Promise<unknown> {
    if (!targetUrl.startsWith('https://')) {
      throw new Error('Webhook target URL must use HTTPS.');
    }
    if (eventTypes.length === 0) {
      throw new Error('Provide at least one webhook event type.');
    }
    return this.client.post('/webhooks', {
      data: {
        target_url: targetUrl,
        subscriptions: [...new Set(eventTypes)].map((eventType) => ({
          event_type: eventType,
          filter: null,
        })),
      },
    });
  }

  async delete(webhookId: string): Promise<void> {
    await this.client.delete(`/webhooks/${webhookId}`);
  }
}
