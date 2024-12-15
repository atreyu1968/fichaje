import { AuthService } from '../services/authService.js';

export const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(req.db, email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      // Implementar lógica de refresh token
      res.json({ success: true });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
};