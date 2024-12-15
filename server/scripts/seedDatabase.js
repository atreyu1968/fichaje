import { initializeDatabase } from '../utils/database.js';
import { hashPassword } from '../utils/auth.js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  let db;
  
  try {
    db = await initializeDatabase();
    logger.info('Base de datos inicializada');

    // Crear admin
    const adminPassword = await hashPassword('admin123');
    await db.run(
      'INSERT OR REPLACE INTO employees (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      ['Administrador', 'admin@empresa.com', adminPassword, 'admin', 'Administración']
    );
    logger.info('Usuario administrador creado');

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
      const hashedPassword = await hashPassword(employee.password);
      await db.run(
        'INSERT OR REPLACE INTO employees (name, email, password, department, role) VALUES (?, ?, ?, ?, ?)',
        [employee.name, employee.email, hashedPassword, employee.department, 'employee']
      );
      logger.info(`Empleado ${employee.name} creado`);
    }

    // Crear centro de trabajo de ejemplo
    await db.run(
      'INSERT OR REPLACE INTO work_centers (name, latitude, longitude, radius) VALUES (?, ?, ?, ?)',
      ['Oficina Central', 40.4167754, -3.7037902, 1000]
    );
    logger.info('Centro de trabajo creado');

  } catch (error) {
    logger.error('Error en el proceso de seeding:', error);
    process.exit(1);
  } finally {
    if (db) {
      db.close(() => {
        logger.info('Conexión cerrada');
        process.exit(0);
      });
    }
  }
};

// Ejecutar seeding
seedDatabase();