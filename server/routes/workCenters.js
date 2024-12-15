import express from 'express';
import { workCenterController } from '../controllers/workCenterController.js';
import { authenticateToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.use(authenticateToken);

// Rutas que requieren ser administrador
router.use(isAdmin);

// Obtener todos los centros de trabajo
router.get('/', workCenterController.getAll);

// Crear nuevo centro de trabajo
router.post('/', workCenterController.create);

// Eliminar centro de trabajo
router.delete('/:id', workCenterController.delete);

// Validar ubicación
router.post('/validate-location', workCenterController.validateLocation);

export const workCenterRouter = router;