"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentCommand = createCommentCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const comments_1 = require("../api/endpoints/comments");
const json_1 = require("../formatters/json");
const connected_service_1 = require("../api/connected-service");
const page_limit_1 = require("../utils/page-limit");
const stdin_1 = require("../utils/stdin");
function createCommentCommand() {
    const comment = new commander_1.Command('comment').description('Manage comments');
    comment
        .command('list-record')
        .description('List comments on a record')
        .argument('<object>', 'Parent object slug or ID')
        .argument('<record-id>', 'Parent record ID')
        .option('--limit <number>', 'Maximum comments to return', parseInt)
        .option('--offset <number>', 'Number of comments to skip', parseInt)
        .option('--all', 'Return every comment')
        .action(async (objectSlug, recordId, options) => {
        try {
            const args = compact({
                parent_object: objectSlug,
                parent_record_id: recordId,
                limit: (0, page_limit_1.requirePageLimit)(options.limit, 20, 'Comment'),
                offset: options.offset,
            });
            console.log((0, json_1.formatJson)(options.all
                ? await listEveryComment('list-comments', args, 'comments', 'has_more_comments')
                : await (0, connected_service_1.callAttio)('list-comments', args)));
        }
        catch (error) {
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
        .action(async (list, entryId, options) => {
        try {
            const args = compact({
                parent_list: list,
                parent_entry_id: entryId,
                limit: (0, page_limit_1.requirePageLimit)(options.limit, 20, 'Comment'),
                offset: options.offset,
            });
            console.log((0, json_1.formatJson)(options.all
                ? await listEveryComment('list-comments', args, 'comments', 'has_more_comments')
                : await (0, connected_service_1.callAttio)('list-comments', args)));
        }
        catch (error) {
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
        .action(async (commentId, options) => {
        try {
            const args = compact({
                comment_id: commentId,
                limit: (0, page_limit_1.requirePageLimit)(options.limit, 20, 'Comment reply'),
                offset: options.offset,
            });
            console.log((0, json_1.formatJson)(options.all
                ? await listEveryComment('list-comment-replies', args, 'replies', 'has_more')
                : await (0, connected_service_1.callAttio)('list-comment-replies', args)));
        }
        catch (error) {
            fail(error);
        }
    });
    comment
        .command('get')
        .argument('<comment-id>', 'Comment ID')
        .action(async (commentId, options) => {
        try {
            const result = await new comments_1.CommentEndpoints(new client_1.AttioClient(options.apiKey)).getComment(commentId);
            printComment(result);
        }
        catch (error) {
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
        .action(async (objectSlug, recordId, contentArg, options) => {
        try {
            const content = await (0, stdin_1.readInput)(contentArg, 'Comment text');
            if (options.at && !options.author) {
                throw new Error('--at requires --author.');
            }
            if (options.author) {
                const result = await new comments_1.CommentEndpoints(new client_1.AttioClient(options.apiKey)).createRecordComment(objectSlug, recordId, {
                    content,
                    authorId: options.author,
                    createdAt: options.at,
                });
                printComment(result);
            }
            else {
                printResult(await (0, connected_service_1.callAttio)('create-comment', {
                    parent_object: objectSlug,
                    parent_record_id: recordId,
                    content,
                }));
            }
        }
        catch (error) {
            fail(error);
        }
    });
    comment
        .command('create-entry')
        .description('Create a comment on a list entry')
        .argument('<list>', 'Parent list slug or ID')
        .argument('<entry-id>', 'Parent entry ID')
        .argument('[content]', 'Comment text; defaults to stdin')
        .action(async (list, entryId, contentArg) => {
        try {
            const content = await (0, stdin_1.readInput)(contentArg, 'Comment text');
            printResult(await (0, connected_service_1.callAttio)('create-comment', {
                parent_list: list,
                parent_entry_id: entryId,
                content,
            }));
        }
        catch (error) {
            fail(error);
        }
    });
    comment
        .command('reply')
        .description('Reply to a comment thread')
        .argument('<thread-id>', 'Top-level comment thread ID')
        .argument('[content]', 'Reply text; defaults to stdin')
        .option('--author <id>', 'Workspace member author ID')
        .option('--at <timestamp>', 'Backdated creation time')
        .action(async (threadId, contentArg, options) => {
        try {
            const content = await (0, stdin_1.readInput)(contentArg, 'Reply text');
            if (options.at && !options.author) {
                throw new Error('--at requires --author.');
            }
            if (options.author) {
                const result = await new comments_1.CommentEndpoints(new client_1.AttioClient(options.apiKey)).createReply(threadId, {
                    content,
                    authorId: options.author,
                    createdAt: options.at,
                });
                printComment(result);
            }
            else {
                printResult(await (0, connected_service_1.callAttio)('create-comment', {
                    parent_comment_id: threadId,
                    content,
                }));
            }
        }
        catch (error) {
            fail(error);
        }
    });
    comment
        .command('delete')
        .argument('<comment-id>', 'Comment ID')
        .action(async (commentId, options) => {
        try {
            await new comments_1.CommentEndpoints(new client_1.AttioClient(options.apiKey)).deleteComment(commentId);
            console.log((0, json_1.formatJson)({ deleted: true, comment_id: commentId }));
        }
        catch (error) {
            fail(error);
        }
    });
    return comment;
}
function printComment(comment) {
    console.log((0, json_1.formatJson)(comment));
}
function printResult(result) {
    console.log((0, json_1.formatJson)(result));
}
function fail(error) {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    throw error;
}
function compact(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
async function listEveryComment(operation, args, collectionKey, hasMoreKey) {
    if (args.offset !== undefined) {
        throw new Error('Cannot combine --all with --offset.');
    }
    const items = [];
    let offset = 0;
    while (true) {
        const page = (await (0, connected_service_1.callAttio)(operation, {
            ...args,
            limit: args.limit ?? 20,
            offset,
        }));
        const returned = Array.isArray(page[collectionKey])
            ? page[collectionKey]
            : [];
        items.push(...returned);
        if (page[hasMoreKey] !== true || returned.length === 0)
            break;
        offset += returned.length;
    }
    return { [collectionKey]: items, [hasMoreKey]: false };
}
//# sourceMappingURL=comment.js.map