import { access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Command } from 'commander';
import { AttioClient } from '../api/client';
import {
  FileEndpoints,
  FileStorageProvider,
  ListFilesOptions,
} from '../api/endpoints/files';
import { formatJson } from '../formatters/json';

export function createFileCommand(): Command {
  const file = new Command('file').description(
    'List, upload, download, and remove Attio record files'
  );

  file
    .command('list')
    .argument('<object>', 'Record object slug or ID')
    .argument('<record-id>', 'Record ID')
    .option('--storage-provider <provider>', 'Filter by storage provider')
    .option('--parent-folder-id <id>', 'Filter by parent folder')
    .option('--limit <number>', 'Page size, maximum 200', parseInt)
    .option('--cursor <cursor>', 'Fetch one page from this cursor')
    .option('--all', 'Follow cursors until Attio returns no next cursor')
    .action(async (objectSlug: string, recordId: string, options) => {
      try {
        if (options.all && options.cursor) {
          throw new Error('Cannot combine --all with --cursor.');
        }
        const api = new FileEndpoints(new AttioClient(options.apiKey));
        const request: ListFilesOptions = {
          storageProvider: options.storageProvider as
            | FileStorageProvider
            | undefined,
          parentFolderId: options.parentFolderId,
          limit: options.limit,
          cursor: options.cursor,
        };
        const result = options.all
          ? await api.listAllFiles(objectSlug, recordId, request)
          : await api.listFilesPage(objectSlug, recordId, request);
        printFileResult(result);
      } catch (error) {
        fail(error);
      }
    });

  file
    .command('get')
    .argument('<file-id>', 'File entry ID')
    .action(async (fileId: string, options) => {
      try {
        const result = await new FileEndpoints(
          new AttioClient(options.apiKey)
        ).getFile(fileId);
        printFileResult(result);
      } catch (error) {
        fail(error);
      }
    });

  file
    .command('upload')
    .argument('<object>', 'Record object slug or ID')
    .argument('<record-id>', 'Record ID')
    .argument('<path>', 'Local file path')
    .option('--parent-folder-id <id>', 'Upload inside this folder')
    .action(
      async (objectSlug: string, recordId: string, path: string, options) => {
        try {
          const result = await new FileEndpoints(
            new AttioClient(options.apiKey)
          ).uploadFile(objectSlug, recordId, path, options.parentFolderId);
          printFileResult(result);
        } catch (error) {
          fail(error);
        }
      }
    );

  file
    .command('download')
    .argument('<file-id>', 'Native Attio file ID')
    .requiredOption('--output <path>', 'Destination path')
    .option('--force', 'Replace an existing destination file')
    .action(async (fileId: string, options) => {
      try {
        const output = resolve(options.output);
        if (!options.force && (await exists(output))) {
          throw new Error(
            `Destination already exists: ${output}. Use --force to replace it.`
          );
        }
        const bytes = await new FileEndpoints(
          new AttioClient(options.apiKey)
        ).downloadFile(fileId);
        await writeFile(output, bytes);
        console.log(
          formatJson({ file_id: fileId, output, bytes: bytes.length })
        );
      } catch (error) {
        fail(error);
      }
    });

  file
    .command('create-folder')
    .argument('<object>', 'Record object slug or ID')
    .argument('<record-id>', 'Record ID')
    .argument('<name>', 'Folder name')
    .option('--parent-folder-id <id>', 'Create inside this folder')
    .action(
      async (objectSlug: string, recordId: string, name: string, options) => {
        try {
          const result = await new FileEndpoints(
            new AttioClient(options.apiKey)
          ).createFolder(objectSlug, recordId, name, options.parentFolderId);
          printFileResult(result);
        } catch (error) {
          fail(error);
        }
      }
    );

  file
    .command('delete')
    .argument('<file-id>', 'File or folder entry ID')
    .action(async (fileId: string, options) => {
      try {
        await new FileEndpoints(new AttioClient(options.apiKey)).deleteFile(
          fileId
        );
        console.log(formatJson({ deleted: true, file_id: fileId }));
      } catch (error) {
        fail(error);
      }
    });

  return file;
}

function printFileResult(result: unknown): void {
  console.log(formatJson(result));
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function fail(error: unknown): never {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
