import { createServer } from './config/server.js';
import { initializeDatabase } from './config/database.js';

const startServer = async () => {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    console.log('Base de datos inicializada correctamente');

    // Crear y configurar servidor
    const { app, port } = createServer();

    // Iniciar servidor
    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();