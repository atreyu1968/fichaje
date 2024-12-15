import express from 'express';
import { timeRecordController } from '../controllers/timeRecordController.js';

const router = express.Router();

// Registrar entrada
router.post('/check-in', timeRecordController.checkIn);

// Registrar salida
router.put('/check-out/:id', timeRecordController.checkOut);

// Obtener registros de un empleado
router.get('/:employeeId', timeRecordController.getByEmployee);

export const timeRecordRouter = router;