import { Employee } from '../models/Employee.js';

export const employeeController = {
  async getAll(req, res) {
    try {
      const employees = await Employee.findAll(req.db);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const result = await Employee.create(req.db, req.body);
      res.json({ id: result.lastID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};