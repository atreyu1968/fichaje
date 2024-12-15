import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await authService.refreshToken(refreshToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => 
    api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
  refreshToken: (refreshToken) => 
    api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refreshToken })
};

export const employeeService = {
  getAll: () => api.get(API_CONFIG.ENDPOINTS.EMPLOYEES),
  create: (data) => api.post(API_CONFIG.ENDPOINTS.EMPLOYEES, data)
};

export const timeRecordService = {
  checkIn: (data) => 
    api.post(`${API_CONFIG.ENDPOINTS.TIME_RECORDS}/check-in`, data),
  checkOut: (id, data) => 
    api.put(`${API_CONFIG.ENDPOINTS.TIME_RECORDS}/check-out/${id}`, data),
  getByEmployee: (employeeId) => 
    api.get(`${API_CONFIG.ENDPOINTS.TIME_RECORDS}/${employeeId}`)
};