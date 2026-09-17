import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { CommentEndpoints } from '../api/endpoints/comments';
import { Comment } from '../api/types';
import { formatJson } from '../formatters/json';
import { formatGenericTable } from '../formatters/table';
import { formatCsv } from '../formatters/csv';

export function createCommentCommand(): Command {
  const comment = new Command('comment').description(
    'Create, get, and delete comments (Attio REST does not expose comment listing)'
  );

  comment
    .command('get')
    .argument('<comment-id>', 'Comment ID')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (commentId: string, options) => {
      try {
        const result = await new CommentEndpoints(
          new AttioClient(options.apiKey)
        ).getComment(commentId);
        printComment(result, options.format);
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('create-record')
    .argument('<object>', 'Parent object slug or ID')
    .argument('<record-id>', 'Parent record ID')
    .requiredOption('--content <content>', 'Plaintext comment content')
    .requiredOption('--author-id <id>', 'Workspace member author ID')
    .option('--created-at <timestamp>', 'Optional backdated creation time')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const result = await new CommentEndpoints(
          new AttioClient(options.apiKey)
        ).createRecordComment(objectSlug, recordId, {
          content: options.content,
          authorId: options.authorId,
          createdAt: options.createdAt,
        });
        printComment(result, options.format);
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('reply')
    .argument('<thread-id>', 'Top-level comment thread ID')
    .requiredOption('--content <content>', 'Plaintext reply content')
    .requiredOption('--author-id <id>', 'Workspace member author ID')
    .option('--created-at <timestamp>', 'Optional backdated creation time')
    .option('--format <format>', 'Output format (json|table|csv)', 'json')
    .action(async (threadId: string, options) => {
      try {
        const result = await new CommentEndpoints(
          new AttioClient(options.apiKey)
        ).createReply(threadId, {
          content: options.content,
          authorId: options.authorId,
          createdAt: options.createdAt,
        });
        printComment(result, options.format);
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('delete')
    .argument('<comment-id>', 'Comment ID')
    .action(async (commentId: string, options) => {
      try {
        await new CommentEndpoints(
          new AttioClient(options.apiKey)
        ).deleteComment(commentId);
        console.log(formatJson({ deleted: true, comment_id: commentId }));
      } catch (error) {
        fail(error);
      }
    });

  return comment;
}

function printComment(comment: Comment, format: string): void {
  if (format === 'table') {
    console.log(
      formatGenericTable([
        {
          comment_id: comment.id.comment_id,
          thread_id: comment.thread_id,
          content: comment.content_plaintext,
          author_type: comment.author.type,
          author_id: comment.author.id,
          created_at: comment.created_at,
        },
      ])
    );
  } else if (format === 'csv') {
    console.log(formatCsv(comment));
  } else {
    console.log(formatJson(comment));
  }
}

function fail(error: unknown): never {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
