import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import { PATHS, DB_CONFIG } from './constants.js';
import { logger } from './logger.js';

// Funciones de utilidad para queries
export const runQuery = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        logger.error('Error ejecutando query', { query, error: err.message });
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

export const getAllRows = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        logger.error('Error obteniendo registros', { query, error: err.message });
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const getRow = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        logger.error('Error obteniendo registro', { query, error: err.message });
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Funciones de gestión de conexión
export const ensureDatabaseDirectory = async () => {
  try {
    await fs.access(PATHS.DATA);
  } catch {
    await fs.mkdir(PATHS.DATA, { recursive: true });
    logger.info('Directorio de base de datos creado', { path: PATHS.DATA });
  }
};

export const createConnection = () => {
  const db = new sqlite3.Database(PATHS.DATABASE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      logger.error('Error al conectar con la base de datos', { error: err.message });
      throw err;
    }
    logger.info('Conexión a base de datos establecida');
  });
  
  db.on('error', (err) => {
    logger.error('Error en la base de datos', { error: err.message });
  });

  return db;
};

// Función de inicialización
export const initializeDatabase = async () => {
  await ensureDatabaseDirectory();
  const db = createConnection();
  
  try {
    // Configurar pragmas
    for (const pragma of DB_CONFIG.PRAGMAS) {
      await runQuery(db, pragma);
    }
    
    // Cargar y ejecutar schema
    const schema = await fs.readFile(PATHS.SCHEMA, 'utf-8');
    await new Promise((resolve, reject) => {
      db.exec(schema, (err) => {
        if (err) {
          logger.error('Error al ejecutar schema', { error: err.message });
          reject(err);
        } else {
          logger.info('Schema ejecutado correctamente');
          resolve();
        }
      });
    });
    
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
};