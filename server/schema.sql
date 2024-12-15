-- Eliminar tablas si existen
DROP TABLE IF EXISTS time_records;
DROP TABLE IF EXISTS work_centers;
DROP TABLE IF EXISTS employees;

-- Crear tabla de empleados
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  department TEXT,
  role TEXT DEFAULT 'employee',
  refresh_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de centros de trabajo
CREATE TABLE IF NOT EXISTS work_centers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius INTEGER DEFAULT 1000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de registros de tiempo
CREATE TABLE IF NOT EXISTS time_records (
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
);