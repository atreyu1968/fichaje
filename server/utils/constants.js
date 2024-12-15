import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PATHS = {
  ROOT: join(__dirname, '..'),
  DATA: join(__dirname, '..', 'data'),
  SCHEMA: join(__dirname, '..', 'schema.sql'),
  DATABASE: join(__dirname, '..', 'data', 'database.sqlite')
} as const;

export const DB_CONFIG = {
  PRAGMAS: [
    'PRAGMA foreign_keys = ON',
    'PRAGMA journal_mode = WAL'
  ]
} as const;

export const AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '7d',
  SALT_ROUNDS: 10
} as const;