import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite');
});

// Eliminar tablas existentes
db.serialize(() => {
  db.run('PRAGMA foreign_keys = OFF');
  db.run('DROP TABLE IF EXISTS time_records');
  db.run('DROP TABLE IF EXISTS work_centers');
  db.run('DROP TABLE IF EXISTS employees');
  db.run('PRAGMA foreign_keys = ON');

  // Crear tabla de empleados
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    department TEXT,
    role TEXT DEFAULT 'employee',
    refresh_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Crear tabla de centros de trabajo
  db.run(`CREATE TABLE IF NOT EXISTS work_centers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    radius INTEGER DEFAULT 1000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Crear tabla de registros de tiempo
  db.run(`CREATE TABLE IF NOT EXISTS time_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    check_in DATETIME DEFAULT CURRENT_TIMESTAMP,
    check_out DATETIME,
    notes TEXT,
    latitude_in REAL,
    longitude_in REAL,
    latitude_out REAL,
    longitude_out REAL,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  )`);

  console.log('Base de datos reseteada correctamente');
  db.close();
});