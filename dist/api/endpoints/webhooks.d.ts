import { AttioClient } from '../client';
export declare class WebhookEndpoints {
    private client;
    constructor(client: AttioClient);
    list(): Promise<unknown>;
    create(targetUrl: string, eventTypes: string[]): Promise<unknown>;
    delete(webhookId: string): Promise<void>;
}
//# sourceMappingURL=webhooks.d.ts.map