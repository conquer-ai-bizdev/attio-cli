"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhookCommand = createWebhookCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const webhooks_1 = require("../api/endpoints/webhooks");
const json_1 = require("../formatters/json");
function createWebhookCommand() {
    const webhook = new commander_1.Command('webhook').description('Manage webhook subscriptions');
    webhook
        .command('list')
        .description('List webhooks')
        .action(async (options) => {
        try {
            console.log((0, json_1.formatJson)(await api(options.apiKey).list()));
        }
        catch (error) {
            fail(error);
        }
    });
    webhook
        .command('create')
        .description('Create a webhook subscription')
        .argument('<target-url>', 'HTTPS delivery URL')
        .argument('<event-types...>', 'Event types to subscribe to')
        .action(async (targetUrl, eventTypes, options) => {
        try {
            console.log((0, json_1.formatJson)(await api(options.apiKey).create(targetUrl, eventTypes)));
        }
        catch (error) {
            fail(error);
        }
    });
    webhook
        .command('delete')
        .description('Delete a webhook')
        .argument('<webhook-id>', 'Webhook ID')
        .action(async (webhookId, options) => {
        try {
            await api(options.apiKey).delete(webhookId);
            console.log((0, json_1.formatJson)({ deleted: true, webhook_id: webhookId }));
        }
        catch (error) {
            fail(error);
        }
    });
    return webhook;
}
function api(apiKey) {
    return new webhooks_1.WebhookEndpoints(new client_1.AttioClient(apiKey));
}
function fail(error) {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    throw error;
}
//# sourceMappingURL=webhook.js.map