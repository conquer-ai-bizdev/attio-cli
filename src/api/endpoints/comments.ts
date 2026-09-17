import { AttioClient } from '../client';
import { Comment, CommentSchema } from '../types';
import { validate } from '../../utils/validation';

interface CommentBase {
  content: string;
  authorId: string;
  createdAt?: string;
}

export class CommentEndpoints {
  constructor(private client: AttioClient) {}

  async getComment(commentId: string): Promise<Comment> {
    const response = await this.client.get(`/comments/${commentId}`);
    return validate(CommentSchema, (response as { data: unknown }).data);
  }

  async createRecordComment(
    objectSlug: string,
    recordId: string,
    input: CommentBase
  ): Promise<Comment> {
    return this.create({
      format: 'plaintext',
      content: input.content,
      author: { type: 'workspace-member', id: input.authorId },
      record: { object: objectSlug, record_id: recordId },
      ...(input.createdAt ? { created_at: input.createdAt } : {}),
    });
  }

  async createReply(threadId: string, input: CommentBase): Promise<Comment> {
    return this.create({
      format: 'plaintext',
      content: input.content,
      author: { type: 'workspace-member', id: input.authorId },
      thread_id: threadId,
      ...(input.createdAt ? { created_at: input.createdAt } : {}),
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.client.delete(`/comments/${commentId}`);
  }

  private async create(data: Record<string, unknown>): Promise<Comment> {
    const response = await this.client.post('/comments', { data });
    return validate(CommentSchema, (response as { data: unknown }).data);
  }
}
