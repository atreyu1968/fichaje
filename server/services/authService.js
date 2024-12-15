import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Employee } from '../models/Employee.js';

export class AuthService {
  static async login(db, email, password) {
    const employee = await Employee.findByEmail(db, email);
    
    if (!employee) {
      throw new Error('Credenciales inválidas');
    }

    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) {
      throw new Error('Credenciales inválidas');
    }

    const accessToken = this.generateAccessToken(employee);
    const refreshToken = this.generateRefreshToken(employee);

    await Employee.updateRefreshToken(db, employee.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeEmployee(employee)
    };
  }

  static generateAccessToken(employee) {
    return jwt.sign(
      { id: employee.id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  static generateRefreshToken(employee) {
    return jwt.sign(
      { id: employee.id, email: employee.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  static sanitizeEmployee(employee) {
    const { password, refresh_token, ...safeEmployee } = employee;
    return safeEmployee;
  }
}