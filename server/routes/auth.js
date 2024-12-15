import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

// Login
router.post('/login', authController.login);

// Refresh Token
router.post('/refresh-token', authController.refreshToken);

export { router as authRouter };