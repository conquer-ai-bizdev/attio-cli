import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const BASE_URL = 'https://api.attio.com/v2';

export interface Config {
  baseUrl: string;
}

export function getConfig(): Config {
  return {
    baseUrl: BASE_URL,
  };
}
