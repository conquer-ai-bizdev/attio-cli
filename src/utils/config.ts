import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const BASE_URL = 'https://api.attio.com/v2';

export function getApiKey(): string {
  const key = process.env.ATTIO_API_KEY || '';
  if (!key) {
    throw new Error(
      'ATTIO_API_KEY environment variable is not set. Please set it in your .env file or export it.'
    );
  }
  return key;
}

export interface Config {
  apiKey: string;
  baseUrl: string;
}

export function getConfig(apiKeyOverride?: string): Config {
  return {
    apiKey: apiKeyOverride || getApiKey(),
    baseUrl: BASE_URL,
  };
}
