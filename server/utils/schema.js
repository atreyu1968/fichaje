import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, '..', 'schema.sql');

export const loadSchema = async () => {
  try {
    return await fs.readFile(SCHEMA_PATH, 'utf-8');
  } catch (error) {
    console.error('Error al leer el archivo de schema:', error);
    throw error;
  }
};