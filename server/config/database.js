import { ensureDatabaseDirectory, createConnection, runQuery } from '../utils/database.js';
import { loadSchema } from '../utils/schema.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'database.sqlite');

export const initializeDatabase = async () => {
  try {
    // Asegurar que el directorio existe
    await ensureDatabaseDirectory();
    
    // Crear nueva conexión
    const db = createConnection();
    console.log('Conectado a la base de datos SQLite');

    // Habilitar foreign keys y WAL mode para mejor rendimiento y consistencia
    await Promise.all([
      runQuery(db, 'PRAGMA foreign_keys = ON'),
      runQuery(db, 'PRAGMA journal_mode = WAL')
    ]);

    // Cargar y ejecutar schema
    const schema = await loadSchema();
    await new Promise((resolve, reject) => {
      db.exec(schema, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Schema de la base de datos inicializado correctamente');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};