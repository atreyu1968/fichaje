import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite');
});

const seedDatabase = async () => {
  try {
    // Crear admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.run(
      'INSERT OR REPLACE INTO employees (id, name, email, password, role, department) VALUES (1, ?, ?, ?, ?, ?)',
      ['Administrador', 'admin@empresa.com', adminPassword, 'admin', 'Administración'],
      function(err) {
        if (err) {
          console.error('Error al crear admin:', err);
        } else {
          console.log('Usuario administrador creado con éxito');
        }
      }
    );

    // Crear empleados de prueba
    const testEmployees = [
      {
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        department: 'Desarrollo',
        password: 'empleado123'
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        department: 'Diseño',
        password: 'empleado123'
      },
      {
        name: 'María López',
        email: 'maria.lopez@empresa.com',
        department: 'Marketing',
        password: 'empleado123'
      }
    ];

    for (const employee of testEmployees) {
      const hashedPassword = await bcrypt.hash(employee.password, 10);
      db.run(
        'INSERT OR REPLACE INTO employees (name, email, password, department, role) VALUES (?, ?, ?, ?, ?)',
        [employee.name, employee.email, hashedPassword, employee.department, 'employee'],
        function(err) {
          if (err) {
            console.error(`Error al crear empleado ${employee.email}:`, err);
          } else {
            console.log(`Empleado creado con ID: ${this.lastID}`);
          }
        }
      );
    }

    // Crear centro de trabajo de ejemplo
    db.run(
      'INSERT OR REPLACE INTO work_centers (name, latitude, longitude, radius) VALUES (?, ?, ?, ?)',
      ['Oficina Central', 40.4167754, -3.7037902, 1000],
      function(err) {
        if (err) {
          console.error('Error al crear centro de trabajo:', err);
        } else {
          console.log('Centro de trabajo creado con éxito');
        }
      }
    );

  } catch (error) {
    console.error('Error en seedDatabase:', error);
  } finally {
    db.close(() => {
      console.log('Proceso de inserción completado');
    });
  }
};

seedDatabase();