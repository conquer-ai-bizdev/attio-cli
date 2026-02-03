import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getApiKey, getConfig, BASE_URL } from '../../../src/utils/config';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getApiKey', () => {
    it('should return API key from environment variable', () => {
      process.env.ATTIO_API_KEY = 'test-api-key';
      expect(getApiKey()).toBe('test-api-key');
    });

    it('should throw error if API key is not set', () => {
      delete process.env.ATTIO_API_KEY;
      expect(() => getApiKey()).toThrow(
        'ATTIO_API_KEY environment variable is not set'
      );
    });

    it('should throw error if API key is empty string', () => {
      process.env.ATTIO_API_KEY = '';
      expect(() => getApiKey()).toThrow(
        'ATTIO_API_KEY environment variable is not set'
      );
    });
  });

  describe('getConfig', () => {
    it('should return config with API key from environment', () => {
      process.env.ATTIO_API_KEY = 'test-api-key';
      const config = getConfig();
      expect(config.apiKey).toBe('test-api-key');
      expect(config.baseUrl).toBe(BASE_URL);
    });

    it('should use override API key if provided', () => {
      process.env.ATTIO_API_KEY = 'env-api-key';
      const config = getConfig('override-api-key');
      expect(config.apiKey).toBe('override-api-key');
      expect(config.baseUrl).toBe(BASE_URL);
    });
  });
});
