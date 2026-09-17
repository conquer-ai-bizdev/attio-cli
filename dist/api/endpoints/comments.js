"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class CommentEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async getComment(commentId) {
        const response = await this.client.get(`/comments/${commentId}`);
        return (0, validation_1.validate)(types_1.CommentSchema, response.data);
    }
    async createRecordComment(objectSlug, recordId, input) {
        return this.create({
            format: 'plaintext',
            content: input.content,
            author: { type: 'workspace-member', id: input.authorId },
            record: { object: objectSlug, record_id: recordId },
            ...(input.createdAt ? { created_at: input.createdAt } : {}),
        });
    }
    async createReply(threadId, input) {
        return this.create({
            format: 'plaintext',
            content: input.content,
            author: { type: 'workspace-member', id: input.authorId },
            thread_id: threadId,
            ...(input.createdAt ? { created_at: input.createdAt } : {}),
        });
    }
    async deleteComment(commentId) {
        await this.client.delete(`/comments/${commentId}`);
    }
    async create(data) {
        const response = await this.client.post('/comments', { data });
        return (0, validation_1.validate)(types_1.CommentSchema, response.data);
    }
}
exports.CommentEndpoints = CommentEndpoints;
//# sourceMappingURL=comments.js.map