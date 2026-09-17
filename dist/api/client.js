"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttioClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const tokens_1 = require("../auth/tokens");
const errors_1 = require("./errors");
class AttioClient {
    axiosInstance;
    apiKeyOverride;
    constructor(apiKeyOverride) {
        const config = (0, config_1.getConfig)();
        this.apiKeyOverride = apiKeyOverride;
        this.axiosInstance = axios_1.default.create({
            baseURL: config.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 seconds
        });
    }
    async request(config, retryCount = 0) {
        try {
            const token = await (0, tokens_1.getRestAccessToken)(this.apiKeyOverride);
            const response = await this.axiosInstance.request({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return this.handleError(error, config, retryCount);
            }
            throw error;
        }
    }
    async handleError(error, config, retryCount) {
        const method = (config.method || 'GET').toUpperCase();
        const path = config.url || '(unknown Attio endpoint)';
        const idempotent = method === 'GET' || method === 'HEAD';
        const requestId = getRequestId(error.response?.headers);
        const context = {
            method,
            path,
            ...(requestId ? { requestId } : {}),
            attempts: retryCount + 1,
        };
        if (!error.response) {
            throw (0, errors_1.createNetworkError)(error.message || 'Attio did not return a response', error.code || 'network_error', { ...context, retryable: idempotent });
        }
        const statusCode = error.response.status;
        const data = error.response?.data;
        if (statusCode === 401 &&
            !this.apiKeyOverride &&
            !process.env.ATTIO_API_KEY &&
            retryCount === 0) {
            await (0, tokens_1.getRestAccessToken)(undefined, true);
            return this.request(config, retryCount + 1);
        }
        // Log error details for debugging
        if (process.env.DEBUG_API_ERRORS) {
            console.error('API Error Details:', JSON.stringify({
                status: statusCode,
                url: config.url,
                method: config.method,
                data: data,
                requestBodyPresent: config.data !== undefined,
            }, null, 2));
        }
        // Handle rate limiting with retry
        if (statusCode === 429) {
            const retryAfterHeader = error.response?.headers['retry-after'];
            const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
            // Retry up to 3 times
            if (idempotent && retryCount < 3) {
                await this.sleep(retryAfter * 1000);
                return this.request(config, retryCount + 1);
            }
        }
        throw (0, errors_1.parseApiError)(statusCode, data, statusCode === 429
            ? parseRetryAfter(error.response.headers['retry-after'])
            : undefined, statusCode === 429 || statusCode >= 500
            ? { ...context, retryable: idempotent }
            : context);
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async get(path, params) {
        return this.request({
            method: 'GET',
            url: path,
            params,
        });
    }
    async post(path, data) {
        return this.request({
            method: 'POST',
            url: path,
            data,
        });
    }
    async postForm(path, data) {
        return this.request({
            method: 'POST',
            url: path,
            data,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    async getBinary(path) {
        const value = await this.request({
            method: 'GET',
            url: path,
            responseType: 'arraybuffer',
        });
        return Buffer.from(value);
    }
    async patch(path, data) {
        return this.request({
            method: 'PATCH',
            url: path,
            data,
        });
    }
    async put(path, data) {
        return this.request({
            method: 'PUT',
            url: path,
            data,
        });
    }
    async delete(path) {
        return this.request({
            method: 'DELETE',
            url: path,
        });
    }
}
exports.AttioClient = AttioClient;
function parseRetryAfter(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    if (typeof value === 'string') {
        const seconds = Number.parseInt(value, 10);
        if (Number.isFinite(seconds))
            return seconds;
    }
    return 60;
}
function getRequestId(headers) {
    if (!headers || typeof headers !== 'object')
        return undefined;
    const record = headers;
    const value = record['x-request-id'] ??
        record['x-attio-request-id'] ??
        record['request-id'];
    return typeof value === 'string' && value.trim() ? value : undefined;
}
//# sourceMappingURL=client.js.map