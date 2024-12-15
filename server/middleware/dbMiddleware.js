import { createConnection } from '../utils/database.js';

export const dbMiddleware = (req, res, next) => {
  req.db = createConnection();
  
  // Cerrar conexión cuando termine la respuesta
  res.on('finish', () => {
    if (req.db) {
      req.db.close((err) => {
        if (err) console.error('Error al cerrar la conexión:', err);
      });
    }
  });
  
  next();
};