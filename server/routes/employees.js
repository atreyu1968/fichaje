import express from 'express';
import { employeeController } from '../controllers/employeeController.js';

const router = express.Router();

// Obtener todos los empleados
router.get('/', employeeController.getAll);

// Crear nuevo empleado
router.post('/', employeeController.create);

export const employeeRouter = router;