import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbMiddleware } from '../middleware/dbMiddleware.js';
import { authRouter } from '../routes/auth.js';
import { employeeRouter } from '../routes/employees.js';
import { timeRecordRouter } from '../routes/timeRecords.js';
import { workCenterRouter } from '../routes/workCenters.js';

dotenv.config();

export const createServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(dbMiddleware);

  // Rutas
  app.use('/api/auth', authRouter);
  app.use('/api/employees', employeeRouter);
  app.use('/api/time-records', timeRecordRouter);
  app.use('/api/work-centers', workCenterRouter);

  return { app, port };
};