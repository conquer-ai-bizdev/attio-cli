import { describe, it, expect } from 'vitest';
import { getConfig, BASE_URL } from '../../../src/utils/config';

describe('config', () => {
  describe('getConfig', () => {
    it('should return the Attio API base URL without requiring a static key', () => {
      const config = getConfig();
      expect(config.baseUrl).toBe(BASE_URL);
      expect(config).not.toHaveProperty('apiKey');
    });
  });
});
