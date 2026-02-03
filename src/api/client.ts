import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { getConfig } from '../utils/config';
import { parseApiError, RateLimitError } from './errors';

export class AttioClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string;

  constructor(apiKeyOverride?: string) {
    const config = getConfig(apiKeyOverride);
    this.apiKey = config.apiKey;

    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
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
      const response: AxiosResponse<T> = await this.axiosInstance.request(
        config
      );
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
    const statusCode = error.response?.status || 500;
    const data = error.response?.data;

    // Handle rate limiting with retry
    if (statusCode === 429) {
      const retryAfterHeader = error.response?.headers['retry-after'];
      const retryAfter = retryAfterHeader
        ? parseInt(retryAfterHeader, 10)
        : 60;

      // Retry up to 3 times
      if (retryCount < 3) {
        await this.sleep(retryAfter * 1000);
        return this.request<T>(config, retryCount + 1);
      }

      throw new RateLimitError(retryAfter);
    }

    throw parseApiError(statusCode, data);
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
