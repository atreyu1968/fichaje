import { TimeRecord } from '../models/TimeRecord.js';
import { WorkCenter } from '../models/WorkCenter.js';

export const timeRecordController = {
  async getByEmployee(req, res) {
    try {
      const records = await TimeRecord.findByEmployee(req.db, req.params.employeeId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async checkIn(req, res) {
    try {
      const { latitude, longitude } = req.body;
      
      // Validar si la ubicación está dentro del radio permitido
      const isValidLocation = await WorkCenter.isLocationValid(req.db, latitude, longitude);
      
      if (!isValidLocation) {
        return res.status(400).json({ 
          error: 'La ubicación no está dentro del radio permitido de ningún centro de trabajo' 
        });
      }

      const result = await TimeRecord.checkIn(req.db, {
        employeeId: req.body.employee_id,
        notes: req.body.notes,
        latitude,
        longitude
      });
      
      res.json({ id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async checkOut(req, res) {
    try {
      const { latitude, longitude } = req.body;
      
      // Validar ubicación también para el checkout
      const isValidLocation = await WorkCenter.isLocationValid(req.db, latitude, longitude);
      
      if (!isValidLocation) {
        return res.status(400).json({ 
          error: 'La ubicación no está dentro del radio permitido de ningún centro de trabajo' 
        });
      }

      await TimeRecord.checkOut(req.db, req.params.id, {
        notes: req.body.notes,
        latitude,
        longitude
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};