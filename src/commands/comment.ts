import { Command } from 'commander';
import { AttioClient } from '../api/client';
import { CommentEndpoints } from '../api/endpoints/comments';
import { Comment } from '../api/types';
import { formatJson } from '../formatters/json';
import { callAttio } from '../api/connected-service';
import { requirePageLimit } from '../utils/page-limit';
import { readInput } from '../utils/stdin';

export function createCommentCommand(): Command {
  const comment = new Command('comment').description('Manage comments');

  comment
    .command('list-record')
    .description('List comments on a record')
    .argument('<object>', 'Parent object slug or ID')
    .argument('<record-id>', 'Parent record ID')
    .option('--limit <number>', 'Maximum comments to return', parseInt)
    .option('--offset <number>', 'Number of comments to skip', parseInt)
    .option('--all', 'Return every comment')
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        const args = compact({
          parent_object: objectSlug,
          parent_record_id: recordId,
          limit: requirePageLimit(options.limit, 20, 'Comment'),
          offset: options.offset,
        });
        console.log(
          formatJson(
            options.all
              ? await listEveryComment(
                  'list-comments',
                  args,
                  'comments',
                  'has_more_comments'
                )
              : await callAttio('list-comments', args)
          )
        );
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('list-entry')
    .description('List comments on a list entry')
    .argument('<list>', 'Parent list slug or ID')
    .argument('<entry-id>', 'Parent entry ID')
    .option('--limit <number>', 'Maximum comments to return', parseInt)
    .option('--offset <number>', 'Number of comments to skip', parseInt)
    .option('--all', 'Return every comment')
    .action(async (list: string, entryId: string, options) => {
      try {
        const args = compact({
          parent_list: list,
          parent_entry_id: entryId,
          limit: requirePageLimit(options.limit, 20, 'Comment'),
          offset: options.offset,
        });
        console.log(
          formatJson(
            options.all
              ? await listEveryComment(
                  'list-comments',
                  args,
                  'comments',
                  'has_more_comments'
                )
              : await callAttio('list-comments', args)
          )
        );
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('replies')
    .description('List replies in a comment thread')
    .argument('<comment-id>', 'Top-level comment ID')
    .option('--limit <number>', 'Maximum replies to return', parseInt)
    .option('--offset <number>', 'Number of replies to skip', parseInt)
    .option('--all', 'Return every reply')
    .action(async (commentId: string, options) => {
      try {
        const args = compact({
          comment_id: commentId,
          limit: requirePageLimit(options.limit, 20, 'Comment reply'),
          offset: options.offset,
        });
        console.log(
          formatJson(
            options.all
              ? await listEveryComment(
                  'list-comment-replies',
                  args,
                  'replies',
                  'has_more'
                )
              : await callAttio('list-comment-replies', args)
          )
        );
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('get')
    .argument('<comment-id>', 'Comment ID')
    .action(async (commentId: string, options) => {
      try {
        const result = await new CommentEndpoints(
          new AttioClient(options.apiKey)
        ).getComment(commentId);
        printComment(result);
      } catch (error) {
        fail(error);
      }
    });

  comment
    .command('create-record')
    .description('Create a comment on a record')
    .argument('<object>', 'Parent object slug or ID')
    .argument('<record-id>', 'Parent record ID')
    .argument('[content]', 'Comment text; defaults to stdin')
    .option('--author <id>', 'Workspace member author ID')
    .option('--at <timestamp>', 'Backdated creation time')
    .action(
      async (
        objectSlug: string,
        recordId: string,
        contentArg: string | undefined,
        options
      ) => {
        try {
          const content = await readInput(contentArg, 'Comment text');
          if (options.at && !options.author) {
            throw new Error('--at requires --author.');
          }
          if (options.author) {
            const result = await new CommentEndpoints(
              new AttioClient(options.apiKey)
            ).createRecordComment(objectSlug, recordId, {
              content,
              authorId: options.author,
              createdAt: options.at,
            });
            printComment(result);
          } else {
            printResult(
              await callAttio('create-comment', {
                parent_object: objectSlug,
                parent_record_id: recordId,
                content,
              })
            );
          }
        } catch (error) {
          fail(error);
        }
      }
    );

  comment
    .command('create-entry')
    .description('Create a comment on a list entry')
    .argument('<list>', 'Parent list slug or ID')
    .argument('<entry-id>', 'Parent entry ID')
    .argument('[content]', 'Comment text; defaults to stdin')
    .action(
      async (list: string, entryId: string, contentArg: string | undefined) => {
        try {
          const content = await readInput(contentArg, 'Comment text');
          printResult(
            await callAttio('create-comment', {
              parent_list: list,
              parent_entry_id: entryId,
              content,
            })
          );
        } catch (error) {
          fail(error);
        }
      }
    );

  comment
    .command('reply')
    .description('Reply to a comment thread')
    .argument('<thread-id>', 'Top-level comment thread ID')
    .argument('[content]', 'Reply text; defaults to stdin')
    .option('--author <id>', 'Workspace member author ID')
    .option('--at <timestamp>', 'Backdated creation time')
    .action(
      async (threadId: string, contentArg: string | undefined, options) => {
        try {
          const content = await readInput(contentArg, 'Reply text');
          if (options.at && !options.author) {
            throw new Error('--at requires --author.');
          }
          if (options.author) {
            const result = await new CommentEndpoints(
              new AttioClient(options.apiKey)
            ).createReply(threadId, {
              content,
              authorId: options.author,
              createdAt: options.at,
            });
            printComment(result);
          } else {
            printResult(
              await callAttio('create-comment', {
                parent_comment_id: threadId,
                content,
              })
            );
          }
        } catch (error) {
          fail(error);
        }
      }
    );

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

function printComment(comment: Comment): void {
  console.log(formatJson(comment));
}

function printResult(result: unknown): void {
  console.log(formatJson(result));
}

function fail(error: unknown): never {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  );
}

async function listEveryComment(
  operation: string,
  args: Record<string, unknown>,
  collectionKey: string,
  hasMoreKey: string
): Promise<Record<string, unknown>> {
  if (args.offset !== undefined) {
    throw new Error('Cannot combine --all with --offset.');
  }
  const items: unknown[] = [];
  let offset = 0;
  while (true) {
    const page = (await callAttio(operation, {
      ...args,
      limit: args.limit ?? 20,
      offset,
    })) as Record<string, unknown>;
    const returned = Array.isArray(page[collectionKey])
      ? (page[collectionKey] as unknown[])
      : [];
    items.push(...returned);
    if (page[hasMoreKey] !== true || returned.length === 0) break;
    offset += returned.length;
  }
  return { [collectionKey]: items, [hasMoreKey]: false };
}
