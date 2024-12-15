import { WorkCenter } from '../models/WorkCenter.js';

export const workCenterController = {
  async getAll(req, res) {
    try {
      const centers = await WorkCenter.findAll(req.db);
      res.json(centers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const result = await WorkCenter.create(req.db, req.body);
      res.json({ id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await WorkCenter.delete(req.db, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async validateLocation(req, res) {
    try {
      const { latitude, longitude } = req.body;
      const isValid = await WorkCenter.isLocationValid(req.db, latitude, longitude);
      res.json({ isValid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};