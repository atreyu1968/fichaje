import { api } from './api.service';
import type { LoginCredentials, AuthResponse } from '../types/auth';
import { API_CONFIG } from '../config/api';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data) {
        this.setAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken });
      if (response.data) {
        this.setAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  static async logout(): Promise<void> {
    this.clearAuthData();
  }

  static clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static setAuthData(data: AuthResponse): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  static getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      this.clearAuthData();
      return null;
    }
  }
}