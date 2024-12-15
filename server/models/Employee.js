import { runQuery, getAllRows, getRow } from '../utils/database.js';
import { hashPassword } from '../utils/auth.js';

export class Employee {
  static async findAll(db) {
    return await getAllRows(db, 'SELECT * FROM employees');
  }

  static async findByEmail(db, email) {
    return await getRow(db, 'SELECT * FROM employees WHERE email = ?', [email]);
  }

  static async create(db, { name, email, password, department }) {
    const hashedPassword = await hashPassword(password);
    return await runQuery(
      db,
      'INSERT INTO employees (name, email, password, department) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, department]
    );
  }

  static async updateRefreshToken(db, id, refreshToken) {
    return await runQuery(
      db,
      'UPDATE employees SET refresh_token = ? WHERE id = ?',
      [refreshToken, id]
    );
  }
}