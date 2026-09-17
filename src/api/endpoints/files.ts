import { basename } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { AttioClient } from '../client';
import { FileEntry, FileEntrySchema, FilesResponseSchema } from '../types';
import { validate } from '../../utils/validation';

export type FileStorageProvider =
  | 'attio'
  | 'dropbox'
  | 'box'
  | 'google-drive'
  | 'microsoft-onedrive';

export interface ListFilesOptions {
  storageProvider?: FileStorageProvider;
  parentFolderId?: string;
  limit?: number;
  cursor?: string;
}

export interface FilePage {
  data: FileEntry[];
  nextCursor: string | null;
}

export interface CompleteFileInventory {
  data: FileEntry[];
  pagination: {
    complete: true;
    pages: number;
    items: number;
    duplicates_removed: number;
    next_cursor: null;
  };
}

export class FileEndpoints {
  constructor(private client: AttioClient) {}

  async listFilesPage(
    objectSlug: string,
    recordId: string,
    options: ListFilesOptions = {}
  ): Promise<FilePage> {
    const limit = options.limit ?? 50;
    if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
      throw new Error('File limit must be an integer between 1 and 200.');
    }
    const params: Record<string, unknown> = {
      object: objectSlug,
      record_id: recordId,
      limit,
    };
    if (options.storageProvider)
      params.storage_provider = options.storageProvider;
    if (options.parentFolderId)
      params.parent_folder_id = options.parentFolderId;
    if (options.cursor) params.cursor = options.cursor;

    const response = await this.client.get('/files', params);
    const validated = validate(FilesResponseSchema, response);
    return {
      data: validated.data,
      nextCursor: validated.pagination.next_cursor,
    };
  }

  async listAllFiles(
    objectSlug: string,
    recordId: string,
    options: Omit<ListFilesOptions, 'cursor'> = {}
  ): Promise<CompleteFileInventory> {
    const byId = new Map<string, FileEntry>();
    let cursor: string | undefined;
    let pages = 0;
    let observedItems = 0;

    do {
      const page = await this.listFilesPage(objectSlug, recordId, {
        ...options,
        ...(cursor ? { cursor } : {}),
        limit: options.limit ?? 200,
      });
      pages += 1;
      observedItems += page.data.length;
      for (const entry of page.data) byId.set(entry.id.file_id, entry);
      cursor = page.nextCursor ?? undefined;
    } while (cursor);

    const data = [...byId.values()];
    return {
      data,
      pagination: {
        complete: true,
        pages,
        items: data.length,
        duplicates_removed: observedItems - data.length,
        next_cursor: null,
      },
    };
  }

  async getFile(fileId: string): Promise<FileEntry> {
    const response = await this.client.get(`/files/${fileId}`);
    return validate(FileEntrySchema, (response as { data: unknown }).data);
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    return this.client.getBinary(`/files/${fileId}/download`);
  }

  async uploadFile(
    objectSlug: string,
    recordId: string,
    filePath: string,
    parentFolderId?: string
  ): Promise<FileEntry> {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error(`Not a file: ${filePath}`);
    if (fileStat.size > 50 * 1024 * 1024) {
      throw new Error('Attio file uploads must not exceed 50 MB.');
    }
    const bytes = await readFile(filePath);
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(bytes)]), basename(filePath));
    form.append('object', objectSlug);
    form.append('record_id', recordId);
    if (parentFolderId) form.append('parent_folder_id', parentFolderId);

    const response = await this.client.postForm('/files/upload', form);
    return validate(FileEntrySchema, (response as { data: unknown }).data);
  }

  async createFolder(
    objectSlug: string,
    recordId: string,
    name: string,
    parentFolderId?: string
  ): Promise<FileEntry> {
    const response = await this.client.post('/files', {
      object: objectSlug,
      record_id: recordId,
      file_type: 'folder',
      name,
      ...(parentFolderId ? { parent_folder_id: parentFolderId } : {}),
    });
    return validate(FileEntrySchema, (response as { data: unknown }).data);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.client.delete(`/files/${fileId}`);
  }
}
