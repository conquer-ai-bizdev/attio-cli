import { AttioClient } from '../client';
import { FileEntry } from '../types';
export type FileStorageProvider = 'attio' | 'dropbox' | 'box' | 'google-drive' | 'microsoft-onedrive';
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
export declare class FileEndpoints {
    private client;
    constructor(client: AttioClient);
    listFilesPage(objectSlug: string, recordId: string, options?: ListFilesOptions): Promise<FilePage>;
    listAllFiles(objectSlug: string, recordId: string, options?: Omit<ListFilesOptions, 'cursor'>): Promise<CompleteFileInventory>;
    getFile(fileId: string): Promise<FileEntry>;
    downloadFile(fileId: string): Promise<Buffer>;
    uploadFile(objectSlug: string, recordId: string, filePath: string, parentFolderId?: string): Promise<FileEntry>;
    createFolder(objectSlug: string, recordId: string, name: string, parentFolderId?: string): Promise<FileEntry>;
    deleteFile(fileId: string): Promise<void>;
}
//# sourceMappingURL=files.d.ts.map