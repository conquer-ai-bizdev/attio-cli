import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { getConfig } from '../utils/config';
import { getRestAccessToken } from '../auth/tokens';
import { createNetworkError, parseApiError } from './errors';

export class AttioClient {
  private axiosInstance: AxiosInstance;
  private readonly apiKeyOverride?: string;

  constructor(apiKeyOverride?: string) {
    const config = getConfig();
    this.apiKeyOverride = apiKeyOverride;

    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });
  }

  private async request<T>(
    config: AxiosRequestConfig,
    retryCount = 0
  ): Promise<T> {
    try {
      const token = await getRestAccessToken(this.apiKeyOverride);
      const response: AxiosResponse<T> =
        await this.axiosInstance.request({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return this.handleError<T>(error, config, retryCount);
      }
      throw error;
    }
  }

  private async handleError<T>(
    error: AxiosError,
    config: AxiosRequestConfig,
    retryCount: number
  ): Promise<T> {
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
      throw createNetworkError(
        error.message || 'Attio did not return a response',
        error.code || 'network_error',
        { ...context, retryable: idempotent }
      );
    }

    const statusCode = error.response.status;
    const data = error.response?.data;

    if (
      statusCode === 401 &&
      !this.apiKeyOverride &&
      !process.env.ATTIO_API_KEY &&
      retryCount === 0
    ) {
      await getRestAccessToken(undefined, true);
      return this.request<T>(config, retryCount + 1);
    }

    // Log error details for debugging
    if (process.env.DEBUG_API_ERRORS) {
      console.error(
        'API Error Details:',
        JSON.stringify(
          {
            status: statusCode,
            url: config.url,
            method: config.method,
            data: data,
            requestBodyPresent: config.data !== undefined,
          },
          null,
          2
        )
      );
    }

    // Handle rate limiting with retry
    if (statusCode === 429) {
      const retryAfterHeader = error.response?.headers['retry-after'];
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;

      // Retry up to 3 times
      if (idempotent && retryCount < 3) {
        await this.sleep(retryAfter * 1000);
        return this.request<T>(config, retryCount + 1);
      }
    }

    throw parseApiError(
      statusCode,
      data,
      statusCode === 429
        ? parseRetryAfter(error.response.headers['retry-after'])
        : undefined,
      statusCode === 429 || statusCode >= 500
        ? { ...context, retryable: idempotent }
        : context
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url: path,
      params,
    });
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url: path,
      data,
    });
  }

  async postForm<T>(path: string, data: FormData): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url: path,
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async getBinary(path: string): Promise<Buffer> {
    const value = await this.request<ArrayBuffer>({
      method: 'GET',
      url: path,
      responseType: 'arraybuffer',
    });
    return Buffer.from(value);
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url: path,
      data,
    });
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url: path,
      data,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url: path,
    });
  }
}

function parseRetryAfter(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const seconds = Number.parseInt(value, 10);
    if (Number.isFinite(seconds)) return seconds;
  }
  return 60;
}

function getRequestId(headers: unknown): string | undefined {
  if (!headers || typeof headers !== 'object') return undefined;
  const record = headers as Record<string, unknown>;
  const value =
    record['x-request-id'] ??
    record['x-attio-request-id'] ??
    record['request-id'];
  return typeof value === 'string' && value.trim() ? value : undefined;
}
