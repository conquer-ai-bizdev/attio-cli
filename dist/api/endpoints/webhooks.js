"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEndpoints = void 0;
class WebhookEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async list() {
        return this.client.get('/webhooks');
    }
    async create(targetUrl, eventTypes) {
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
                })),
            },
        });
    }
    async delete(webhookId) {
        await this.client.delete(`/webhooks/${webhookId}`);
    }
}
exports.WebhookEndpoints = WebhookEndpoints;
//# sourceMappingURL=webhooks.js.map