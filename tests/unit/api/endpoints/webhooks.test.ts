import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { WebhookEndpoints } from '../../../../src/api/endpoints/webhooks';

describe('WebhookEndpoints', () => {
  let client: AttioClient;
  let webhooks: WebhookEndpoints;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    } as unknown as AttioClient;
    webhooks = new WebhookEndpoints(client);
  });

  it('creates one subscription for each unique event type', async () => {
    vi.mocked(client.post).mockResolvedValue({
      data: { id: { webhook_id: 'webhook-id' } },
    });

    await webhooks.create('https://example.com/attio/webhooks', [
      'call-recording.created',
      'call-recording.created',
    ]);

    expect(client.post).toHaveBeenCalledWith('/webhooks', {
      data: {
        target_url: 'https://example.com/attio/webhooks',
        subscriptions: [{ event_type: 'call-recording.created' }],
      },
    });
  });

  it('requires an HTTPS target', async () => {
    await expect(
      webhooks.create('http://example.com', ['call-recording.created'])
    ).rejects.toThrow('HTTPS');
    expect(client.post).not.toHaveBeenCalled();
  });
});
