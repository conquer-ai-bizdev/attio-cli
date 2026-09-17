"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileCommand = createFileCommand;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const commander_1 = require("commander");
const client_1 = require("../api/client");
const files_1 = require("../api/endpoints/files");
const json_1 = require("../formatters/json");
function createFileCommand() {
    const file = new commander_1.Command('file').description('List, upload, download, and remove Attio record files');
    file
        .command('list')
        .argument('<object>', 'Record object slug or ID')
        .argument('<record-id>', 'Record ID')
        .option('--storage-provider <provider>', 'Filter by storage provider')
        .option('--parent-folder-id <id>', 'Filter by parent folder')
        .option('--limit <number>', 'Page size, maximum 200', parseInt)
        .option('--cursor <cursor>', 'Fetch one page from this cursor')
        .option('--all', 'Follow cursors until Attio returns no next cursor')
        .action(async (objectSlug, recordId, options) => {
        try {
            if (options.all && options.cursor) {
                throw new Error('Cannot combine --all with --cursor.');
            }
            const api = new files_1.FileEndpoints(new client_1.AttioClient(options.apiKey));
            const request = {
                storageProvider: options.storageProvider,
                parentFolderId: options.parentFolderId,
                limit: options.limit,
                cursor: options.cursor,
            };
            const result = options.all
                ? await api.listAllFiles(objectSlug, recordId, request)
                : await api.listFilesPage(objectSlug, recordId, request);
            printFileResult(result);
        }
        catch (error) {
            fail(error);
        }
    });
    file
        .command('get')
        .argument('<file-id>', 'File entry ID')
        .action(async (fileId, options) => {
        try {
            const result = await new files_1.FileEndpoints(new client_1.AttioClient(options.apiKey)).getFile(fileId);
            printFileResult(result);
        }
        catch (error) {
            fail(error);
        }
    });
    file
        .command('upload')
        .argument('<object>', 'Record object slug or ID')
        .argument('<record-id>', 'Record ID')
        .argument('<path>', 'Local file path')
        .option('--parent-folder-id <id>', 'Upload inside this folder')
        .action(async (objectSlug, recordId, path, options) => {
        try {
            const result = await new files_1.FileEndpoints(new client_1.AttioClient(options.apiKey)).uploadFile(objectSlug, recordId, path, options.parentFolderId);
            printFileResult(result);
        }
        catch (error) {
            fail(error);
        }
    });
    file
        .command('download')
        .argument('<file-id>', 'Native Attio file ID')
        .requiredOption('--output <path>', 'Destination path')
        .option('--force', 'Replace an existing destination file')
        .action(async (fileId, options) => {
        try {
            const output = (0, node_path_1.resolve)(options.output);
            if (!options.force && (await exists(output))) {
                throw new Error(`Destination already exists: ${output}. Use --force to replace it.`);
            }
            const bytes = await new files_1.FileEndpoints(new client_1.AttioClient(options.apiKey)).downloadFile(fileId);
            await (0, promises_1.writeFile)(output, bytes);
            console.log((0, json_1.formatJson)({ file_id: fileId, output, bytes: bytes.length }));
        }
        catch (error) {
            fail(error);
        }
    });
    file
        .command('create-folder')
        .argument('<object>', 'Record object slug or ID')
        .argument('<record-id>', 'Record ID')
        .argument('<name>', 'Folder name')
        .option('--parent-folder-id <id>', 'Create inside this folder')
        .action(async (objectSlug, recordId, name, options) => {
        try {
            const result = await new files_1.FileEndpoints(new client_1.AttioClient(options.apiKey)).createFolder(objectSlug, recordId, name, options.parentFolderId);
            printFileResult(result);
        }
        catch (error) {
            fail(error);
        }
    });
    file
        .command('delete')
        .argument('<file-id>', 'File or folder entry ID')
        .action(async (fileId, options) => {
        try {
            await new files_1.FileEndpoints(new client_1.AttioClient(options.apiKey)).deleteFile(fileId);
            console.log((0, json_1.formatJson)({ deleted: true, file_id: fileId }));
        }
        catch (error) {
            fail(error);
        }
    });
    return file;
}
function printFileResult(result) {
    console.log((0, json_1.formatJson)(result));
}
async function exists(path) {
    try {
        await (0, promises_1.access)(path);
        return true;
    }
    catch {
        return false;
    }
}
function fail(error) {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    throw error;
}
//# sourceMappingURL=file.js.map