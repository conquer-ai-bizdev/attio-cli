import { AttioClient } from '../client';
import { Comment } from '../types';
interface CommentBase {
    content: string;
    authorId: string;
    createdAt?: string;
}
export declare class CommentEndpoints {
    private client;
    constructor(client: AttioClient);
    getComment(commentId: string): Promise<Comment>;
    createRecordComment(objectSlug: string, recordId: string, input: CommentBase): Promise<Comment>;
    createReply(threadId: string, input: CommentBase): Promise<Comment>;
    deleteComment(commentId: string): Promise<void>;
    private create;
}
export {};
//# sourceMappingURL=comments.d.ts.map