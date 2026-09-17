"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEndpoints = void 0;
const node_path_1 = require("node:path");
const promises_1 = require("node:fs/promises");
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class FileEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async listFilesPage(objectSlug, recordId, options = {}) {
        const limit = options.limit ?? 50;
        if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
            throw new Error('File limit must be an integer between 1 and 200.');
        }
        const params = {
            object: objectSlug,
            record_id: recordId,
            limit,
        };
        if (options.storageProvider)
            params.storage_provider = options.storageProvider;
        if (options.parentFolderId)
            params.parent_folder_id = options.parentFolderId;
        if (options.cursor)
            params.cursor = options.cursor;
        const response = await this.client.get('/files', params);
        const validated = (0, validation_1.validate)(types_1.FilesResponseSchema, response);
        return {
            data: validated.data,
            nextCursor: validated.pagination.next_cursor,
        };
    }
    async listAllFiles(objectSlug, recordId, options = {}) {
        const byId = new Map();
        let cursor;
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
            for (const entry of page.data)
                byId.set(entry.id.file_id, entry);
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
    async getFile(fileId) {
        const response = await this.client.get(`/files/${fileId}`);
        return (0, validation_1.validate)(types_1.FileEntrySchema, response.data);
    }
    async downloadFile(fileId) {
        return this.client.getBinary(`/files/${fileId}/download`);
    }
    async uploadFile(objectSlug, recordId, filePath, parentFolderId) {
        const fileStat = await (0, promises_1.stat)(filePath);
        if (!fileStat.isFile())
            throw new Error(`Not a file: ${filePath}`);
        if (fileStat.size > 50 * 1024 * 1024) {
            throw new Error('Attio file uploads must not exceed 50 MB.');
        }
        const bytes = await (0, promises_1.readFile)(filePath);
        const form = new FormData();
        form.append('file', new Blob([new Uint8Array(bytes)]), (0, node_path_1.basename)(filePath));
        form.append('object', objectSlug);
        form.append('record_id', recordId);
        if (parentFolderId)
            form.append('parent_folder_id', parentFolderId);
        const response = await this.client.postForm('/files/upload', form);
        return (0, validation_1.validate)(types_1.FileEntrySchema, response.data);
    }
    async createFolder(objectSlug, recordId, name, parentFolderId) {
        const response = await this.client.post('/files', {
            object: objectSlug,
            record_id: recordId,
            file_type: 'folder',
            name,
            ...(parentFolderId ? { parent_folder_id: parentFolderId } : {}),
        });
        return (0, validation_1.validate)(types_1.FileEntrySchema, response.data);
    }
    async deleteFile(fileId) {
        await this.client.delete(`/files/${fileId}`);
    }
}
exports.FileEndpoints = FileEndpoints;
//# sourceMappingURL=files.js.map